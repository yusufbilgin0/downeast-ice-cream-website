import { directionsUrl, season, site, type Location } from "@/content/site";

const theme = {
  pier: { bg: "bg-blueberry-soft", accent: "text-blueberry", badge: "Oceanfront parlor" },
  factory: { bg: "bg-strawberry-soft", accent: "text-[#b8465f]", badge: "Made here" },
} as const;

const Pin = () => (
  <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
const Clock = () => (
  <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/**
 * A shop card. On phones it is compact by default (name, tagline, address,
 * hours, two big buttons); pass `full` to always show the description.
 */
export function LocationCard({ loc, headingLevel = "h3", full = false }: { loc: Location; headingLevel?: "h2" | "h3"; full?: boolean }) {
  const t = theme[loc.id];
  const H = headingLevel;
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-scoop)] ${t.bg} p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-9`}>
      <span className={`self-start rounded-full bg-paper px-3 py-1 text-[0.7rem] font-bold uppercase tracking-widest ${t.accent}`}>
        {t.badge}
      </span>
      <H className="font-display mt-4 text-3xl font-black leading-none text-navy sm:mt-5 sm:text-4xl">{loc.name}</H>
      <p className={`mt-1.5 font-semibold ${t.accent}`}>{loc.tagline}</p>
      <p className={`mt-4 leading-relaxed text-ink-muted ${full ? "" : "hidden sm:block"}`}>{loc.blurb}</p>

      <dl className="mt-5 grid gap-2.5 text-[0.95rem] text-navy sm:mt-6 sm:gap-3 sm:text-base">
        <div className="flex gap-2.5">
          <dt className="text-ink-muted">
            <span className="sr-only">Address</span>
            <Pin />
          </dt>
          <dd>
            <address className="not-italic">
              {loc.street}, {loc.city}, {loc.region} {loc.postalCode}
            </address>
          </dd>
        </div>
        <div className="flex gap-2.5">
          <dt className="text-ink-muted">
            <span className="sr-only">Season</span>
            <Clock />
          </dt>
          <dd>
            {season.label} {season.year} · <span className="whitespace-nowrap">{season.hoursLabel}</span>
          </dd>
        </div>
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-6 sm:flex sm:flex-wrap sm:pt-8">
        <a
          href={directionsUrl(loc)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-navy px-5 font-semibold text-cream transition-colors hover:bg-navy-soft"
        >
          Directions<span className="sr-only"> to {loc.name} (opens Google Maps)</span>
        </a>
        <a
          href={site.phone.href}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-paper px-5 font-semibold text-navy ring-1 ring-navy/15 transition-colors hover:bg-white"
        >
          Call
        </a>
      </div>
    </article>
  );
}
