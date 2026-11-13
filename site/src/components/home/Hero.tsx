import type { CSSProperties } from "react";
import { site } from "@/content/site";
import { StatusBadge } from "../StatusBadge";
import { ButtonLink } from "../ui";
import { ConeHero } from "./ConeHero";

/** Sprinkles around the cone. Fixed positions, purely decorative. */
const sprinkles = [
  { x: "10%", y: "16%", r: 20, c: "#e47f97" },
  { x: "84%", y: "11%", r: -35, c: "#8fd3b6" },
  { x: "88%", y: "56%", r: 60, c: "#5a3e8e" },
  { x: "7%", y: "64%", r: -10, c: "#c98a45" },
  { x: "76%", y: "86%", r: 25, c: "#e47f97" },
];

const rise = (delay: number) => ({ "--rise-delay": `${delay}s` }) as CSSProperties;

/**
 * Homepage hero. One set of elements, two compositions:
 * - Phone: badge → headline → cone on its own showcase card → copy → thumb-sized buttons.
 * - Desktop: text column on the left, free-floating cone on the right.
 * Entrance animation is CSS (`.rise`), so nothing can get stuck invisible.
 */
export function Hero() {
  const words = ["Scooped", "by", "the", "harbor", "since", "1979."];

  return (
    <section className="relative overflow-hidden bg-cream px-4 pb-8 pt-24 sm:px-6 sm:pt-32 lg:pb-20">
      {/* soft flavor-colored glows */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[38rem] rounded-full bg-blueberry-soft blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-[28rem] rounded-full bg-strawberry-soft blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-1/3 top-1/2 hidden size-[18rem] rounded-full bg-mint-soft blur-3xl lg:block" />

      <div
        className="relative mx-auto grid max-w-6xl gap-x-12 [grid-template-areas:'badge'_'title'_'cone'_'copy'_'cta'] lg:grid-cols-[1.1fr_1fr] lg:grid-rows-[1fr_auto_auto_auto_auto_1fr] lg:[grid-template-areas:'.__cone'_'badge_cone'_'title_cone'_'copy_cone'_'cta_cone'_'.__cone']"
      >
        <div className="rise [grid-area:badge]" style={rise(0)}>
          <StatusBadge compact />
        </div>

        <h1 className="font-display mt-4 text-[clamp(2.6rem,11.5vw,6.25rem)] font-black leading-[0.92] tracking-tight text-navy [grid-area:title] sm:mt-6">
          <span className="sr-only">{site.name}: </span>
          {words.map((w, i) => (
            <span
              key={i}
              className={`rise mr-[0.2em] inline-block ${w === "harbor" ? "text-blueberry italic" : ""}`}
              style={rise(0.08 + i * 0.06)}
            >
              {w}
            </span>
          ))}
        </h1>

        {/* The cone: a showcase card on phones, free-floating on desktop. */}
        <div className="rise relative mt-6 [grid-area:cone] lg:mt-0" style={rise(0.2)}>
          <div className="relative mx-auto w-full overflow-hidden rounded-[var(--radius-scoop)] bg-gradient-to-b from-blueberry-soft via-cream to-strawberry-soft ring-1 ring-navy/5 sm:max-w-md lg:max-w-none lg:overflow-visible lg:bg-none lg:ring-0">
            {sprinkles.map((s, i) => (
              <span
                key={i}
                aria-hidden
                data-decor
                className="sprinkle absolute h-1.5 w-5 rounded-full lg:h-2 lg:w-6"
                style={{ left: s.x, top: s.y, background: s.c, rotate: `${s.r}deg`, "--rise-delay": `${0.5 + i * 0.08}s` } as CSSProperties}
              />
            ))}
            <ConeHero />
          </div>
        </div>

        <p className="rise mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-ink-muted [grid-area:copy] sm:text-xl" style={rise(0.35)}>
          Super premium, old-fashioned hard ice cream, handcrafted in small batches right here in Boothbay
          Harbor, Maine.<span className="hidden sm:inline"> Over 65 homemade flavors at two sweet spots in town.</span>
        </p>

        <div className="rise mt-6 grid grid-cols-2 gap-3 [grid-area:cta] sm:mt-8 sm:flex sm:flex-wrap sm:gap-4" style={rise(0.45)}>
          <ButtonLink href="/flavors" className="px-4 sm:px-6">See flavors</ButtonLink>
          <ButtonLink href="/visit" variant="secondary" className="px-4 sm:px-6">
            Plan a visit
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
