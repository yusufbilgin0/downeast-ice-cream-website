import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Logo files",
  robots: { index: false, follow: false },
};

const files = [
  { file: "downeast-badge.svg", name: "Full badge", use: "Signs, cups, merch, stickers, the website footer", w: 1000, h: 1000, bg: "bg-cream" },
  { file: "downeast-horizontal.svg", name: "Horizontal logo", use: "Letterhead, email signature, menus, wide banners", w: 1200, h: 350, bg: "bg-paper" },
  { file: "downeast-horizontal-on-dark.svg", name: "Horizontal logo, on dark", use: "Navy or photo backgrounds", w: 1200, h: 350, bg: "bg-navy" },
  { file: "downeast-header.svg", name: "Compact logo", use: "Website header and other small spaces (stays legible ~48 px tall)", w: 854, h: 250, bg: "bg-paper" },
  { file: "downeast-icon.svg", name: "Round icon", use: "Favicon, social media avatar, app icon", w: 512, h: 512, bg: "bg-cream" },
  { file: "downeast-mark.svg", name: "Scoop mark", use: "Stamps, patterns, small accents", w: 512, h: 512, bg: "bg-paper" },
];

export default function BrandPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blueberry">Not public</p>
      <h1 className="font-display mt-3 text-5xl font-black">Logo files</h1>
      <p className="mt-4 max-w-2xl text-ink-muted">
        Vector (SVG) files scale to any size without blurring. Give printers and sign makers the SVG. PNG copies are in
        the project&apos;s <code>brand/png</code> folder.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {files.map((f) => (
          <li key={f.file} className="overflow-hidden rounded-[var(--radius-scoop)] bg-paper ring-1 ring-navy/5">
            <div className={`${f.bg} flex h-64 items-center justify-center p-8`}>
              <Image src={`/brand/${f.file}`} alt={f.name} width={f.w} height={f.h} unoptimized className="max-h-full w-auto" />
            </div>
            <div className="p-6">
              <h2 className="font-display text-2xl font-black">{f.name}</h2>
              <p className="mt-1 text-ink-muted">{f.use}</p>
              <a href={`/brand/${f.file}`} download className="mt-3 inline-block font-semibold text-blueberry underline underline-offset-4">
                Download SVG
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
