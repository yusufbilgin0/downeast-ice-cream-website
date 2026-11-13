"use client";

import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SCOOPS, CONE_H, buildCone, buildDrip, buildRim, buildScoop } from './geometry';
import { applyFlavor, makeCreamMaterial, makeWaffleMaterial } from './materials';
import { FLAVORS, mixLooks, type Flavor } from './coneFlavors';

export type HarborConeProps = {
  /**
   * Look per scoop. Changing one animates that scoop (color blend + drop-in squash).
   * Only shader uniforms change: no geometry rebuild and no shader recompile.
   */
  looks?: Looks;
  /** Freeze idle motion and pointer tilt (for stills / screenshots). */
  still?: boolean;
  /** Idle loop length in seconds. */
  loop?: number;
  /** Max tilt toward the pointer, in degrees. */
  tilt?: number;
  /** Mesh density: "high" for desktop, "low" for phones and weaker GPUs. */
  detail?: 'high' | 'low';
  /** Called once the meshes have been drawn for the first time. */
  onReady?: () => void;
  /** Phone mode: slow turntable rotation and drag-to-spin; no pointer tilt (it twitches while scrolling). */
  touch?: boolean;
};

export type Slot = 'top' | 'middle' | 'bottom';
export type Looks = Record<Slot, Flavor>;
const SLOTS: Slot[] = ['bottom', 'middle', 'top'];
const DEFAULT_LOOKS: Looks = { top: FLAVORS.blueberry, middle: FLAVORS.strawberry, bottom: FLAVORS.vanilla };
const SWAP_MS = 520;
const TURNTABLE = (Math.PI * 2) / 26; // one turn every 26 s (phones)
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const DEG = Math.PI / 180;
const DESIGN_SCALE = 0.01; // design units (Spline numbers) -> scene units
const CENTER_Y = 330; // design-unit height the cone pivots around

