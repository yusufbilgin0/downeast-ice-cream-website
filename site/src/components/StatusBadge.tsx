"use client";

import { useEffect, useState } from "react";
import { getShopStatus, type ShopStatus } from "@/lib/status";

/**
 * Live open/closed badge. Computed in the browser so the static page never
 * shows a stale status, and refreshed every minute.
 */
export function StatusBadge({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<ShopStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getShopStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const dot =
    status?.kind === "open"
      ? "bg-emerald-500"
      : status?.kind === "closed-today"
        ? "bg-amber-500"
        : "bg-buoy";

  const shell =
    tone === "dark"
      ? "bg-white/10 text-cream ring-white/20"
      : "bg-paper text-navy ring-navy/10 shadow-sm";

  return (
    <p
      role="status"
      aria-live="polite"
      className={`inline-flex min-h-10 items-center gap-2.5 rounded-full px-4 py-2 text-sm ring-1 ${shell}`}
    >
      <span className="relative flex size-2.5" aria-hidden>
        {status?.kind === "open" && (
          <span className={`absolute inline-flex size-full animate-ping rounded-full ${dot} opacity-60`} />
        )}
        <span className={`relative inline-flex size-2.5 rounded-full ${status ? dot : "bg-navy/20"}`} />
      </span>
      {status ? (
        <span>
          <strong className="font-semibold">{status.label}</strong>
          <span className="opacity-75"> · {status.detail}</span>
        </span>
      ) : (
        <span className="opacity-60">Checking today&apos;s hours…</span>
      )}
    </p>
  );
}
