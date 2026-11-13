"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { iceCreams, type Flavor } from "@/content/flavors";
import { canUse3D, isDesktopPointer } from "@/lib/webgl";
import { lookFor } from "../three/coneFlavors";
import type { Slot } from "../three/HarborCone";
import { Scoop } from "../Scoop";
import { Cone2D } from "./Cone2D";

const ConeScene = dynamic(() => import("../three/ConeScene"), { ssr: false });

const byName = new Map(iceCreams.map((f) => [f.name, f]));
const SLOTS: { id: Slot; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "middle", label: "Middle" },
  { id: "bottom", label: "Bottom" },
];
const NEXT: Record<Slot, Slot> = { top: "middle", middle: "bottom", bottom: "top" };

type Mode = "2d" | "loading" | "live";

/**
 * "Stack your cone": pick a flavor for each scoop and watch the cone change.
 * Desktop: live 3D (loaded when the section nears the viewport).
 * Phones: 2D cone with an opt-in "View in 3D". No 3D at all for reduced motion,
 * data saver, low-memory devices or missing WebGL2.
 */
export function StackYourCone() {
  const [picks, setPicks] = useState<Record<Slot, string>>({ top: "Blueberry", middle: "Strawberry", bottom: "Vanilla" });
  const [active, setActive] = useState<Slot>("top");
  const [announce, setAnnounce] = useState("");
  const [mode, setMode] = useState<Mode>("2d");
  const [offer3D, setOffer3D] = useState(false);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);

  const chosen = { top: byName.get(picks.top)!, middle: byName.get(picks.middle)!, bottom: byName.get(picks.bottom)! };
  const looks = useMemo(
    () => ({ top: lookFor(byName.get(picks.top)!), middle: lookFor(byName.get(picks.middle)!), bottom: lookFor(byName.get(picks.bottom)!) }),
    [picks],
  );

  // Load 3D when the section approaches the viewport (desktop), or offer it (phones).
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let decided = false;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (!e.isIntersecting || decided) return;
        decided = true;
        if (!canUse3D()) return;
        if (isDesktopPointer()) setMode((m) => (m === "2d" ? "loading" : m));
        else setOffer3D(true);
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  function pick(f: Flavor, slot: Slot = active) {
    setPicks((p) => ({ ...p, [slot]: f.name }));
    setAnnounce(`${SLOTS.find((s) => s.id === slot)!.label} scoop: ${f.name}`);
    setActive(NEXT[slot]);
  }

  function surprise() {
    const pool = [...iceCreams].sort(() => Math.random() - 0.5).slice(0, 3);
    setPicks({ top: pool[0].name, middle: pool[1].name, bottom: pool[2].name });
    setAnnounce(`Surprise! Top: ${pool[0].name}, middle: ${pool[1].name}, bottom: ${pool[2].name}`);
  }

  const live = mode === "live";

  return (
    <section className="px-4 pb-16 sm:px-6" aria-labelledby="stack-title">
      <div className="mx-auto grid max-w-6xl items-center gap-8 overflow-hidden rounded-[var(--radius-scoop)] bg-paper p-6 ring-1 ring-navy/5 sm:p-10 lg:grid-cols-[1fr_1.15fr]">
        {/* Stage */}
        <div ref={stage} className="relative mx-auto w-full max-w-[17rem] sm:max-w-none" data-stack-mode={mode}>
          <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,var(--color-blueberry-soft),transparent)]" />
          <div className={`transition-opacity duration-500 ${live ? "pointer-events-none absolute inset-0 opacity-0" : "relative opacity-100"}`}>
            <Cone2D top={chosen.top} middle={chosen.middle} bottom={chosen.bottom} />
          </div>
          {mode !== "2d" && (
            <div className={`mx-auto aspect-[4/5] w-full max-w-[26rem] transition-opacity duration-500 ${live ? "relative opacity-100" : "absolute inset-0 opacity-0"}`}>
              <ConeScene
                active={inView && tabVisible}
                detail={isDesktopPointer() ? "high" : "low"}
                looks={looks}
                onReady={() => setMode("live")}
                onContextLost={() => setMode("2d")}
              />
            </div>
          )}
          {offer3D && !live && (
            <button
              type="button"
              onClick={() => setMode("loading")}
              disabled={mode === "loading"}
              className="absolute bottom-2 left-1/2 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-paper/90 px-4 text-sm font-semibold text-navy shadow-md ring-1 ring-navy/10 backdrop-blur disabled:opacity-70"
            >
              {mode === "loading" ? "Loading 3D…" : "View in 3D"}
            </button>
          )}
          {live && <p className="mt-2 text-center text-sm text-ink-muted">Drag to spin</p>}
        </div>

        {/* Controls */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blueberry">Build a triple</p>
          <h2 id="stack-title" className="font-display mt-3 text-4xl font-black leading-[0.95] text-navy sm:text-5xl">
            Stack your cone
          </h2>
          <p className="mt-3 text-ink-muted">Pick a scoop, then a flavor. Mix and match any of our ice creams.</p>

          <div role="group" aria-label="Choose which scoop to change" className="mt-6 grid grid-cols-3 gap-2">
            {SLOTS.map((s) => {
              const f = chosen[s.id];
              const on = active === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(s.id)}
                  className={`flex min-h-16 min-w-0 flex-col items-start rounded-2xl px-3 py-2 text-left transition-all ${
                    on ? "bg-navy text-cream shadow-lg" : "bg-cream text-navy ring-1 ring-navy/10 hover:ring-navy/30"
                  }`}
                >
                  <span className={`text-[0.7rem] font-bold uppercase tracking-widest ${on ? "text-mint" : "text-ink-muted"}`}>
                    {s.label}
                  </span>
                  <span className="font-display w-full hyphens-auto text-[0.8rem] font-bold leading-tight sm:text-base">{f.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-navy">
              Choosing the <span className="text-blueberry">{active}</span> scoop
            </p>
            <button
              type="button"
              onClick={surprise}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-strawberry-soft px-4 text-sm font-semibold text-navy transition-transform hover:-rotate-2 hover:scale-105"
            >
              <span aria-hidden>🎲</span> Surprise me
            </button>
          </div>

          <ul
            aria-label={`Flavors for the ${active} scoop`}
            className="mt-3 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-2xl bg-cream p-2 sm:grid-cols-3"
          >
            {iceCreams.map((f) => {
              const current = picks[active] === f.name;
              return (
                <li key={f.name}>
                  <button
                    type="button"
                    aria-pressed={current}
                    onClick={() => pick(f)}
                    className={`flex min-h-12 w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left text-sm font-semibold transition-colors ${
                      current ? "bg-navy text-cream" : "bg-paper text-navy hover:bg-white"
                    }`}
                  >
                    <Scoop base={f.base} fleck={f.fleck} seed={f.name} className="w-9 shrink-0" />
                    <span className="leading-tight">{f.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="sr-only" role="status" aria-live="polite">
            {announce}
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            <strong className="text-navy">Your triple:</strong> {chosen.top.name}, {chosen.middle.name} and{" "}
            {chosen.bottom.name}.
          </p>
        </div>
      </div>
    </section>
  );
}
