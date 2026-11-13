import Link from "next/link";
import { directionsUrl, locations, nav, season, site } from "@/content/site";
import Image from "next/image";
import { StatusBadge } from "./StatusBadge";
import { Wave } from "./ui";

export function Footer() {
  return (
    <footer className="mt-auto">
      <Wave fill="#13213a" className="bg-transparent" />
      <div className="bg-navy px-4 pb-10 pt-8 text-cream sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block transition-transform duration-300 hover:-rotate-3">
              <Image
                src="/brand/downeast-badge.svg"
                alt={`${site.name}, Boothbay Harbor, Maine, since ${site.founded}`}
                width={1000}
                height={1000}
                unoptimized
                className="h-40 w-40"
              />
            </Link>
            <p className="mt-5 max-w-xs text-cream/75">
              Super premium ice cream, handcrafted in small batches in {site.town} since {site.founded}.
            </p>
            <div className="mt-5">
              <StatusBadge tone="dark" />
            </div>
          </div>

          {locations.map((loc) => (
            <div key={loc.id}>
              <h2 className="font-display text-xl font-bold">{loc.name}</h2>
              <address className="mt-3 not-italic leading-relaxed text-cream/80">
                {loc.street}
                <br />
                {loc.city}, {loc.region} {loc.postalCode}
              </address>
              <a
                href={directionsUrl(loc)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-semibold text-mint underline-offset-4 hover:underline"
              >
                Get directions<span className="sr-only"> to {loc.name} (opens Google Maps)</span> →
              </a>
            </div>
          ))}

          <div>
            <h2 className="font-display text-xl font-bold">Hours</h2>
            <p className="mt-3 text-cream/80">
              {season.label} {season.year}
              <br />
              {season.hoursLabel}
            </p>
            <a href={site.phone.href} className="mt-3 inline-block font-semibold text-mint hover:underline">
              {site.phone.display}
            </a>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-6 border-t border-cream/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              {[...nav, { href: "/contact", label: "Contact" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/80 hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex size-11 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20" aria-label="Instagram (opens in a new tab)">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex size-11 items-center justify-center rounded-full bg-cream/10 hover:bg-cream/20" aria-label="Facebook (opens in a new tab)">
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z" /></svg>
            </a>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-xs text-cream/50">
          © {site.name} · Serving Boothbay Harbor since {site.founded}
        </p>
      </div>
    </footer>
  );
}
