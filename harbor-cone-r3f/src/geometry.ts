import * as THREE from 'three';
import { fbm, smoothstep } from './noise';

// All geometry is built in "design units" (the same numbers as the Spline file:
// cone 300 tall, ~1 unit = 1/3 mm of a real cone). The scene scales it by 0.01.

const TAU = Math.PI * 2;
export const CONE_H = 300;
const CONE_R = 88;

export type ScoopSpec = { R: number; x: number; y: number; z: number; ph: number };

export const SCOOPS: Record<'bottom' | 'middle' | 'top', ScoopSpec> = {
  bottom: { R: 98, x: 0, y: 342, z: 0, ph: 0.3 },
  middle: { R: 90, x: 5, y: 453, z: 2, ph: 2.1 },
  top: { R: 84, x: -4, y: 568, z: -1, ph: 4.4 },
};

const SQUASH = 0.93;

// Smooth sawtooth for a curled sheet: a crisp torn step on one side, a long smooth
// ramp on the other - how layers of a scooped ice-cream ribbon overlap.
const layerStep = (u: number) => {
  const f = u - Math.floor(u);
  return smoothstep(0, 0.07, f) * Math.pow(1 - f, 1.6);
};

/** Radius of a hand-scooped scoop in direction (th, t); t = polar angle from the top. */
function scoopRadius(S: ScoopSpec, th: number, t: number): number {
  const dx = Math.sin(t) * Math.cos(th), dy = Math.cos(t), dz = Math.sin(t) * Math.sin(th);
  const p = S.ph;
  // broad lumps + finer unevenness
  let r = 1 + 0.07 * fbm(dx * 1.4 + p, dy * 1.4, dz * 1.4) + 0.025 * fbm(dx * 4 + p * 2, dy * 4, dz * 4, 3);
  const body = smoothstep(0.05, 0.6, t) * (1 - smoothstep(1.7, 1.95, t));
  // curled sheet: the scooper rolls the cream around a roughly horizontal axis, leaving
  // stacked layers whose torn edges arc over the crown (axis yaw varies per scoop)
  const ax = Math.cos(p * 1.7), az = Math.sin(p * 1.7);
  const along = dx * ax + dz * az; // coordinate along the roll axis
  const across = -dx * az + dz * ax;
  const psi = Math.atan2(dy, across);
  // whole number of layers per turn, so the curl wraps around with no seam
  const u = (psi / (Math.PI * 2)) * 3 + 0.55 * fbm(dx * 1.8 + p, dy * 1.8, dz * 1.8, 3) + 0.25 * along;
  r += 0.1 * layerStep(u) * body * (0.7 + 0.5 * fbm(dx * 3 + 4, dy * 3, dz * 3 + p, 2));
  // fine drag striations along the curl
  const warp = 2.2 * fbm(dx * 2 + p, dy * 2 + 3, dz * 2, 3);
  const fold = Math.sin(15 * th + 3 * Math.sin(2 * t + p) + warp);
  r += 0.012 * Math.pow(1 - Math.abs(fold), 4) * body;
  // ragged, torn lip just below the equator
  const tc = 1.93 + 0.15 * fbm(dx * 2.2 + p + 5, dy * 2.2, dz * 2.2, 3);
  const amp = 0.12 * (0.75 + 0.7 * fbm(dx * 3 + p + 9, dy * 3, dz * 3, 3)) + 0.05 * fbm(dx * 11 + p, dy * 11, dz * 11, 3);
  r += amp * Math.exp(-Math.pow((t - tc) / 0.15, 2));
  // curl groove under the lip
  r -= 0.035 * Math.exp(-Math.pow((t - tc - 0.17) / 0.06, 2));
  // tuck the base in so it nests on the scoop below
  r *= 1 - 0.38 * smoothstep(tc + 0.1, Math.PI, t);
  return S.R * r;
}

export function scoopSurface(S: ScoopSpec, th: number, t: number, off = 0): THREE.Vector3 {
  const r = scoopRadius(S, th, t) + off;
  return new THREE.Vector3(
    S.x + r * Math.sin(t) * Math.cos(th),
    S.y + r * Math.cos(t) * SQUASH,
    S.z + r * Math.sin(t) * Math.sin(th),
  );
}

