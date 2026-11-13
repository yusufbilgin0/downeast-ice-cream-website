import type { Metadata } from "next";
import { LocationCard } from "@/components/LocationCard";
import { Reveal } from "@/components/Reveal";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHero } from "@/components/ui";
import { locations, mapEmbedUrl, season, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Visit Us: Locations, Hours & Directions",
  description:
    "Find Downeast Ice Cream Factory on Pier 1 (1 By-Way) and at the Meadow Mall Factory Shop (185 Townsend Ave) in Boothbay Harbor, Maine. Open May through October.",
  alternates: { canonical: "/visit" },
};

const faqs = [
  {
    q: "When are you open?",
    a: `Both shops are open for the season ${season.label.toLowerCase()} ${season.year}, ${season.hoursLabel.toLowerCase()}. We close for the winter.`,
  },
  {
    q: "Which shop should I visit?",
    a: "Strolling downtown? Head to our oceanfront parlor on Pier 1 and grab a picnic table overlooking the harbor. Driving in or out of town? Stop at the Factory Shop at the Meadow Mall, across from Hannaford, where the ice cream is made.",
  },
  {
    q: "Can I watch the ice cream being made?",
    a: "Yes. Our Factory Shop at the Meadow Mall is where we make our ice cream, and you can watch our team at work.",
  },
  {
    q: "Do you have dairy-free or sugar-free options?",
    a: "We offer dairy-free vegan sorbets, oat-milk vegan ice cream, sugar-free ice creams, low-fat frozen yogurts and fruit-forward sherbets. Please ask our team about allergens.",
  },
];

export default function VisitPage() {
  return (
    <>
      <PageHero eyebrow="Come & visit us" title={<>Two sweet spots in Boothbay Harbor</>}>
        <StatusBadge compact />
        <p className="mt-5">
          {season.label} {season.year} · {season.hoursLabel} at both shops. Questions? Call us at{" "}
          <a href={site.phone.href} className="whitespace-nowrap font-semibold text-blueberry underline underline-offset-4">
            {site.phone.display}
          </a>
          .
        </p>
      </PageHero>

      <section className="px-4 pb-20 sm:px-6" aria-label="Our shops">
        <div className="mx-auto grid max-w-6xl gap-10">
          {locations.map((loc, i) => (
            <Reveal key={loc.id}>
              <div className={`grid items-stretch gap-6 lg:grid-cols-2 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <LocationCard loc={loc} headingLevel="h2" full />
                <div className="min-h-80 overflow-hidden rounded-[var(--radius-scoop)] bg-cream-deep ring-1 ring-navy/10">
                  <iframe
                    title={`Map of ${loc.name}, ${loc.street}, ${loc.city}`}
                    src={mapEmbedUrl(loc)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="size-full min-h-80 border-0"
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-paper px-4 py-20 sm:px-6" aria-labelledby="faq">
        <div className="mx-auto max-w-3xl">
          <h2 id="faq" className="font-display text-4xl font-black sm:text-5xl">Good to know</h2>
          <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
            {faqs.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-cream text-xl transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="pb-4 pr-12 leading-relaxed text-ink-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
