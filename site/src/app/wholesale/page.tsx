import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Wholesale Super Premium Ice Cream in Maine",
  description:
    "Bring Downeast Ice Cream Factory's small-batch, super premium ice cream to your market, restaurant, inn, scoop shop or café. 65+ flavors, made in Boothbay Harbor, Maine.",
  alternates: { canonical: "/wholesale" },
};

const reasons = [
  {
    title: "Truly Super Premium",
    body: "We're one of the few makers in the U.S. who meet the federal definition of super premium: high butterfat, low overrun (air), and unmatched creaminess in every bite.",
    bg: "bg-strawberry-soft",
  },
  {
    title: "65+ irresistible flavors",
    body: "From Chocolate and Strawberry to bestsellers like Whoopie Pie, Blueberry and Peanut Butter Fantasy, plus sugar-free ice creams, low-fat frozen yogurts, sherbets and vegan sorbets.",
    bg: "bg-blueberry-soft",
  },
  {
    title: "Locally made, locally loved",
    body: "Crafted right here in Boothbay Harbor. Carrying our product adds Maine-made credibility and flavor to your menu or freezer case.",
    bg: "bg-mint-soft",
  },
  {
    title: "Reliable support & delivery",
    body: "Dependable wholesale supply with flexible ordering and support, so your freezer stays full and your customers stay happy.",
    bg: "bg-waffle-soft",
  },
];

export default function WholesalePage() {
  return (
    <>
      <PageHero eyebrow="Wholesale" title={<>Serve the ice cream they&apos;ll <span className="text-blueberry italic">come back for</span></>}>
        <p>
          We&apos;ve spent over 45 years perfecting super premium, old-fashioned hard ice cream. Whether
          you run a local market, restaurant, inn, scoop shop or café, we make it easy to serve what
          many call the best ice cream in Maine.
        </p>
      </PageHero>

      <section className="px-4 pb-20 sm:px-6" aria-label="Why carry our ice cream">
        <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2">
          {reasons.map((r, i) => (
            <li key={r.title}>
              <Reveal delay={(i % 2) * 0.08} className="h-full">
                <article className={`h-full rounded-[var(--radius-scoop)] ${r.bg} p-8`}>
                  <h2 className="font-display text-3xl font-black text-navy">{r.title}</h2>
                  <p className="mt-3 leading-relaxed text-ink-muted">{r.body}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section id="inquire" className="bg-paper px-4 py-20 sm:px-6" aria-labelledby="inquire-title">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="inquire-title" className="font-display text-4xl font-black leading-[0.95] sm:text-5xl">
              Let&apos;s talk ice cream
            </h2>
            <p className="mt-4 text-lg text-ink-muted">
              Tell us about your business and we&apos;ll be in touch about wholesale pricing, available
              flavors and delivery options.
            </p>
          </div>
          <InquiryForm kind="wholesale" />
        </div>
      </section>
    </>
  );
}
