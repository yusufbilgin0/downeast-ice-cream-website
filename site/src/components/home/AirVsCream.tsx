"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Explains "Super Premium" without numbers: ordinary ice cream is whipped
 * with lots of air; ours is denser. Bubble counts are illustrative only.
 */
function Tub({ label, sub, bubbles, color }: { label: string; sub: string; bubbles: number; color: string }) {
  const reduce = useReducedMotion();
  // Spread bubbles on a jittered grid inside the tub.
  const cols = bubbles > 6 ? 5 : 2;
  const dots = Array.from({ length: bubbles }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const jx = ((i * 7919) % 9) - 4;
    const jy = ((i * 104729) % 7) - 3;
    return {
      x: (cols === 5 ? 24 + col * 13 : 36 + col * 28) + jx,
      y: (cols === 5 ? 30 + row * 15 : 42 + row * 30) + jy,
      r: 3 + ((i * 7) % 4),
    };
  });
  const clipId = `tub-${label}`;
  return (
    <figure className="flex flex-col items-center text-center">
      <svg viewBox="0 0 100 110" className="w-40 sm:w-48" aria-hidden focusable="false">
        <defs>
          <clipPath id={clipId}>
            <path d="M10 14 H90 L82 104 H18 Z" />
          </clipPath>
        </defs>
        <path d="M10 14 H90 L82 104 H18 Z" fill={color} />
        <rect x="6" y="7" width="88" height="9" rx="3" fill="#fbf5ea" opacity=".9" />
        <g clipPath={`url(#${clipId})`}>
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill="#fbf5ea"
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.85 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.03, type: "spring", stiffness: 300, damping: 15 }}
          />
        ))}
        </g>
      </svg>
      <figcaption className="mt-4">
        <span className="font-display block text-2xl font-bold text-cream">{label}</span>
        <span className="mt-1 block text-cream/70">{sub}</span>
      </figcaption>
    </figure>
  );
}

export function AirVsCream() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Tub label="Typical" sub="Whipped full of air" bubbles={22} color="#8a95ab" />
      <Tub label="Ours" sub="Dense, rich & creamy" bubbles={4} color="#e47f97" />
    </div>
  );
}
