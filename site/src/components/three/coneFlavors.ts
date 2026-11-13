import type { Flavor as MenuFlavor } from '@/content/flavors';

// Visual looks for the 3D cone (colors only). Names match flavors on the real menu.
export type Flavor = {
  label: string;
  base: string;     // main cream color
  ribbon: string;   // marbled swirl color
  chunk: string;    // fruit / berry pieces
  speck: string;    // fine flecks (bean, seeds, berry skin)
  ribbonAmt: number;
  chunkAmt: number;
  speckAmt: number;
  chunkFreq: number; // size of pieces: higher = smaller, more numerous
  roughness: number;
};

export const FLAVORS = {
  blueberry: {
    label: 'Maine Blueberry',
    base: '#8a6ca8',
    ribbon: '#5a3a7c',
    chunk: '#2a153c',
    speck: '#241231',
    ribbonAmt: 0.4,
    chunkAmt: 0.95,
    speckAmt: 0.6,
    chunkFreq: 0.11,
    roughness: 0.5,
  },
  strawberry: {
    label: 'Strawberry',
    base: '#efb3c0',
    ribbon: '#f7d9df',
    chunk: '#c0304a',
    speck: '#7c1d2c',
    ribbonAmt: 0.45,
    chunkAmt: 0.95,
    speckAmt: 0.2,
    chunkFreq: 0.045,
    roughness: 0.52,
  },
  vanilla: {
    label: 'Vanilla',
    base: '#f8e3ad',
    ribbon: '#fdf0cf',
    chunk: '#f0d495',
    speck: '#3a2616',
    ribbonAmt: 0.3,
    chunkAmt: 0.2,
    speckAmt: 0.7,
    chunkFreq: 0.045,
    roughness: 0.55,
  },
} satisfies Record<string, Flavor>;

export type FlavorKey = keyof typeof FLAVORS;

// ---------------------------------------------------------------------------
// Any menu flavor -> a 3D look, derived from its display colors and family.
// The three hand-tuned looks above are used for their matching menu flavors.


const HAND_TUNED: Record<string, Flavor> = {
  Blueberry: FLAVORS.blueberry,
  Strawberry: FLAVORS.strawberry,
  Vanilla: FLAVORS.vanilla,
};

// Plain hex math (no three.js import) so this file can be used by non-3D UI
// without pulling the 3D library into the page's main bundle.
const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const shade = (hex: string, to: string, t: number) => {
  const a = rgb(hex), b = rgb(to);
  return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const lightness = (hex: string) => {
  const c = rgb(hex).map((v) => v / 255);
  return (Math.max(...c) + Math.min(...c)) / 2;
};

const cache = new Map<string, Flavor>();

/** Same flavor in, same object out, so the cone can tell when a scoop really changed. */
export function lookFor(f: MenuFlavor): Flavor {
  const hit = cache.get(f.name);
  if (hit) return hit;
  const look = HAND_TUNED[f.name] ?? deriveLook(f);
  cache.set(f.name, look);
  return look;
}

function deriveLook(f: MenuFlavor): Flavor {
  const lum = lightness(f.base);
  const dark = lum < 0.45;
  const fam = new Set(f.families);
  const fleck = f.fleck ?? shade(f.base, '#3a2616', 0.5);
  let chunkAmt = 0.15, chunkFreq = 0.06, speckAmt = 0;
  if (f.fleck) {
    if (fam.has('fruity')) { chunkAmt = 0.9; chunkFreq = 0.045; speckAmt = 0.2; }
    else if (fam.has('nutty')) { chunkAmt = 0.85; chunkFreq = 0.06; speckAmt = 0.3; }
    else { chunkAmt = 0.8; chunkFreq = 0.075; speckAmt = 0.45; }
  }
  return {
    label: f.name,
    base: f.base,
    ribbon: dark ? shade(f.base, '#1d1411', 0.3) : shade(f.base, '#ffffff', 0.35),
    chunk: fleck,
    speck: fleck,
    ribbonAmt: 0.35,
    chunkAmt,
    speckAmt,
    chunkFreq,
    roughness: dark ? 0.45 : 0.52,
  };
}

/** Linear blend between two looks (used for the animated flavor swap). */
export function mixLooks(a: Flavor, b: Flavor, t: number): Flavor {
  const c = (x: string, y: string) => shade(x, y, t);
  const n = (x: number, y: number) => x + (y - x) * t;
  return {
    label: t < 0.5 ? a.label : b.label,
    base: c(a.base, b.base),
    ribbon: c(a.ribbon, b.ribbon),
    chunk: c(a.chunk, b.chunk),
    speck: c(a.speck, b.speck),
    ribbonAmt: n(a.ribbonAmt, b.ribbonAmt),
    chunkAmt: n(a.chunkAmt, b.chunkAmt),
    speckAmt: n(a.speckAmt, b.speckAmt),
    chunkFreq: n(a.chunkFreq, b.chunkFreq),
    roughness: n(a.roughness, b.roughness),
  };
}
