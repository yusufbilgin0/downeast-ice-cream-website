import * as THREE from 'three';
import type { Flavor } from './coneFlavors';

// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT licence).
const SNOISE = /* glsl */ `
vec3 hc_mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 hc_mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
vec4 hc_permute(vec4 x){return hc_mod289(((x*34.0)+1.0)*x);}
vec4 hc_tis(vec4 r){return 1.79284291400159 - 0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = hc_mod289(i);
  vec4 p = hc_permute(hc_permute(hc_permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = hc_tis(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// Bump from a scalar height field using screen-space derivatives (no textures needed).
const BUMP = /* glsl */ `
{
  vec3 hcDpx = dFdx(-vViewPosition);
  vec3 hcDpy = dFdy(-vViewPosition);
  float hcHx = dFdx(hcHeight) * uBump;
  float hcHy = dFdy(hcHeight) * uBump;
  vec3 hcR1 = cross(hcDpy, normal);
  vec3 hcR2 = cross(normal, hcDpx);
  float hcDet = dot(hcDpx, hcR1);
  vec3 hcGrad = sign(hcDet) * (hcHx * hcR1 + hcHy * hcR2);
  normal = normalize(abs(hcDet) * normal - hcGrad);
}
`;

const VERT_DECL = 'varying vec3 vObjPos;\nvarying vec2 vWaf;\n';

function patchVertex(src: string) {
  return src
    .replace('#include <common>', `#include <common>\n${VERT_DECL}`)
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvObjPos = position;\nvWaf = uv;');
}

export type CreamUniforms = {
  uBase: { value: THREE.Color };
  uRibbon: { value: THREE.Color };
  uChunk: { value: THREE.Color };
  uSpeck: { value: THREE.Color };
  uRibbonAmt: { value: number };
  uChunkAmt: { value: number };
  uSpeckAmt: { value: number };
  uChunkFreq: { value: number };
  uGlow: { value: number };
  uGrain: { value: number };
  uBump: { value: number };
  uSeed: { value: number };
};

/**
 * Ice-cream material: MeshPhysicalMaterial (sheen for a frosty bloom, a thin clearcoat
 * for melt gloss) plus a per-pixel shader for marbled ribbons, fruit/berry pieces,
 * vanilla-bean specks and fine grain bump. All flavor looks are uniforms, so a flavor
 * swap is just applyFlavor(material, FLAVORS.x) - no new shader compile.
 */
export function makeCreamMaterial(f: Flavor, seed = 0): THREE.MeshPhysicalMaterial {
  const uniforms: CreamUniforms = {
    uBase: { value: new THREE.Color(f.base) },
    uRibbon: { value: new THREE.Color(f.ribbon) },
    uChunk: { value: new THREE.Color(f.chunk) },
    uSpeck: { value: new THREE.Color(f.speck) },
    uRibbonAmt: { value: f.ribbonAmt },
    uChunkAmt: { value: f.chunkAmt },
    uSpeckAmt: { value: f.speckAmt },
    uChunkFreq: { value: f.chunkFreq },
    uGlow: { value: 0.45 },
    uGrain: { value: 0.6 },
    // uBump is relief height in SCENE units (design units x 0.01): 0.012 = ~1.2 design units
    uBump: { value: 0.012 },
    uSeed: { value: seed },
  };
  const m = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: f.roughness,
    metalness: 0,
    sheen: 0.35,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color('#fff8ee'),
    clearcoat: 0.18,
    clearcoatRoughness: 0.42,
  });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = patchVertex(shader.vertexShader);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
${VERT_DECL}
uniform vec3 uBase; uniform vec3 uRibbon; uniform vec3 uChunk; uniform vec3 uSpeck;
uniform float uRibbonAmt; uniform float uChunkAmt; uniform float uSpeckAmt;
uniform float uChunkFreq; uniform float uGlow;
uniform float uGrain; uniform float uBump; uniform float uSeed;
${SNOISE}`,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `#include <color_fragment>
vec3 hcP = vObjPos + vec3(uSeed * 37.0);
float hcFw = length(fwidth(vObjPos)); // design units per pixel - used to fade sub-pixel detail
vec3 hcW = vec3(snoise(hcP * 0.018 + 1.7), snoise(hcP * 0.018 + 4.1), snoise(hcP * 0.018 + 8.3));
float hcMott = snoise(hcP * 0.03);
float hcSw = snoise(hcP * 0.028 + hcW * 1.9);
// swirled ribbon: a soft-edged band of a domain-warped noise field, patchy over the scoop
float hcRib = smoothstep(0.1, 0.5, hcSw) * (0.75 + 0.25 * snoise(hcP * 0.06));
hcRib *= smoothstep(-0.5, 0.15, snoise(hcP * 0.011 + 3.3));
hcRib = clamp(hcRib, 0.0, 1.0);
// fruit / berry pieces: chunky blobs, slightly raised
float hcChN = snoise(hcP * uChunkFreq + hcW * 0.5);
float hcChPatch = smoothstep(-0.2, 0.3, snoise(hcP * 0.02 + 11.0));
float hcCh = smoothstep(0.42, 0.56, hcChN) * hcChPatch;
float hcChH = smoothstep(0.3, 0.75, hcChN) * hcChPatch; // softer mask for relief: no hard rims
float hcSpAA = 1.0 - smoothstep(0.25, 0.6, hcFw * 0.45);
float hcSp = smoothstep(0.7, 0.8, snoise(hcP * 0.45 + hcW * 0.3)) * hcSpAA;
float hcG = snoise(hcP * 0.08) * 0.5
  + snoise(hcP * 0.2) * 0.3 * (1.0 - smoothstep(0.15, 0.4, hcFw * 0.2))
  + snoise(hcP * 0.5) * 0.2 * (1.0 - smoothstep(0.15, 0.4, hcFw * 0.5));