/** Closed scoop mesh with welded poles (no pinching at the crown). */
export function buildScoop(S: ScoopSpec, NA = 180, NT = 120): THREE.BufferGeometry {
  const pos: number[] = [];
  const idx: number[] = [];
  const top = scoopSurface(S, 0, 0);
  pos.push(top.x, top.y, top.z);
  for (let j = 1; j < NT; j++) {
    const t = (j / NT) * Math.PI;
    for (let i = 0; i < NA; i++) {
      const p = scoopSurface(S, (i / NA) * TAU, t);
      pos.push(p.x, p.y, p.z);
    }
  }
  const bot = scoopSurface(S, 0, Math.PI);
  pos.push(bot.x, bot.y, bot.z);
  const ring = (j: number, i: number) => 1 + (j - 1) * NA + (i % NA);
  const last = pos.length / 3 - 1;
  for (let i = 0; i < NA; i++) idx.push(0, ring(1, i + 1), ring(1, i));
  for (let j = 1; j < NT - 1; j++) {
    for (let i = 0; i < NA; i++) {
      const a = ring(j, i), b = ring(j, i + 1), c = ring(j + 1, i), d = ring(j + 1, i + 1);
      idx.push(a, b, c, b, d, c);
    }
  }
  for (let i = 0; i < NA; i++) idx.push(last, ring(NT - 1, i), ring(NT - 1, i + 1));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/**
 * Waffle cone laid out on its unrolled sector, so grid cells stay a constant size
 * (like real rolled dough). The uv attribute carries the diagonal grid coordinates;
 * the shader draws crisp ridges from it. Vertex colors carry the bake browning.
 */
export function buildCone(SA = 220, SH = 100): THREE.BufferGeometry {
  const L = Math.hypot(CONE_H, CONE_R), CELL = 30;
  const pos: number[] = [], uv: number[] = [], col: number[] = [], idx: number[] = [];
  const ridge = (x: number) => { const d = Math.abs(x - Math.round(x)); return Math.exp(-(d * d) / 0.012); };
  const tip = new THREE.Color('#8f521e'), mid = new THREE.Color('#d39a52'), rimBand = new THREE.Color('#b0702f');
  const c = new THREE.Color();
  for (let j = 0; j <= SH; j++) {
    const h = j / SH;
    for (let i = 0; i <= SA; i++) {
      const a = -Math.PI / 2 + (i / SA) * TAU; // seam at the back
      const rho = h * L, phi = (i / SA) * TAU * CONE_R / L;
      const X = rho * Math.cos(phi), Y = rho * Math.sin(phi);
      const u = (X + Y) / CELL, w = (X - Y) / CELL;
      const ca = Math.cos(a), sa = Math.sin(a);
      const dough = fbm(ca * 2 + 7, h * 6, sa * 2, 3);
      const d = (1.4 * Math.max(ridge(u), ridge(w)) + 0.9 * dough) * Math.min(1, h * 5);
      const r = CONE_R * h + d;
      pos.push(r * ca, h * CONE_H, r * sa);
      uv.push(u, w);
      c.copy(tip).lerp(mid, smoothstep(0.0, 0.4, h)).lerp(rimBand, smoothstep(0.86, 1.0, h));
      const blotch = 1 + 0.09 * fbm(ca * 3 + 1, h * 9, sa * 3, 3);
      col.push(c.r * blotch, c.g * blotch, c.b * blotch);
    }
  }
  const row = SA + 1;
  for (let j = 0; j < SH; j++) for (let i = 0; i < SA; i++) {
    const p = j * row + i;
    idx.push(p, p + row, p + 1, p + 1, p + row, p + row + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  // weld the seam's normals so no shading line shows
  const n = g.getAttribute('normal') as THREE.BufferAttribute;
  for (let j = 0; j <= SH; j++) {
    const a = j * row, b = j * row + SA;
    const v = new THREE.Vector3(n.getX(a) + n.getX(b), n.getY(a) + n.getY(b), n.getZ(a) + n.getZ(b)).normalize();
    n.setXYZ(a, v.x, v.y, v.z);
    n.setXYZ(b, v.x, v.y, v.z);
  }
  return g;
}

/** Rolled rim: a crimped, slightly irregular torus, toasted darker on its outer edge. */
export function buildRim(MA = 200, MB = 24): THREE.BufferGeometry {
  const pos: number[] = [], col: number[] = [], idx: number[] = [];
  const Rm = 89, rr = 11;
  const light = new THREE.Color('#d29a52'), dark = new THREE.Color('#94561f');
  const c = new THREE.Color();
  for (let i = 0; i < MA; i++) {
    const a = (i / MA) * TAU;
    const ca = Math.cos(a), sa = Math.sin(a);
    const wob = 1 + 0.07 * fbm(ca * 2, sa * 2, 0.5, 3) + 0.035 * Math.sin(46 * a);
    for (let j = 0; j < MB; j++) {
      const b = (j / MB) * TAU;
      const rad = Rm + rr * wob * Math.cos(b);
      pos.push(rad * ca, CONE_H - 2 + rr * wob * 0.9 * Math.sin(b), rad * sa);
      const outer = smoothstep(-0.2, 1, Math.cos(b)) * (1 - smoothstep(0.2, 1, Math.sin(b)));
      c.copy(light).lerp(dark, 0.65 * outer + 0.2 * (0.5 + 0.5 * fbm(ca * 5, sa * 5, b, 2)));
      col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < MA; i++) for (let j = 0; j < MB; j++) {
    const i2 = (i + 1) % MA, j2 = (j + 1) % MB;
    const p = i * MB + j, q = i2 * MB + j, p2 = i * MB + j2, q2 = i2 * MB + j2;
    idx.push(p, p2, q, q, p2, q2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** A melt drip that runs over the top scoop's lip and hangs with a bead. */
export function buildDrip(S: ScoopSpec, th0 = Math.PI / 2 - 0.35): THREE.BufferGeometry {
  const path: THREE.Vector3[] = [];
  // starts below the surface and rises out of it, so the drip grows out of the cream
  for (let k = 0; k <= 22; k++) {
    const a = k / 22;
    path.push(scoopSurface(S, th0, 0.9 + a * 1.1, -4 + 5.5 * smoothstep(0, 0.45, a)));
  }
  const last = path[path.length - 1];
  for (let k = 1; k <= 12; k++) {
    path.push(new THREE.Vector3(last.x - Math.cos(th0) * k * 0.45, last.y - k * 2.9, last.z - Math.sin(th0) * k * 0.45));
  }
  const n2 = new THREE.Vector3(-Math.sin(th0), 0, Math.cos(th0));
  const RS = 20, NP = path.length;
  const pos: number[] = [], idx: number[] = [];
  const T = new THREE.Vector3(), n1 = new THREE.Vector3();
  for (let k = 0; k < NP; k++) {
    const s = k / (NP - 1);
    T.subVectors(path[Math.min(NP - 1, k + 1)], path[Math.max(0, k - 1)]).normalize();
    n1.crossVectors(n2, T).normalize();
    let rad = 12 - 6 * smoothstep(0, 0.6, s) + 4.5 * Math.exp(-Math.pow((s - 0.87) / 0.07, 2));
    if (s < 0.06) rad *= Math.sqrt(s / 0.06);
    if (s > 0.93) rad *= Math.sqrt(Math.max(0, (1 - s) / 0.07));
    const flat = 0.3 + 0.55 * smoothstep(0.45, 0.7, s); // flat sheet on the scoop, round where it hangs
    for (let i = 0; i < RS; i++) {
      const f = (i / RS) * TAU;
      const cf = Math.cos(f) * flat, sf = Math.sin(f) * 1.2;
      pos.push(
        path[k].x + rad * (cf * n1.x + sf * n2.x),
        path[k].y + rad * (cf * n1.y + sf * n2.y),
        path[k].z + rad * (cf * n1.z + sf * n2.z),
      );
    }
  }
  for (let k = 0; k < NP - 1; k++) for (let i = 0; i < RS; i++) {
    const i2 = (i + 1) % RS;
    const a = k * RS + i, b = k * RS + i2, c = (k + 1) * RS + i, d = (k + 1) * RS + i2;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
