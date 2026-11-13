// Renders svg/*.svg to PNG (preview + exports) with the system Chrome.
//   node render.mjs [outDir]
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

const here = import.meta.dirname;
const outDir = process.argv[2] ?? path.join(here, "png");
fs.mkdirSync(outDir, { recursive: true });
const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const p = await b.newPage();

async function shot(svgFile, width, out, bg = "transparent") {
  const svg = fs.readFileSync(path.join(here, "svg", svgFile), "utf8");
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const h = Math.round((width * Number(vb[2])) / Number(vb[1]));
  await p.setViewport({ width, height: h, deviceScaleFactor: 1 });
  await p.setContent(`<html><body style="margin:0;background:${bg}">${svg.replace("<svg ", `<svg width="${width}" height="${h}" `)}</body></html>`);
  await p.screenshot({ path: path.join(outDir, out), omitBackground: bg === "transparent" });
}

await shot("downeast-badge.svg", 1200, "downeast-badge-1200.png");
await shot("downeast-badge.svg", 400, "downeast-badge-400.png");
await shot("downeast-horizontal.svg", 1200, "downeast-horizontal-1200.png");
await shot("downeast-horizontal-on-dark.svg", 1200, "downeast-horizontal-on-dark-1200.png", "#16264a");
await shot("downeast-header.svg", 600, "downeast-header-600.png");
await shot("downeast-header.svg", 180, "downeast-header-180.png", "#fbf5ea");
await shot("downeast-icon.svg", 512, "downeast-icon-512.png");
await shot("downeast-icon.svg", 180, "apple-touch-icon.png", "#fbf5ea");
for (const s of [64, 32, 16]) await shot("downeast-icon.svg", s, `downeast-icon-${s}.png`);
await b.close();
console.log("rendered to", outDir);
