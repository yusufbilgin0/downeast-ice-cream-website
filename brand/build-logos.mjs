// Builds the Downeast Ice Cream Factory logo family as vector SVG.
// Redrawn from reference/downeast-badge-original.png. Text is converted to outlines,
// so the SVGs render identically everywhere without the fonts installed.
//
//   node build-logos.mjs        -> writes svg/*.svg
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const here = import.meta.dirname;
const fontFile = (pkg, file) => path.join(here, "node_modules/@fontsource", pkg, "files", file);
const load = (pkg, file) => {
  const buf = fs.readFileSync(fontFile(pkg, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const F = {
  script: load("lobster", "lobster-latin-400-normal.woff"),
  serifBold: load("fraunces", "fraunces-latin-800-normal.woff"),
  serifSemi: load("fraunces", "fraunces-latin-600-normal.woff"),
  serifItalic: load("fraunces", "fraunces-latin-600-italic.woff"),
  sans: load("figtree", "figtree-latin-800-normal.woff"),
};

const COL = {
  navy: "#16264a",
  cream: "#fbf5ea",
  pink: "#f2a7b8",
  pinkDeep: "#d96a85",
  pinkLine: "#e98aa1",
  purple: "#7a63a8",
  waffle: "#d9a25c",
  waffleDeep: "#9c6428",
  sky: "#d8e9f5",
  water: "#3f78ab",
  waterLight: "#6f9fcb",
  pine: "#2d6a46",
  pineDark: "#1f4d33",
  rock: "#8d939d",
  barn: "#b5473c",
  roof: "#5e6470",
  wave: "#7fb6dc",
  buoy: "#c2352a",
};

/** Text -> one SVG path. anchor: start | middle | end. Optional letterSpacing (font units of size). */
function text(font, str, x, y, size, { anchor = "start", spacing = 0, fit } = {}) {
  if (fit) {
    // scale the size so the text is exactly `fit` wide
    const w = measure(font, str, size, spacing);
    const k = fit / w;
    size *= k;
    spacing *= k;
  }
  const w = measure(font, str, size, spacing);
  let cx = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  const glyphs = font.stringToGlyphs(str);
  const scale = size / font.unitsPerEm;
  let d = "";
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2);
    cx += g.advanceWidth * scale + spacing;
    if (i < glyphs.length - 1) cx += font.getKerningValue(g, glyphs[i + 1]) * scale;
  });
  return { d, width: w, size };
}
function measure(font, str, size, spacing = 0) {
  const glyphs = font.stringToGlyphs(str);
  const scale = size / font.unitsPerEm;
  let w = 0;
  glyphs.forEach((g, i) => {
    w += g.advanceWidth * scale + (i < glyphs.length - 1 ? spacing + font.getKerningValue(g, glyphs[i + 1]) * scale : 0);
  });
  return w;
}

/* ----------------------------- shared art ----------------------------- */

/** Waffle cone (cx = center, top = y of rim, w = rim width, h = height to tip). */
function cone(id, cx, top, w, h) {
  const l = cx - w / 2, r = cx + w / 2, tip = top + h;
  const cell = w / 4.2;
  let grid = "";
  for (let i = -8; i <= 8; i++) {
    const x = cx + i * cell;
    grid += `M${x - h} ${top - 2}L${x + h} ${top + 2 * h}M${x + h} ${top - 2}L${x - h} ${top + 2 * h}`;
  }
  return `
  <clipPath id="${id}"><path d="M${l} ${top}L${cx} ${tip}L${r} ${top}Z"/></clipPath>
  <path d="M${l} ${top}L${cx} ${tip}L${r} ${top}Z" fill="${COL.waffle}"/>
  <path clip-path="url(#${id})" d="${grid}" stroke="${COL.waffleDeep}" stroke-width="${w / 26}" fill="none" stroke-opacity=".75"/>
  <path clip-path="url(#${id})" d="M${cx + w * 0.12} ${top}L${cx} ${tip}L${r} ${top}Z" fill="${COL.navy}" opacity=".12"/>
  <path d="M${l} ${top}L${cx} ${tip}L${r} ${top}Z" fill="none" stroke="${COL.navy}" stroke-width="${w / 45}" stroke-linejoin="round"/>`;
}

