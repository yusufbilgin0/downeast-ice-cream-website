import { directionsUrl, season, site, type Location } from "@/content/site";

const theme = {
  pier: { bg: "bg-blueberry-soft", accent: "text-blueberry", badge: "Oceanfront parlor" },
  factory: { bg: "bg-strawberry-soft", accent: "text-[#b8465f]", badge: "Made here" },
} as const;

export function LocationCard({ loc, headingLevel = "h3" }: { loc: Location; headingLevel?: "h2" | "h3" }) {
  const t = theme[loc.id];
  const H = headingLevel;
  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-scoop)] ${t.bg} p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9`}>
      <span className={`self-start rounded-full bg-paper px-3 py-1 text-xs font-bold uppercase tracking-widest ${t.accent}`}>
        {t.badge}
      </span>
      <H className="font-display mt-5 text-4xl font-black leading-none text-navy">{loc.name}</H>
      <p className={`mt-2 font-semibold ${t.accent}`}>{loc.tagline}</p>
      <p className="mt-4 leading-relaxed text-ink-muted">{loc.blurb}</p>

      <dl className="mt-6 grid gap-3 text-navy">
        <div>
          <dt className="text-xs font-bold uppercase tracking-widest text-ink-muted">Address</dt>
          <dd>
            <address className="not-italic">
              {loc.street}, {loc.city}, {loc.region} {loc.postalCode}
            </address>
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-widest text-ink-muted">Season</dt>
          <dd>
            {season.label} {season.year} · {season.hoursLabel}
          </dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap gap-3 pt-8">
        <a
          href={directionsUrl(loc)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center rounded-full bg-navy px-5 font-semibold text-cream transition-colors hover:bg-navy-soft"
        >
          Directions<span className="sr-only"> to {loc.name} (opens Google Maps)</span>
        </a>
        <a
          href={site.phone.href}
          className="inline-flex min-h-12 items-center rounded-full bg-paper px-5 font-semibold text-navy ring-1 ring-navy/15 transition-colors hover:bg-white"
        >
          Call
        </a>
      </div>
    </article>
  );
}
