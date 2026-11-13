"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { canUse3D, isDesktopPointer } from "@/lib/webgl";

const ConeScene = dynamic(() => import("../three/ConeScene"), { ssr: false });

type Mode = "static" | "loading" | "live";

/**
 * Homepage hero cone.
 * 1. The static render is always in the HTML: it is the fast first paint, the
 *    image search engines see, and the fallback for reduced motion, data saver,
 *    low-memory devices or no WebGL.
 * 2. Once the page is idle, the 3D scene is downloaded and drawn behind the
 *    image, then cross-faded in after its first frames have rendered.
 * 3. The render loop stops while the hero is off screen or the tab is hidden.
 */
export function ConeHero() {
  const box = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [detail, setDetail] = useState<"high" | "low">("high");
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [still, setStill] = useState(false);
  /** Phones and tablets: the still is shown and 3D loads only when the visitor asks. */
  const [offer, setOffer] = useState(false);

  useEffect(() => {
    if (!canUse3D()) return;
    const start = () => {
      // `?cone-still` freezes the pose so the fallback image can be re-captured from the live model.
      const freeze = new URLSearchParams(window.location.search).has("cone-still");
      const desktop = isDesktopPointer();
      if (!desktop && !freeze) {
        // Measured: on a mid-range phone, starting 3D blocks the page for ~2 s. Make it opt-in there.
        setOffer(true);
        return;
      }
      setStill(freeze);
      setDetail("high");
      setMode((m) => (m === "static" ? "loading" : m));
    };
    const hasIdle = typeof window.requestIdleCallback === "function";
    let id: number | undefined;
    const schedule = () => {
      id = hasIdle ? window.requestIdleCallback(start, { timeout: 2500 }) : window.setTimeout(start, 1200);
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
    setDetail("low");
    setMode("loading");
  };

  return (
    <div ref={box} className="relative aspect-[4/5] w-full" data-cone-mode={mode}>
      <div
        className="absolute inset-0"
        role="img"
        aria-label="A triple-scoop waffle cone: blueberry on top, strawberry in the middle and vanilla at the bottom"
      >
      {/* soft harbor glow behind the cone */}
      <div
        aria-hidden
        className={`absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,rgba(36,55,90,.2),rgba(36,55,90,0))] transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
      />

      <Image
        src="/images/harbor-cone-3d.jpg"
        alt=""
        width={1066}
        height={1334}
        priority
        sizes="(min-width: 1024px) 40vw, (min-width: 640px) 24rem, 13rem"
        className={`absolute inset-0 h-full w-full mix-blend-multiply transition-opacity duration-700 [mask-image:radial-gradient(ellipse_46%_50%_at_50%_50%,#000_72%,transparent_100%)] ${
          live ? "opacity-0" : "opacity-100 motion-safe:animate-float"
        }`}
      />

      {mode !== "static" && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}>
          <ConeScene
            active={inView && tabVisible}
            detail={detail}
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
          disabled={mode === "loading"}
          className="absolute bottom-[6%] left-1/2 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-paper/90 px-4 text-sm font-semibold text-navy shadow-md ring-1 ring-navy/10 backdrop-blur disabled:opacity-70"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 3v6h-6" />
          </svg>
          {mode === "loading" ? "Loading 3D…" : "Spin in 3D"}
        </button>
      )}
    </div>
  );
}