/** A tall, hand-scooped dome with a ruffled lip and a ripple swirl. */
function scoop(cx, base, w, h) {
  const r = w / 2, l = cx - r, rt = cx + r;
  const lip = h * 0.08;
  const body = [
    `M${l + r * 0.06} ${base}`,
    `C${l - r * 0.28} ${base - h * 0.55} ${cx - r * 0.75} ${base - h * 1.02} ${cx} ${base - h}`,
    `C${cx + r * 0.75} ${base - h * 1.02} ${rt + r * 0.28} ${base - h * 0.55} ${rt - r * 0.06} ${base}`,
  ];
  // scalloped lip with one drip, right to left
  const s = [0.94, 0.62, 0.3, -0.05, -0.38, -0.7, -0.94];
  for (let i = 0; i < s.length - 1; i++) {
    const a = cx + s[i] * r, b = cx + s[i + 1] * r, m = (a + b) / 2;
    const dip = i === 1 ? lip * 3.2 : lip * (1.2 + (i % 2) * 0.5);
    body.push(`Q${m} ${base + dip} ${b} ${base + (i % 2 ? lip * 0.2 : lip * 0.5)}`);
  }
  body.push("Z");
  const ridges = [
    `M${cx - r * 0.8} ${base - h * 0.32} q${r * 0.25} -${h * 0.14} ${r * 0.5} -${h * 0.02} t${r * 0.5} -${h * 0.04} t${r * 0.5} ${h * 0.02}`,
    `M${cx - r * 0.65} ${base - h * 0.6} q${r * 0.25} -${h * 0.12} ${r * 0.48} 0 t${r * 0.5} -${h * 0.05} t${r * 0.42} ${h * 0.06}`,
    `M${cx - r * 0.35} ${base - h * 0.83} q${r * 0.2} -${h * 0.08} ${r * 0.38} 0 t${r * 0.38} -${h * 0.02}`,
  ];
  return `
  <path d="${body.join(" ")}" fill="${COL.pink}" stroke="${COL.navy}" stroke-width="${w / 55}" stroke-linejoin="round"/>
  <path d="${ridges.join(" ")}" fill="none" stroke="${COL.pinkDeep}" stroke-width="${w / 38}" stroke-linecap="round" opacity=".75"/>
  <ellipse cx="${cx - r * 0.42}" cy="${base - h * 0.74}" rx="${r * 0.16}" ry="${h * 0.06}" fill="#fff" opacity=".55" transform="rotate(-25 ${cx - r * 0.42} ${base - h * 0.74})"/>`;
}

/** Little "pop" lines beside the scoop. */
function pops(cx, y, spread, len, sw, color = COL.navy) {
  const one = (sx) => `<g stroke="${color}" stroke-width="${sw}" stroke-linecap="round">
    <path d="M${cx + sx * spread} ${y} l${sx * len * 0.55} ${-len * 0.85}"/>
    <path d="M${cx + sx * (spread + len * 0.35)} ${y + len * 0.95} l${sx * len * 0.9} ${-len * 0.25}"/></g>`;
  return one(-1) + one(1);
}

/* ------------------------------ the badge ------------------------------ */

const BADGE_OUTLINE =
  "M175 420 A325 325 0 0 1 825 420 C905 420 975 455 975 530 C975 600 940 615 940 650 C940 690 985 700 975 760 " +
  "C965 830 880 830 820 850 C760 870 730 900 720 930 C705 975 600 985 500 985 C400 985 295 975 280 930 " +
  "C270 900 240 870 180 850 C120 830 35 830 25 760 C15 700 60 690 60 650 C60 615 25 600 25 530 C25 455 95 420 175 420Z";

