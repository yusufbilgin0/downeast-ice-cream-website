"use client";

import { useEffect, useRef, useState } from "react";
import type { ReviewsPayload } from "@/lib/googleReviews";

function Stars({ value, className = "size-4" }: { value: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <svg key={i} viewBox="0 0 24 24" className={className}>
            <defs>
              <linearGradient id={`s${i}-${Math.round(value * 10)}`}>
                <stop offset={`${fill * 100}%`} stopColor="#f2b01e" />
                <stop offset={`${fill * 100}%`} stopColor="#d9d2c4" />
              </linearGradient>
            </defs>
            <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z" fill={`url(#s${i}-${Math.round(value * 10)})`} />
          </svg>
        );
      })}
    </span>
  );
}

/**
 * Live Google rating + up to 5 reviews. Loads only when the section is about to
 * scroll into view (each load is a billable Places API call). If the API isn't
 * configured, is over quota, or fails, nothing renders and the review links stay.
 *
 * Display follows Google Maps Platform policies: "Google Maps" attribution in the
 * container, author name + avatar + profile link, a Google Maps link per review,
 * and a note on how reviews are ordered.
 */
export function GoogleReviews() {
  const box = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ReviewsPayload | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ctrl = new AbortController();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch("/api/reviews", { signal: ctrl.signal })
          .then((r) => (r.ok ? r.json() : null))
          .then((d: ReviewsPayload | null) => {
            if (d && d.reviews?.length) setData(d);
          })
          .catch(() => {});
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      ctrl.abort();
    };
  }, []);

  return (
    <div ref={box} className="min-w-0 lg:col-span-2" aria-live="polite">
      {data && (
        <div className="rounded-[var(--radius-scoop)] bg-paper p-5 ring-1 ring-navy/8 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex items-center gap-3">
              {data.rating !== undefined && (
                <span className="font-display text-4xl font-black leading-none text-navy sm:text-5xl">{data.rating.toFixed(1)}</span>
              )}
              <span>
                {data.rating !== undefined && <Stars value={data.rating} className="size-5" />}
                <span className="sr-only">{data.rating?.toFixed(1)} out of 5 stars</span>
                {data.count !== undefined && (
                  <span className="block text-sm text-ink-muted">
                    {data.count.toLocaleString("en-US")} reviews on <span translate="no">Google Maps</span>
                  </span>
                )}
              </span>
            </div>
            <span translate="no" className="text-xs font-semibold tracking-wide text-ink-muted">
              Google Maps
            </span>
          </div>

          <ul className="no-scrollbar relative -mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scroll-padding-inline:1.25rem] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-3">
            {data.reviews.map((r, i) => (
              <li key={i} className="w-[17rem] shrink-0 snap-start sm:w-auto">
                <article className="flex h-full flex-col rounded-2xl bg-cream p-4 sm:p-5">
                  <header className="flex items-center gap-3">
                    {r.author.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Google-hosted avatar, shown as provided
                      <img src={r.author.photo} alt="" width={36} height={36} referrerPolicy="no-referrer" loading="lazy" className="size-9 rounded-full" />
                    ) : (
                      <span aria-hidden className="grid size-9 place-items-center rounded-full bg-blueberry-soft font-bold text-blueberry">
                        {r.author.name.slice(0, 1)}
                      </span>
                    )}
                    <span className="min-w-0">
                      {r.author.uri ? (
                        <a href={r.author.uri} target="_blank" rel="noopener noreferrer" className="block truncate font-semibold text-navy hover:underline">
                          {r.author.name}
                        </a>
                      ) : (
                        <span className="block truncate font-semibold text-navy">{r.author.name}</span>
                      )}
                      <span className="block text-xs text-ink-muted">{r.when}</span>
                    </span>
                  </header>
                  <p className="mt-3 flex items-center gap-2">
                    <Stars value={r.rating} />
                    <span className="sr-only">{r.rating} out of 5 stars</span>
                  </p>
                  <p className="mt-2 line-clamp-6 text-[0.95rem] leading-relaxed text-navy/85">{r.text}</p>
                  {r.translated && (
                    <p className="mt-2 text-xs text-ink-muted">
                      Translated by <span translate="no">Google</span>
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm">
                    {r.mapsUri && (
                      <a href={r.mapsUri} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-blueberry hover:underline">
                        Read on <span translate="no" className="ml-1">Google Maps</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    )}
                    {r.flagUri && (
                      <a href={r.flagUri} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-xs text-ink-muted hover:underline">
                        Report
                      </a>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-relaxed text-ink-muted">
            Showing the reviews <span translate="no">Google</span> ranks as most relevant. Google doesn&apos;t verify
            reviews, but it removes fake content when it&apos;s identified.
            {data.mapsUri && (
              <>
                {" "}
                <a href={data.mapsUri} target="_blank" rel="noopener noreferrer" className="font-semibold text-blueberry underline underline-offset-2">
                  See all reviews on <span translate="no">Google Maps</span>
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
