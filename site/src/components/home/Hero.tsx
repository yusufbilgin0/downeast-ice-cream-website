"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/content/site";
import { StatusBadge } from "../StatusBadge";
import { ButtonLink } from "../ui";
import { ConeHero } from "./ConeHero";

const ease = [0.22, 1, 0.36, 1] as const;

/** Sprinkles scattered around the cone. Fixed positions, purely decorative. */
const sprinkles = [
  { x: "8%", y: "18%", r: 20, c: "#e47f97" },
  { x: "86%", y: "12%", r: -35, c: "#8fd3b6" },
  { x: "92%", y: "58%", r: 60, c: "#5a3e8e" },
  { x: "4%", y: "70%", r: -10, c: "#c98a45" },
  { x: "74%", y: "88%", r: 25, c: "#e47f97" },
  { x: "22%", y: "92%", r: 80, c: "#8fd3b6" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const words = ["Scooped", "by", "the", "harbor", "since", "1979."];

  return (
    <section className="relative overflow-hidden bg-cream px-4 pb-10 pt-20 sm:px-6 sm:pt-32 lg:pb-20">
      {/* soft flavor-colored glows */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[38rem] rounded-full bg-blueberry-soft blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-[28rem] rounded-full bg-strawberry-soft blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute right-1/3 top-1/2 size-[18rem] rounded-full bg-mint-soft blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="order-2 lg:order-1">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <StatusBadge />
          </motion.div>

          <h1 className="font-display mt-6 text-[clamp(3rem,8vw,6.25rem)] font-black leading-[0.9] text-navy">
            <span className="sr-only">{site.name}: </span>
            {words.map((w, i) => (
              <motion.span
                key={i}
                className={`mr-[0.22em] inline-block ${w === "harbor" ? "text-blueberry italic" : ""}`}
                initial={reduce ? false : { opacity: 0, y: "0.5em", rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.07, ease }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl"
            initial={reduce ? false : { y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
          >
            Super premium, old-fashioned hard ice cream, handcrafted in small batches right here in
            Boothbay Harbor, Maine. Over 65 homemade flavors at two sweet spots in town.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
          >
            <ButtonLink href="/flavors">See all flavors</ButtonLink>
            <ButtonLink href="/visit" variant="secondary">
              Plan your visit
            </ButtonLink>
          </motion.div>
        </div>

        <div className="relative order-1 mx-auto -mb-6 w-full max-w-[13rem] sm:mb-0 sm:max-w-sm lg:order-2 lg:max-w-none">
          {sprinkles.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute h-2 w-6 rounded-full"
              style={{ left: s.x, top: s.y, background: s.c, rotate: s.r }}
              initial={reduce ? false : { opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, type: "spring", stiffness: 260, damping: 14 }}
            />
          ))}
          <motion.div
            initial={reduce ? false : { y: -40, scale: 0.94 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.15 }}
          >
            <ConeHero />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