function scene() {
  const pines = (x0, base, n, hgt, fill) =>
    Array.from({ length: n }, (_, i) => {
      const x = x0 + i * (hgt * 0.42) + ((i * 37) % 11) - 5;
      const h = hgt * (0.75 + ((i * 53) % 10) / 30);
      return `<path d="M${x} ${base - h} L${x + h * 0.26} ${base} L${x - h * 0.26} ${base}Z" fill="${fill}"/>`;
    }).join("");
  return `
  <rect x="150" y="80" width="700" height="400" fill="${COL.sky}"/>
  <g fill="#fff">
    <path d="M222 286 a26 26 0 0 1 46-14 a30 30 0 0 1 54 8 a20 20 0 0 1 4 34 h-98 a18 18 0 0 1 -6-28z"/>
    <path d="M690 268 a24 24 0 0 1 42-12 a28 28 0 0 1 50 8 a18 18 0 0 1 2 30 h-90 a16 16 0 0 1 -4-26z"/>
  </g>
  <!-- right shore, trees and lighthouse -->
  <path d="M560 368 C600 350 650 352 700 346 C740 340 790 344 850 352 V380 H560Z" fill="${COL.pineDark}"/>
  ${pines(600, 360, 12, 34, COL.pine)}
  <path d="M712 352 C730 338 770 338 800 350 V372 H700Z" fill="${COL.rock}"/>
  <rect x="742" y="276" width="18" height="70" fill="#fff" stroke="${COL.navy}" stroke-width="3"/>
  <rect x="738" y="264" width="26" height="14" rx="3" fill="${COL.navy}"/>
  <path d="M740 264 L751 252 L762 264Z" fill="${COL.navy}"/>
  <!-- left shore: pines, rocks, boathouse and pier -->
  ${pines(178, 372, 6, 92, COL.pine)}
  <path d="M150 390 C180 352 230 350 262 362 C300 372 320 380 344 404 V420 H150Z" fill="${COL.rock}"/>
  <path d="M175 380 C200 368 228 372 248 384" stroke="#6f7580" stroke-width="5" fill="none" stroke-linecap="round"/>
  <g>
    <rect x="232" y="300" width="96" height="58" fill="${COL.barn}" stroke="${COL.navy}" stroke-width="3"/>
    <path d="M224 302 L248 274 H312 L336 302Z" fill="${COL.roof}" stroke="${COL.navy}" stroke-width="3" stroke-linejoin="round"/>
    <g fill="${COL.cream}">
      <rect x="244" y="314" width="16" height="16"/><rect x="300" y="314" width="16" height="16"/>
      <rect x="270" y="318" width="20" height="40"/>
    </g>
  </g>
  <path d="M326 356 H392 V364 H326Z" fill="#7a5134"/>
  <g stroke="#5c3b25" stroke-width="7">
    <path d="M340 364 V400"/><path d="M362 364 V402"/><path d="M384 364 V398"/>
  </g>
  <!-- water -->
  <path d="M150 384 H850 V480 H150Z" fill="${COL.water}"/>
  <g stroke="${COL.waterLight}" stroke-width="5" stroke-linecap="round" fill="none">
    <path d="M190 412 h46 M262 428 h60 M560 420 h44 M690 436 h52 M610 452 h70 M200 450 h40"/>
  </g>
  <!-- lobster boat and buoy -->
  <g stroke="${COL.navy}" stroke-width="3" stroke-linejoin="round">
    <path d="M620 404 H712 L700 424 H630Z" fill="#fff"/>
    <path d="M628 412 H704" stroke="${COL.navy}" stroke-width="5"/>
    <rect x="642" y="386" width="30" height="18" fill="#fff"/>
    <path d="M682 404 V368" />
  </g>
  <g stroke="${COL.navy}" stroke-width="2.5">
    <rect x="748" y="410" width="12" height="24" rx="5" fill="#fff"/>
    <path d="M748 418 h12" stroke="${COL.buoy}" stroke-width="6"/>
  </g>`;
}

