import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SCOOPS, CONE_H, buildCone, buildDrip, buildRim, buildScoop } from './geometry';
import { applyFlavor, makeCreamMaterial, makeWaffleMaterial } from './materials';
import { FLAVORS, type FlavorKey } from './flavors';

export type HarborConeProps = {
  /** Flavor per scoop. Swapping only updates shader uniforms - no rebuild, no recompile. */
  flavors?: { top: FlavorKey; middle: FlavorKey; bottom: FlavorKey };
  /** Freeze idle motion and pointer tilt (for stills / screenshots). */
  still?: boolean;
  /** Idle loop length in seconds. */
  loop?: number;
  /** Max tilt toward the pointer, in degrees. */
  tilt?: number;
};

const DEG = Math.PI / 180;
const DESIGN_SCALE = 0.01; // design units (Spline numbers) -> scene units
const CENTER_Y = 330; // design-unit height the cone pivots around

export function HarborCone({
  flavors = { top: 'blueberry', middle: 'strawberry', bottom: 'vanilla' },
  still = false,
  loop = 8,
  tilt = 8,
}: HarborConeProps) {
  const geo = useMemo(
    () => ({
      cone: buildCone(),
      rim: buildRim(),
      bottom: buildScoop(SCOOPS.bottom),
      middle: buildScoop(SCOOPS.middle),
      top: buildScoop(SCOOPS.top),
      drip: buildDrip(SCOOPS.top),
    }),
    [],
  );

  const mats = useMemo(
    () => ({
      cone: makeWaffleMaterial(true),
      rim: makeWaffleMaterial(false),
      bottom: makeCreamMaterial(FLAVORS[flavors.bottom], 0.1),
      middle: makeCreamMaterial(FLAVORS[flavors.middle], 0.5),
      top: makeCreamMaterial(FLAVORS[flavors.top], 0.9),
    }),
    // materials are created once; flavor changes go through applyFlavor below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    applyFlavor(mats.top, FLAVORS[flavors.top]);
    applyFlavor(mats.middle, FLAVORS[flavors.middle]);
    applyFlavor(mats.bottom, FLAVORS[flavors.bottom]);
  }, [flavors.top, flavors.middle, flavors.bottom, mats]);

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
  }, []);

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
  useFrame(({ clock }, dt) => {
    const g = rig.current;
    if (!g) return;
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
    g.rotation.y = Math.sin(ph) * 10 * DEG + cur.current.x * tl;
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
        <mesh name="Scoop_Bottom" geometry={geo.bottom} material={mats.bottom} />
        <mesh name="Scoop_Middle" geometry={geo.middle} material={mats.middle} />
        <mesh name="Scoop_Top" geometry={geo.top} material={mats.top} />
        <mesh name="Drip_Top" geometry={geo.drip} material={mats.top} />
      </group>
    </group>
    </>
  );
}

export const CONE_TIP_Y = -CENTER_Y * DESIGN_SCALE;
export const CONE_TOP_Y = (SCOOPS.top.y + SCOOPS.top.R * 0.9 - CENTER_Y) * DESIGN_SCALE;
export { CONE_H };
