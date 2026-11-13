"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/*
 * Explains "Super Premium" without numbers: ordinary ice cream is whipped with
 * lots of air; ours is denser. Bubble counts and the meter are illustrative only.
 */

const TUB = "M10 14 H90 L82 104 H18 Z";

/** Bubbles on a jittered grid inside the tub (deterministic). */
function bubbleGrid(n: number, cols: number) {
  return Array.from({ length: n }, (_, i) => {
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
}

/* ------------------------- Desktop: side by side ------------------------- */

function Tub({ label, sub, bubbles, color }: { label: string; sub: string; bubbles: number; color: string }) {
  const dots = bubbleGrid(bubbles, bubbles > 6 ? 5 : 2);
  const clipId = `tub-${label}`;
  return (
    <figure className="flex flex-col items-center text-center">
      <svg viewBox="0 0 100 110" className="w-40 sm:w-48" aria-hidden focusable="false">
        <defs>
          <clipPath id={clipId}>
            <path d={TUB} />
          </clipPath>
        </defs>
        <path d={TUB} fill={color} />
        <rect x="6" y="7" width="88" height="9" rx="3" fill="#fbf5ea" opacity=".9" />
        <g clipPath={`url(#${clipId})`}>
          {dots.map((d, i) => (
            <motion.circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill="#fbf5ea"
              initial={{ scale: 0, opacity: 0 }}
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
    <>
      <div className="hidden grid-cols-2 gap-6 lg:grid">
        <Tub label="Typical" sub="Whipped full of air" bubbles={22} color="#8a95ab" />
        <Tub label="Ours" sub="Dense, rich & creamy" bubbles={4} color="#e47f97" />
      </div>
      <AirToggle />
    </>
  );
}

/* --------------------- Phones: one tub you can toggle --------------------- */

const KEEP = new Set([3, 9, 16, 20]); // bubbles that stay in "ours"
const DOTS = bubbleGrid(22, 5);

function AirToggle() {
  const [ours, setOurs] = useState(false);
  const touched = useRef(false);
  const box = useRef<HTMLDivElement>(null);

  // Demonstrate once: switch to "Ours" shortly after the tub scrolls into view.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let t: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !touched.current) {
          t = window.setTimeout(() => !touched.current && setOurs(true), 1100);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (t) window.clearTimeout(t);
    };
  }, []);

  const choose = (v: boolean) => {
    touched.current = true;
    setOurs(v);
  };

  return (
    <div ref={box} className="lg:hidden">
      <div role="group" aria-label="Compare ice creams" className="mx-auto grid max-w-xs grid-cols-2 rounded-full bg-white/10 p-1">
        {[
          { v: false, label: "Typical" },
          { v: true, label: "Ours" },
        ].map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={ours === o.v}
            onClick={() => choose(o.v)}
            className={`min-h-11 rounded-full text-sm font-bold transition-colors ${
              ours === o.v ? (o.v ? "bg-strawberry text-navy" : "bg-cream text-navy") : "text-cream/75"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-6 w-60">
        <svg viewBox="0 0 100 110" className="w-full overflow-visible" aria-hidden focusable="false">
          <defs>
            <clipPath id="tub-toggle">
              <path d={TUB} />
            </clipPath>
          </defs>
          <motion.path d={TUB} animate={{ fill: ours ? "#e47f97" : "#8a95ab" }} transition={{ duration: 0.6 }} />
          <rect x="6" y="7" width="88" height="9" rx="3" fill="#fbf5ea" opacity=".9" />
          {DOTS.map((d, i) => {
            const stays = KEEP.has(i);
            const gone = ours && !stays;
            return (
              <motion.circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={d.r}
                fill="#fbf5ea"
                clipPath={gone ? undefined : "url(#tub-toggle)"}
                animate={gone ? { y: -36 - (i % 5) * 6, opacity: 0, scale: 0.6 } : { y: 0, opacity: 0.85, scale: 1 }}
                transition={{ duration: 0.9, delay: gone ? (i % 7) * 0.05 : 0.02 * i, ease: [0.22, 1, 0.36, 1] }}
              />
            );
          })}
        </svg>
      </div>

      <div className="mx-auto mt-5 max-w-xs text-center" aria-live="polite">
        <p className="font-display text-2xl font-bold text-cream">{ours ? "Dense, rich & creamy" : "Whipped full of air"}</p>
        <div className="mt-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-cream/60">
          Air
          <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.span
              className="block h-full rounded-full bg-mint"
              animate={{ width: ours ? "18%" : "82%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
