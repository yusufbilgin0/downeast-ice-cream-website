"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useDeferredValue, useMemo, useState } from "react";
import { families, iceCreams, type Family } from "@/content/flavors";
import { Scoop } from "./Scoop";

type Filter = Family | "all" | "maine";

export function FlavorWall() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim().toLowerCase());

  const shown = useMemo(
    () =>
      iceCreams.filter((f) => {
        const byFilter =
          filter === "all" ? true : filter === "maine" ? f.maineMade : f.families.includes(filter);
        const byQuery = !q || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
        return byFilter && byQuery;
      }),
    [filter, q],
  );

  const chips: { id: Filter; label: string }[] = [
    { id: "all", label: "All flavors" },
    { id: "maine", label: "Taste of Maine" },
    ...families,
  ];

  return (
    <div>
      <div className="sticky top-18 z-30 -mx-4 bg-cream/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="relative block lg:w-72">
            <span className="sr-only">Search flavors</span>
            <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: oreo, maple, peach…"
              className="min-h-12 w-full rounded-full bg-paper py-3 pl-12 pr-4 text-navy ring-1 ring-navy/15 placeholder:text-ink-muted/70 focus:outline-none focus:ring-2 focus:ring-blueberry"
            />
          </label>
          <div role="group" aria-label="Filter by flavor family" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:overflow-visible">
            {chips.map((c) => {
              const active = filter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c.id)}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition-all ${
                    active ? "bg-navy text-cream" : "bg-paper text-navy ring-1 ring-navy/15 hover:ring-navy/40"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
          Showing {shown.length} of {iceCreams.length} ice cream flavors
        </p>
      </div>

      <motion.ul layout={!reduce} className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((f) => (
            <motion.li
              key={f.name}
              id={encodeURIComponent(f.name)}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="group scroll-mt-48 rounded-[var(--radius-scoop)] bg-paper p-5 ring-1 ring-navy/5 transition-shadow hover:shadow-[0_18px_40px_-18px_rgba(19,33,58,.35)] target:ring-4 target:ring-strawberry"
            >
              <Scoop
                base={f.base}
                fleck={f.fleck}
                seed={f.name}
                className="mx-auto w-full max-w-32 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105"
              />
              <h3 className="font-display mt-4 text-xl font-bold leading-tight text-navy">{f.name}</h3>
              <p className="mt-1.5 text-sm leading-snug text-ink-muted">{f.description}</p>
              {f.maineMade && (
                <p className="mt-3 inline-block rounded-full bg-blueberry-soft px-2.5 py-0.5 text-xs font-bold text-blueberry">
                  Taste of Maine
                </p>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {shown.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-display text-3xl font-bold text-navy">No scoops match that.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-4 font-semibold text-blueberry underline underline-offset-4"
          >
            Show all flavors
          </button>
        </div>
      )}
    </div>
  );
}