function badge({ onDark = false } = {}) {
  const word = text(F.script, "Downeast", 500, 598, 230, { anchor: "middle", fit: 860 });
  const ice = text(F.serifBold, "ICE CREAM", 500, 704, 64, { anchor: "middle", spacing: 3 });
  const factory = text(F.serifSemi, "FACTORY", 500, 777, 44, { anchor: "middle", spacing: 15 });
  const town = text(F.serifSemi, "BOOTHBAY HARBOR, MAINE", 500, 862, 30, { anchor: "middle", spacing: 2.6 });
  const since = text(F.serifItalic, "Since 1979", 500, 934, 44, { anchor: "middle" });
  const bg = onDark ? "" : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-label="Downeast Ice Cream Factory, Boothbay Harbor, Maine, since 1979">
  <title>Downeast Ice Cream Factory</title>${bg}
  <defs>
    <clipPath id="sceneClip"><path d="M175 470 V420 A325 325 0 0 1 825 420 V470Z"/></clipPath>
  </defs>
  <path d="${BADGE_OUTLINE}" fill="${COL.pink}" stroke="${COL.pink}" stroke-width="34" stroke-linejoin="round"/>
  <path d="${BADGE_OUTLINE}" fill="${COL.navy}" stroke="${COL.cream}" stroke-width="6" stroke-linejoin="round"/>
  <g clip-path="url(#sceneClip)">${scene()}</g>
  <path d="M175 470 V420 A325 325 0 0 1 825 420 V470" fill="none" stroke="${COL.navy}" stroke-width="16"/>
  ${pops(500, 196, 172, 46, 9)}
  ${cone("badgeCone", 500, 268, 232, 300)}
  ${scoop(500, 278, 300, 252)}
  <!-- wordmark: cream script with a navy outline so it reads over the scene -->
  <path d="${word.d}" fill="${COL.cream}" stroke="${COL.navy}" stroke-width="22" stroke-linejoin="round" paint-order="stroke"/>
  <!-- ribbon -->
  <path d="M86 652 L150 640 L150 724 L86 736 L112 694Z" fill="${COL.pinkLine}" stroke="${COL.navy}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M914 652 L850 640 L850 724 L914 736 L888 694Z" fill="${COL.pinkLine}" stroke="${COL.navy}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M140 636 Q500 610 860 636 V722 Q500 700 140 722Z" fill="${COL.cream}" stroke="${COL.navy}" stroke-width="5" stroke-linejoin="round"/>
  <path d="${ice.d}" fill="${COL.navy}"/>
  <g stroke="${COL.pinkLine}" stroke-width="6" stroke-linecap="round">
    <path d="M180 672 h40 M180 690 h40 M780 672 h40 M780 690 h40"/>
  </g>
  <path d="${factory.d}" fill="${COL.cream}"/>
  <circle cx="${500 - factory.width / 2 - 34}" cy="762" r="7" fill="${COL.pinkLine}"/>
  <circle cx="${500 + factory.width / 2 + 34}" cy="762" r="7" fill="${COL.pinkLine}"/>
  <g fill="none" stroke="${COL.wave}" stroke-width="7" stroke-linecap="round">
    <path d="M378 806 q30 -16 61 0 t61 0 t61 0 t61 0"/>
    <path d="M404 822 q24 -12 48 0 t48 0 t48 0 t48 0" opacity=".6"/>
  </g>
  <path d="${town.d}" fill="${COL.cream}"/>
  <rect x="292" y="882" width="416" height="72" rx="36" fill="${COL.purple}" stroke="${COL.cream}" stroke-width="5"/>
  <path d="${since.d}" fill="${COL.cream}"/>
  <g stroke="${COL.cream}" stroke-width="4" stroke-linecap="round">
    <path d="M${500 - since.width / 2 - 64} 918 h40 M${500 + since.width / 2 + 24} 918 h40"/>
  </g>
</svg>`;
}

/* -------------------------- icon & horizontal -------------------------- */

function iconArt(cx, top, s, popColor = COL.navy) {
  // s = overall scale (1 = 512 box)
  return `${pops(cx, top + 120 * s, 120 * s, 34 * s, 8 * s, popColor)}
  ${cone("iconCone" + Math.round(s * 100), cx, top + 210 * s, 150 * s, 220 * s)}
  ${scoop(cx, top + 218 * s, 200 * s, 176 * s)}`;
}

function icon({ circle = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Downeast Ice Cream Factory">
  <title>Downeast Ice Cream Factory</title>
  ${circle ? `<circle cx="256" cy="256" r="246" fill="${COL.pink}"/><circle cx="256" cy="256" r="226" fill="${COL.navy}" stroke="${COL.cream}" stroke-width="5"/>` : ""}
  ${circle ? `<clipPath id="iconClip"><circle cx="256" cy="256" r="223"/></clipPath>
  <g clip-path="url(#iconClip)"><path d="M0 392 q32 -18 64 0 t64 0 t64 0 t64 0 t64 0 t64 0 t64 0 t64 0 V512 H0Z" fill="${COL.water}"/>
  <path d="M0 418 q32 -18 64 0 t64 0 t64 0 t64 0 t64 0 t64 0 t64 0 t64 0" stroke="${COL.wave}" stroke-width="7" fill="none"/></g>` : ""}
  ${iconArt(256, circle ? 22 : 10, circle ? 1 : 1.12, circle ? COL.cream : COL.navy)}
</svg>`;
}

