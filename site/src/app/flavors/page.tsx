import type { Metadata } from "next";
import { FlavorWall } from "@/components/FlavorWall";
import { StackYourCone } from "@/components/flavors/StackYourCone";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, PageHero } from "@/components/ui";
import { dietary, otherTreats } from "@/content/flavors";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Flavors: 65+ Homemade Super Premium Ice Creams",
  description:
    "Browse 65+ homemade flavors from Maine Blueberry to Whoopie Pie and Peanut Butter Fantasy, plus soft serve, sherbet, dairy-free sorbet and oat-milk vegan ice cream.",
  alternates: { canonical: "/flavors" },
};

export default function FlavorsPage() {
  return (
    <>
      <PageHero eyebrow="Our flavors" title={<>Over 65 flavors you can count on</>}>
        <p>
          Our core classics and customer favorites never go out of style. From fruity to chocolatey,
          sweet to salty, these are the flavors you&apos;ll find scooped fresh at both of our Boothbay
          Harbor shops. Follow us on{" "}
          <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-blueberry underline underline-offset-4">
            Instagram
          </a>{" "}
          for the latest scoop.
        </p>
      </PageHero>

      <StackYourCone />

      <section className="px-4 pb-20 sm:px-6" aria-labelledby="ice-creams">
        <div className="mx-auto max-w-6xl">
          <h2 id="ice-creams" className="sr-only">Ice cream flavors</h2>
          <FlavorWall />
        </div>
      </section>

      <section className="bg-paper px-4 py-20 sm:px-6" aria-labelledby="more">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 id="more" className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
              Soft serve, sherbets, sorbets &amp; vegan
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {otherTreats.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.06}>
                <div className="h-full rounded-[var(--radius-scoop)] p-7" style={{ background: t.color }}>
                  <h3 className="font-display text-2xl font-black text-navy">{t.title}</h3>
                  {t.note && <p className="mt-1 text-sm font-semibold text-navy/70">{t.note}</p>}
                  <ul className="mt-4 space-y-1.5 text-lg text-navy">
                    {t.items.map((it) => (
                      <li key={it} className="flex items-center gap-2">
                        <span aria-hidden className="size-2 rounded-full bg-navy/40" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 grid gap-6 rounded-[var(--radius-scoop)] bg-cream p-7 sm:p-9 md:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-black text-navy">Dietary needs? We&apos;ve got you.</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {dietary.map((d) => (
                  <li key={d} className="rounded-full bg-paper px-3 py-1.5 text-sm font-semibold ring-1 ring-navy/10">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-ink-muted">
              <h3 className="font-display text-2xl font-black text-navy">Allergies</h3>
              <p className="mt-3">
                Flavor families on this page are for browsing only and are not allergen labels. Please
                ask our team about ingredients and allergens before you order.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 text-center">
            <ButtonLink href="/sundaes">See our specialty sundaes</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
