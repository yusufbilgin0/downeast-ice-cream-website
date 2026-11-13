// Visual looks for the prototype. These are art-direction placeholders, not the
// shop's actual recipes or flavor list - confirm names and looks with the client.
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
    ribbon: '#4a2a68',
    chunk: '#2a153c',
    speck: '#241231',
    ribbonAmt: 0.75,
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
    base: '#f5e2b3',
    ribbon: '#fbf1d8',
    chunk: '#eed49c',
    speck: '#3a2616',
    ribbonAmt: 0.35,
    chunkAmt: 0.25,
    speckAmt: 0.9,
    chunkFreq: 0.045,
    roughness: 0.55,
  },
} satisfies Record<string, Flavor>;

export type FlavorKey = keyof typeof FLAVORS;