export function HarborCone({
  looks = DEFAULT_LOOKS,
  still = false,
  loop = 8,
  tilt = 8,
  detail = 'high',
  onReady,
  touch = false,
}: HarborConeProps) {
  const lo = detail === 'low';
  const geo = useMemo(
    () => ({
      cone: lo ? buildCone(140, 64) : buildCone(),
      rim: lo ? buildRim(120, 16) : buildRim(),
      bottom: lo ? buildScoop(SCOOPS.bottom, 110, 76) : buildScoop(SCOOPS.bottom),
      middle: lo ? buildScoop(SCOOPS.middle, 110, 76) : buildScoop(SCOOPS.middle),
      top: lo ? buildScoop(SCOOPS.top, 110, 76) : buildScoop(SCOOPS.top),
      drip: buildDrip(SCOOPS.top),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const mats = useMemo(
    () => ({
      cone: makeWaffleMaterial(true),
      rim: makeWaffleMaterial(false),
      bottom: makeCreamMaterial(looks.bottom, 0.1),
      middle: makeCreamMaterial(looks.middle, 0.5),
      top: makeCreamMaterial(looks.top, 0.9),
    }),
    // materials are created once; flavor changes are animated in useFrame below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Per-scoop swap animation: what is shown now, where it is heading, and when it started.
  const swap = useRef<Record<Slot, { from: Flavor; to: Flavor; shown: Flavor; t0: number }>>({
    top: { from: looks.top, to: looks.top, shown: looks.top, t0: -1e9 },
    middle: { from: looks.middle, to: looks.middle, shown: looks.middle, t0: -1e9 },
    bottom: { from: looks.bottom, to: looks.bottom, shown: looks.bottom, t0: -1e9 },
  });
  useEffect(() => {
    for (const slot of SLOTS) {
      const sw = swap.current[slot];
      if (looks[slot] !== sw.to) {
        swap.current[slot] = { from: sw.shown, to: looks[slot], shown: sw.shown, t0: performance.now() };
      }
    }
  }, [looks]);
  const scoopGroups = useRef<Partial<Record<Slot, THREE.Group>>>({});

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mats).forEach((m) => m.dispose());
    },
    [geo, mats],
  );

  // Pointer / touch target, tracked on the window so the tilt works anywhere on the page.
  const target = useRef({ x: 0, y: 0, last: 0 });
  useEffect(() => {
    if (touch) return;
    const set = (cx: number, cy: number) => {
      target.current.x = THREE.MathUtils.clamp((cx / window.innerWidth) * 2 - 1, -1, 1);
      target.current.y = THREE.MathUtils.clamp(-((cy / window.innerHeight) * 2 - 1), -1, 1);
      target.current.last = performance.now();
    };
    const onPointer = (e: PointerEvent) => set(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) set(t.clientX, t.clientY);
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [touch]);

  // Drag horizontally on the cone to spin it; it coasts to a stop (inertia).
  const dom = useThree((st) => st.gl.domElement);
  // Phones get a short spin-in when the 3D appears, so it reads as "alive".
  const spin = useRef({ angle: 0, vel: touch ? 5 : 0, dragging: false, lastX: 0, lastT: 0 });
  useEffect(() => {
    const sp = spin.current;
    const down = (e: PointerEvent) => {
      sp.dragging = true;
      sp.lastX = e.clientX;
      sp.lastT = performance.now();
      sp.vel = 0;
    };
    const move = (e: PointerEvent) => {
      if (!sp.dragging) return;
      const now = performance.now();
      const dx = e.clientX - sp.lastX;
      const d = (dx / Math.max(dom.clientWidth, 1)) * Math.PI * 2;
      sp.angle += d;
      sp.vel = d / Math.max((now - sp.lastT) / 1000, 0.008);
      sp.lastX = e.clientX;
      sp.lastT = now;
    };
    const up = () => {
      sp.dragging = false;
    };
    dom.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      dom.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [dom]);

  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // Soft studio contact shadow: a radial-gradient card instead of a shadow render pass
  // (cheaper on mobile). It tightens and darkens as the cone floats down.
  const shadowTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    const grd = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(29,45,74,0.55)');
    grd.addColorStop(0.35, 'rgba(29,45,74,0.28)');
    grd.addColorStop(1, 'rgba(29,45,74,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => shadowTex.dispose(), [shadowTex]);
  const shadow = useRef<THREE.Mesh>(null);

  const rig = useRef<THREE.Group>(null);
  const cur = useRef({ x: 0, y: 0 });
  const frames = useRef(0);
  useFrame(({ clock }, dt) => {
    const g = rig.current;
    if (!g) return;
    // Report readiness after a couple of frames so shaders have compiled and drawn.
    if (frames.current < 3 && ++frames.current === 3) onReady?.();

    // Flavor swaps: blend colors and drop the scoop in with a small squash-and-settle.
    const now = performance.now();
    for (const slot of SLOTS) {
      const sw = swap.current[slot];
      const p = reduceMotion ? 1 : Math.min(1, (now - sw.t0) / SWAP_MS);
      const grp = scoopGroups.current[slot];
      if (p < 1 || sw.shown !== sw.to) {
        sw.shown = p >= 1 ? sw.to : mixLooks(sw.from, sw.to, easeOut(p));
        applyFlavor(mats[slot], sw.shown);
      }
      if (grp) {
        const drop = p < 1 ? (1 - easeOut(Math.min(1, p * 1.6))) * 70 : 0;
        const wob = p < 1 ? Math.sin(p * Math.PI * 3) * (1 - p) * 0.14 : 0;
        grp.position.y = SCOOPS[slot].y + drop;
        grp.scale.set(1 + wob, 1 - wob, 1 + wob);
      }
    }
    const s = shadow.current;
    if (s) {
      const lift = g.position.y / 0.08; // -1..1
      const k = 1 + lift * 0.06;
      s.scale.set(2.2 * k, 1.5 * k, 1);
      (s.material as THREE.MeshBasicMaterial).opacity = 0.9 - lift * 0.12;
    }
    if (still) {
      g.position.y = 0;
      g.rotation.set(0, 0, 0);
      return;
    }
    const t = target.current;
    if (performance.now() - t.last > 3000) {
      t.x *= 0.97;
      t.y *= 0.97;
    }
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 4); // frame-rate independent easing
    cur.current.x += (t.x - cur.current.x) * k;
    cur.current.y += (t.y - cur.current.y) * k;
    const ph = reduceMotion ? 0 : (clock.elapsedTime / loop) * Math.PI * 2;
    const tl = tilt * DEG;
    g.position.y = Math.sin(ph) * 0.08;
    const sp = spin.current;
    if (!sp.dragging) {
      if (touch && !reduceMotion) sp.angle += Math.min(dt, 0.1) * TURNTABLE; // slow showroom turn
      sp.angle += sp.vel * Math.min(dt, 0.1);
      sp.vel *= Math.exp(-Math.min(dt, 0.1) * 2.5);
      sp.vel = THREE.MathUtils.clamp(sp.vel, -12, 12);
    }
    g.rotation.y = sp.angle + Math.sin(ph) * 10 * DEG + cur.current.x * tl;
    g.rotation.x = -cur.current.y * tl;
    g.rotation.z = -cur.current.x * tl * 0.35 + Math.sin(ph * 2) * 1.2 * DEG;
  });

  return (
    <>
    <mesh ref={shadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -CENTER_Y * DESIGN_SCALE - 0.5, 0]} renderOrder={-1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={shadowTex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
    <group ref={rig}>
      <group scale={DESIGN_SCALE} position={[0, -CENTER_Y * DESIGN_SCALE, 0]}>
        <mesh name="Cone_Waffle" geometry={geo.cone} material={mats.cone} />
        <mesh name="Cone_Rim" geometry={geo.rim} material={mats.rim} />
        {SLOTS.map((slot) => {
          const S = SCOOPS[slot];
          // Each scoop sits in a group at its own center so it can squash around itself.
          return (
            <group
              key={slot}
              ref={(g) => {
                if (g) scoopGroups.current[slot] = g;
              }}
              position={[S.x, S.y, S.z]}
            >
              <group position={[-S.x, -S.y, -S.z]}>
                <mesh name={`Scoop_${slot}`} geometry={geo[slot]} material={mats[slot]} />
                {slot === 'top' && <mesh name="Drip_Top" geometry={geo.drip} material={mats.top} />}
              </group>
            </group>
          );
        })}
      </group>
    </group>
    </>
  );
}

export const CONE_TIP_Y = -CENTER_Y * DESIGN_SCALE;
export const CONE_TOP_Y = (SCOOPS.top.y + SCOOPS.top.R * 0.9 - CENTER_Y) * DESIGN_SCALE;
export { CONE_H };
