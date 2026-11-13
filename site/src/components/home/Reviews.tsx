import { reviewSites } from "@/content/site";
import { Reveal } from "../Reveal";
import { Eyebrow } from "../ui";
import { GoogleReviews } from "./GoogleReviews";

const accent: Record<(typeof reviewSites)[number]["id"], string> = {
  google: "bg-blueberry-soft text-blueberry",
  tripadvisor: "bg-mint-soft text-[#2f7a5a]",
  yelp: "bg-strawberry-soft text-[#b8465f]",
};

/**
 * Points visitors to independent reviews. We link out instead of quoting:
 * no review text or ratings are copied, written or paraphrased here.
 */
export function Reviews() {
  return (
    <section className="px-4 pb-14 sm:px-6 sm:pb-24" aria-labelledby="reviews-title">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-14">
        <Reveal>
          <Eyebrow>Reviews</Eyebrow>
          <h2 id="reviews-title" className="font-display mt-3 text-[2.25rem] font-black leading-[0.95] text-navy sm:text-6xl">
            Locals love us.
            <span className="block text-blueberry italic">Visitors seek us out.</span>
          </h2>
          <p className="mt-4 max-w-md text-ink-muted sm:mt-6 sm:text-lg">
            Don&apos;t just take our word for it. See what people say about their scoops on the review sites
            they trust.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="grid gap-3">
            {reviewSites.map((r) => (
              <li key={r.id}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-18 items-center gap-4 rounded-2xl bg-paper p-3 pr-5 ring-1 ring-navy/8 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-16px_rgba(19,33,58,.4)] sm:min-h-22 sm:p-4 sm:pr-6"
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-xl sm:size-14 ${accent[r.id]}`} aria-hidden>
                    <svg viewBox="0 0 24 24" className="size-6" fill="currentColor">
                      <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7Z" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-xl font-black leading-tight text-navy sm:text-2xl">{r.name}</span>
                    <span className="block text-sm text-ink-muted">{r.cta}</span>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 shrink-0 text-navy/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    aria-hidden
                  >
                    <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <GoogleReviews />
      </div>
    </section>
  );
}
