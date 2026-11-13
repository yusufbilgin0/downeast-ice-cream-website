"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Flavor } from "@/content/flavors";
import { Scoop } from "../Scoop";

/**
 * Lightweight 2D version of the stacked cone (SVG only). Used on phones until
 * the visitor opts into 3D, for reduced motion, and wherever WebGL isn't available.
 */
export function Cone2D({ top, middle, bottom }: { top: Flavor; middle: Flavor; bottom: Flavor }) {
  const reduce = useReducedMotion();
  const layers = [
    { slot: "bottom", f: bottom, y: "31%", z: 3 },
    { slot: "middle", f: middle, y: "16%", z: 2 },
    { slot: "top", f: top, y: "1%", z: 1 },
  ];
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[22rem]" aria-hidden>
      {/* cone */}
      <svg viewBox="0 0 120 150" className="absolute left-1/2 top-[52%] w-[40%] -translate-x-1/2">
        <defs>
          <clipPath id="cone2d">
            <path d="M6 6 L60 146 L114 6 Z" />
          </clipPath>
        </defs>
        <path d="M6 6 L60 146 L114 6 Z" fill="#c98a45" />
        <g clipPath="url(#cone2d)" stroke="#8a5a24" strokeOpacity=".45" strokeWidth="3">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={`a${i}`} d={`M${-60 + i * 18} 0 L${60 + i * 18} 150`} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <path key={`b${i}`} d={`M${180 - i * 18} 0 L${60 - i * 18} 150`} />
          ))}
        </g>
        <rect x="2" y="2" width="116" height="10" rx="5" fill="#b0702f" />
      </svg>
      {layers.map(({ slot, f, y, z }) => (
        <div key={slot} className="absolute left-1/2 w-[48%] -translate-x-1/2" style={{ top: y, zIndex: z }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={f.name}
              initial={reduce ? { opacity: 0 } : { y: -70, scaleX: 0.9, scaleY: 1.12, opacity: 0 }}
              animate={{ y: 0, scaleX: 1, scaleY: 1, opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 420, damping: 14 }}
              style={{ transformOrigin: "50% 100%" }}
            >
              <Scoop base={f.base} fleck={f.fleck} seed={f.name} className="w-full drop-shadow-[0_6px_6px_rgba(19,33,58,.15)]" />
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
