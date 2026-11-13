import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, PageHero } from "@/components/ui";
import { bananaSplit, norEaster, oneScoopTreats, twoScoopSundaes, type Treat } from "@/content/sundaes";

export const metadata: Metadata = {
  title: "Specialty Sundaes, Parfaits & Banana Splits",
  description:
    "Two-scoop sundaes with any flavor, one-scoop sundaes and parfaits, banana splits and the Nor'Easter at Downeast Ice Cream Factory in Boothbay Harbor.",
  alternates: { canonical: "/sundaes" },
};

const palette = ["bg-strawberry-soft", "bg-blueberry-soft", "bg-mint-soft", "bg-waffle-soft"];

function TreatList({ items, offset = 0 }: { items: Treat[]; offset?: number }) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((t, i) => (
        <li key={t.name}>
          <Reveal delay={(i % 3) * 0.06} className="h-full">
            <article className={`h-full rounded-[var(--radius-scoop)] ${palette[(i + offset) % palette.length]} p-7 transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-0.6deg]`}>
              <h3 className="font-display text-2xl font-black leading-tight text-navy">{t.name}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{t.description}</p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export default function SundaesPage() {
  return (
    <>
      <PageHero eyebrow="Specialty sundaes" title={<>Piled high, <span className="text-strawberry italic">made to order</span></>}>
        <p>Two-scoop sundaes are available with any ice cream flavor. Pick your favorite and we&apos;ll do the rest.</p>
      </PageHero>

      <section className="px-4 pb-16 sm:px-6" aria-labelledby="two">
        <div className="mx-auto max-w-6xl">
          <h2 id="two" className="font-display text-4xl font-black sm:text-5xl">Two-scoop sundaes</h2>
          <TreatList items={twoScoopSundaes} />
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6" aria-labelledby="one">
        <div className="mx-auto max-w-6xl">
          <h2 id="one" className="font-display text-4xl font-black sm:text-5xl">One-scoop sundaes &amp; parfaits</h2>
          <TreatList items={oneScoopTreats} offset={1} />
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6" aria-label="Banana split and Nor'Easter">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="h-full">
            <article className="h-full rounded-[var(--radius-scoop)] bg-navy p-8 text-cream sm:p-10">
              <h2 className="font-display text-4xl font-black">{bananaSplit.name}</h2>
              <dl className="mt-6 space-y-5">
                {bananaSplit.options.map((o) => (
                  <div key={o.label}>
                    <dt className="font-display text-xl font-bold text-strawberry">{o.label}</dt>
                    <dd className="mt-1 text-cream/80">{o.description}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <article className="h-full rounded-[var(--radius-scoop)] bg-blueberry p-8 text-cream sm:p-10">
              <h2 className="font-display text-4xl font-black">{norEaster.name}</h2>
              <p className="mt-4 text-lg text-cream/85">{norEaster.description}</p>
            </article>
          </Reveal>
        </div>
        <div className="mt-14 text-center">
          <ButtonLink href="/flavors" variant="secondary">Pick your flavors</ButtonLink>
        </div>
      </section>
    </>
  );
}
