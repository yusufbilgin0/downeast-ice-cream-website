import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { AirVsCream } from "@/components/home/AirVsCream";
import { ButtonLink, PageHero, Wave } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Our Story: Serving Up Smiles Since 1979",
  description:
    "Every summer since 1979, Downeast Ice Cream Factory has served super premium, small-batch ice cream in Boothbay Harbor, Maine.",
  alternates: { canonical: "/story" },
};

const chapters = [
  {
    kicker: String(site.founded),
    title: "Serving up smiles by the scoop",
    body: "Every summer since 1979, Downeast Ice Cream Factory has been serving up smiles by the scoop in the heart of Boothbay Harbor, Maine. Vacationers seek us out, locals love us, and generations of visitors call us their favorite spot in Maine.",
    bg: "bg-strawberry-soft",
  },
  {
    kicker: "Small batch",
    title: "The way ice cream was meant to be",
    body: "Our ice cream is handcrafted in small batches using only the finest ingredients: super premium, old-fashioned hard ice cream that's rich, nostalgic and unforgettable.",
    bg: "bg-blueberry-soft",
  },
  {
    kicker: "The Factory",
    title: "Made right here in town",
    body: "Our Factory Shop at the Meadow Mall is where the ice cream is made. Stop by, watch our team churn out the creamy magic, and treat yourself to the freshest scoop in town.",
    bg: "bg-mint-soft",
  },
];

export default function StoryPage() {
  return (
    <>
      <PageHero eyebrow="Our story" title={<>A Boothbay Harbor tradition since <span className="text-blueberry italic">1979</span></>} />

      <section className="px-4 pb-20 sm:px-6">
        <ol className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {chapters.map((c, i) => (
            <li key={c.title}>
              <Reveal delay={i * 0.08} className="h-full">
                <article className={`h-full rounded-[var(--radius-scoop)] ${c.bg} p-8`}>
                  <p className="font-display text-5xl font-black text-navy/20">{c.kicker}</p>
                  <h2 className="font-display mt-4 text-3xl font-black leading-tight text-navy">{c.title}</h2>
                  <p className="mt-4 leading-relaxed text-ink-muted">{c.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <Wave fill="#13213a" />
      <section className="bg-navy px-4 py-20 text-cream sm:px-6" aria-labelledby="premium">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 id="premium" className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
              One of a handful of true &ldquo;Super Premium&rdquo; makers
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/80">
              We&apos;re one of just a handful of makers in the U.S. who qualify as &ldquo;Super
              Premium&rdquo; under federal guidelines: higher butterfat, lower air, and flavor so rich
              and creamy it&apos;s the taste you&apos;ll be talking about long after the last bite.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <AirVsCream />
          </Reveal>
        </div>
      </section>
      <Wave fill="#fbf5ea" className="-mt-px bg-navy" />

      <section className="px-4 py-20 text-center sm:px-6">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-black sm:text-5xl">Come taste the difference</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/visit">Plan your visit</ButtonLink>
            <ButtonLink href="/flavors" variant="secondary">See the flavors</ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