function horizontal({ onDark = false } = {}) {
  const ink = onDark ? COL.cream : COL.navy;
  const word = text(F.script, "Downeast", 300, 168, 190, { anchor: "start" });
  const sub = text(F.serifBold, "ICE CREAM FACTORY", 306, 236, 40, { spacing: 7 });
  const town = text(F.sans, "BOOTHBAY HARBOR · SINCE 1979", 308, 282, 24, { spacing: 4.4 });
  const w = Math.max(300 + word.width, 306 + sub.width, 308 + town.width) + 20;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(w)} 310" role="img" aria-label="Downeast Ice Cream Factory, Boothbay Harbor, since 1979">
  <title>Downeast Ice Cream Factory</title>
  ${iconArt(130, -14, 0.64)}
  <path d="${word.d}" fill="${ink}"/>
  <path d="${sub.d}" fill="${onDark ? COL.pink : COL.purple}"/>
  <path d="${town.d}" fill="${ink}" opacity=".75"/>
</svg>`;
}

/** Compact header logo: mark + script + one full-width line (legible at ~48 px tall). */
function header({ onDark = false } = {}) {
  const ink = onDark ? COL.cream : COL.navy;
  const word = text(F.script, "Downeast", 210, 150, 170, { anchor: "start" });
  const sub = text(F.sans, "ICE CREAM FACTORY", 216, 222, 40, { fit: word.width - 12 });
  const w = Math.ceil(210 + word.width + 16);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 250" role="img" aria-label="Downeast Ice Cream Factory">
  <title>Downeast Ice Cream Factory</title>
  ${iconArt(98, -12, 0.5)}
  <path d="${word.d}" fill="${ink}"/>
  <path d="${sub.d}" fill="${onDark ? COL.pink : COL.purple}"/>
</svg>`;
}

const out = path.join(here, "svg");
fs.mkdirSync(out, { recursive: true });
const files = {
  "downeast-badge.svg": badge(),
  "downeast-horizontal.svg": horizontal(),
  "downeast-horizontal-on-dark.svg": horizontal({ onDark: true }),
  "downeast-header.svg": header(),
  "downeast-header-on-dark.svg": header({ onDark: true }),
  "downeast-icon.svg": icon(),
  "downeast-mark.svg": icon({ circle: false }),
};
for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(out, name), svg.replace(/\n\s*\n/g, "\n"));
  console.log(name, Math.round(Buffer.byteLength(svg) / 1024) + " KB");
}