vec3 hcC = uBase * (1.0 + hcMott * 0.06);
hcC = mix(hcC, uRibbon, hcRib * uRibbonAmt * 0.85);
hcC = mix(hcC, uChunk, hcCh * uChunkAmt);
hcC = mix(hcC, uSpeck, hcSp * uSpeckAmt);
diffuseColor.rgb *= hcC;
// ribbons are syrupy: flat and glossier, never raised outlines
float hcHeight = hcG * uGrain + hcChH * uChunkAmt * 0.9 - hcSp * uSpeckAmt * 0.2;
float hcGloss = hcChH * uChunkAmt * 0.12;`,
      )
      .replace(
        '#include <roughnessmap_fragment>',
        '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor - hcGloss, 0.05, 1.0);',
      )
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${BUMP}`)
      .replace(
        '#include <opaque_fragment>',
        /* glsl */ `{
  // Fake translucency: cream lets light through at thin grazing edges, so the
  // silhouette glows slightly lighter and more saturated instead of going grey.
  float hcNV = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
  float hcEdge = pow(1.0 - hcNV, 2.5);
  vec3 hcGlowCol = diffuseColor.rgb * vec3(1.25, 1.15, 1.1) + 0.03;
  outgoingLight += hcGlowCol * hcEdge * uGlow;
}
#include <opaque_fragment>`,
      );
  };
  m.customProgramCacheKey = () => 'harbor-cream-v2';
  m.userData.uniforms = uniforms;
  return m;
}

export function applyFlavor(m: THREE.MeshPhysicalMaterial, f: Flavor) {
  const u = m.userData.uniforms as CreamUniforms;
  u.uBase.value.set(f.base);
  u.uRibbon.value.set(f.ribbon);
  u.uChunk.value.set(f.chunk);
  u.uSpeck.value.set(f.speck);
  u.uRibbonAmt.value = f.ribbonAmt;
  u.uChunkAmt.value = f.chunkAmt;
  u.uSpeckAmt.value = f.speckAmt;
  u.uChunkFreq.value = f.chunkFreq;
  m.roughness = f.roughness;
}

/**
 * Baked-dough material for the cone and rim. Vertex colors carry the browning; on the
 * cone the uv attribute carries the diagonal grid so ridges are drawn per pixel (crisp
 * at any zoom) with darker toasted crests and paler pockets.
 */
export function makeWaffleMaterial(pattern: boolean): THREE.MeshStandardMaterial {
  const uniforms = { uPattern: { value: pattern ? 1 : 0 }, uBump: { value: pattern ? 0.03 : 0.01 } };
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78, metalness: 0 });
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = patchVertex(shader.vertexShader);
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>\n${VERT_DECL}\nuniform float uPattern; uniform float uBump;\n${SNOISE}`,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `#include <color_fragment>
vec2 hcD = abs(vWaf - floor(vWaf + 0.5));
vec2 hcAA = fwidth(vWaf) * 1.2;
vec2 hcR = 1.0 - smoothstep(vec2(0.06) - hcAA, vec2(0.12) + hcAA, hcD);
float hcRidge = max(hcR.x, hcR.y) * uPattern;
float hcCross = hcR.x * hcR.y * uPattern;
float hcFw = length(fwidth(vObjPos));
float hcG = snoise(vObjPos * 0.12) * 0.6
  + snoise(vObjPos * 0.35) * 0.4 * (1.0 - smoothstep(0.15, 0.4, hcFw * 0.35));
float hcToast = smoothstep(0.62, 0.8, snoise(vObjPos * 0.12 + 5.0));
vec3 hcTint = mix(vec3(1.08, 1.05, 1.0), vec3(0.78, 0.66, 0.55), hcRidge);
hcTint *= 1.0 - 0.18 * hcToast * hcRidge;
hcTint *= 1.0 + hcG * 0.05;
diffuseColor.rgb *= hcTint;
float hcHeight = hcRidge * 1.0 + hcCross * 0.25 + hcG * 0.06;`,
      )
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${BUMP}`);
  };
  m.customProgramCacheKey = () => `harbor-waffle-${pattern ? 1 : 0}`;
  return m;
}
