"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { canUse3D, isDesktopPointer } from "@/lib/webgl";

const loadScene = () => import("../three/ConeScene");
const ConeScene = dynamic(loadScene, { ssr: false });

type Mode = "static" | "loading" | "live";

/** Run `fn` once the page has loaded and the main thread is idle. Returns a cancel function. */
function whenIdle(fn: () => void, timeout: number) {
  const hasIdle = typeof window.requestIdleCallback === "function";
  let id: number | undefined;
  const schedule = () => {
    id = hasIdle ? window.requestIdleCallback(fn, { timeout }) : window.setTimeout(fn, 1200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (id !== undefined) {
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    }
  };
}

/**
 * Homepage hero cone.
 * - The still render is always in the HTML: fast first paint, what search engines
 *   and link previews see, and the fallback (reduced motion, data saver, weak
 *   devices, no WebGL).
 * - Desktop: the 3D scene loads when the page is idle and cross-fades in.
 * - Phones: 3D is opt-in ("Tap to spin"). Its code is pre-downloaded while idle so
 *   the tap starts quickly; it then runs a lighter scene with a slow turntable
 *   and drag-to-spin. (Auto-starting it measured ~2 s of page freeze on a
 *   mid-range phone.)
 * - Rendering pauses while the hero is off screen or the tab is hidden.
 */
export function ConeHero() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [touch, setTouch] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [still, setStill] = useState(false);
  const [offer, setOffer] = useState(false);

  useEffect(() => {
    if (!canUse3D()) return;
    return whenIdle(() => {
      // `?cone-still` freezes the pose so the fallback image can be re-captured from the live model.
      const freeze = new URLSearchParams(window.location.search).has("cone-still");
      if (!isDesktopPointer() && !freeze) {
        setOffer(true);
        // Pre-download (not run) the 3D code so "Tap to spin" responds quickly.
        whenIdle(() => void loadScene(), 4000);
        return;
      }
      setStill(freeze);
      setMode((m) => (m === "static" ? "loading" : m));
    }, 2500);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const live = mode === "live";
  const startOnDemand = () => {
    if (mode !== "static") return;
    setTouch(true);
    setMode("loading");
  };

  return (
    <div ref={box} className="relative aspect-[4/5] w-full" data-cone-mode={mode}>
      <div
        className="absolute inset-0"
        role="img"
        aria-label="A triple-scoop waffle cone: blueberry on top, strawberry in the middle and vanilla at the bottom"
        onClick={offer ? startOnDemand : undefined}
      >
        {/* soft harbor glow behind the live cone */}
        <div
          aria-hidden
          data-cone-glow
          className={`absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(36,55,90,.18),rgba(36,55,90,0))] transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
        />

        <Image
          src="/images/harbor-cone-3d.jpg"
          alt=""
          width={1066}
          height={1334}
          priority
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 28rem, 92vw"
          className={`absolute inset-0 h-full w-full mix-blend-multiply transition-opacity duration-700 [mask-image:radial-gradient(ellipse_46%_50%_at_50%_50%,#000_72%,transparent_100%)] ${
            live ? "opacity-0" : "opacity-100 motion-safe:animate-float"
          }`}
        />

        {mode !== "static" && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}>
            <ConeScene
              active={inView && tabVisible}
              detail={touch ? "low" : "high"}
              touch={touch}
              still={still}
              onReady={() => setMode("live")}
              onContextLost={() => setMode("static")}
            />
          </div>
        )}
      </div>

      {offer && !live && (
        <button
          type="button"
          onClick={startOnDemand}
          aria-busy={mode === "loading"}
          className="absolute bottom-4 left-1/2 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-navy py-1.5 pl-1.5 pr-4 text-sm font-semibold text-cream shadow-lg shadow-navy/20 transition-transform active:scale-95"
        >
          <span className="grid size-8 place-items-center rounded-full bg-cream/15 text-[0.7rem] font-black tracking-wide">
            {mode === "loading" ? (
              <svg viewBox="0 0 24 24" className="size-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                <path d="M21 12a9 9 0 1 1-9-9" strokeLinecap="round" />
              </svg>
            ) : (
              "3D"
            )}
          </span>
          {mode === "loading" ? "Getting it ready…" : "Tap to spin"}
        </button>
      )}

      {live && touch && (
        <p aria-hidden className="hint-fade pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper/85 px-3 py-1.5 text-xs font-semibold text-navy shadow-sm backdrop-blur">
          ← Drag to spin →
        </p>
      )}
    </div>
  );
}
