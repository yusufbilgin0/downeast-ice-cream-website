import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { AirVsCream } from "@/components/home/AirVsCream";
import { LocationCard } from "@/components/LocationCard";
import { Reveal } from "@/components/Reveal";
import { Scoop } from "@/components/Scoop";
import { ButtonLink, Eyebrow, Wave } from "@/components/ui";
import { dietary, iceCreams } from "@/content/flavors";
import { locations } from "@/content/site";

const favorites = iceCreams.filter((f) => f.favorite);

export default function Home() {
  return (
    <>
      <Hero />

      {/* Flavor ticker */}
      <div className="overflow-hidden border-y-2 border-navy bg-waffle-soft py-4" aria-hidden>
        <div className="flex w-max motion-safe:animate-marquee">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {iceCreams.slice(0, 24).map((f) => (
                <li key={f.name} className="font-display flex items-center gap-4 px-4 text-2xl font-bold text-navy">
                  {f.name}
                  <span className="inline-block size-3 rounded-full" style={{ background: f.base, boxShadow: "inset 0 0 0 2px #13213a" }} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Two locations */}
      <section className="px-4 py-14 sm:px-6 sm:py-28" aria-labelledby="spots">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Come &amp; visit us</Eyebrow>
            <h2 id="spots" className="font-display mt-3 max-w-2xl text-4xl font-black leading-[0.95] sm:text-6xl">
              Two sweet spots in Boothbay Harbor
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
            {locations.map((loc, i) => (
              <Reveal key={loc.id} delay={i * 0.1}>
                <LocationCard loc={loc} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Super premium explainer */}
      <Wave fill="#13213a" />
      <section className="bg-navy px-4 py-12 text-cream sm:px-6 sm:py-24" aria-labelledby="premium">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">What &ldquo;Super Premium&rdquo; means</p>
            <h2 id="premium" className="font-display mt-3 text-4xl font-black leading-[0.95] sm:text-6xl">
              More cream.
              <br />
              <span className="text-strawberry italic">Less air.</span>
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-cream/80 sm:hidden">
              One of just a handful of U.S. makers that qualify as &ldquo;Super Premium&rdquo; under federal
              guidelines: higher butterfat, less air, richer flavor.
            </p>
            <p className="mt-6 hidden max-w-lg text-lg leading-relaxed text-cream/80 sm:block">
              We&apos;re one of just a handful of makers in the U.S. who qualify as &ldquo;Super
              Premium&rdquo; under federal guidelines. That means higher butterfat, lower air, and
              flavor so rich and creamy you&apos;ll understand why there&apos;s always a line out the door.
            </p>
            <p className="mt-4 hidden max-w-lg text-cream/60 sm:block">
              Handcrafted in small batches using only the finest ingredients: ice cream the way it was
              meant to be.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <AirVsCream />
          </Reveal>
        </div>
      </section>
      <Wave fill="#fbf5ea" className="-mt-px bg-navy" />

      {/* Flavor teaser */}
      <section className="px-4 py-14 sm:px-6 sm:py-28" aria-labelledby="flavors">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <Eyebrow>Our flavors</Eyebrow>
              <h2 id="flavors" className="font-display mt-3 max-w-2xl text-4xl font-black leading-[0.95] sm:text-6xl">
                Over 65 flavors, made right here
              </h2>
            </Reveal>
            <ButtonLink href="/flavors" variant="secondary">
              Browse every flavor
            </ButtonLink>
          </div>

          <ul className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {favorites.map((f, i) => (
              <li key={f.name} className="w-[58%] shrink-0 snap-start sm:w-auto">
                <Reveal delay={i * 0.06} className="h-full">
                  <Link
                    href={`/flavors#${encodeURIComponent(f.name)}`}
                    className="group block h-full rounded-[var(--radius-scoop)] bg-paper p-5 ring-1 ring-navy/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-18px_rgba(19,33,58,.35)]"
                  >
                    <Scoop base={f.base} fleck={f.fleck} seed={f.name} className="mx-auto w-full max-w-36 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105" />
                    <h3 className="font-display mt-4 text-xl font-bold leading-tight text-navy">{f.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{f.description}</p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal className="mt-8 rounded-[var(--radius-scoop)] bg-mint-soft p-6 sm:mt-14 sm:p-10">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr] md:items-center">
              <h3 className="font-display text-2xl font-black leading-none text-navy sm:text-3xl">
                Something for every craving
              </h3>
              <ul className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
                {[...dietary, "Oat-milk vegan ice cream"].map((d) => (
                  <li key={d} className="flex items-center gap-2.5 font-semibold text-navy sm:rounded-full sm:bg-paper sm:px-4 sm:py-2 sm:ring-1 sm:ring-navy/10">
                    <svg viewBox="0 0 24 24" className="size-5 shrink-0 rounded-full bg-paper p-1 text-blueberry sm:hidden" fill="none" stroke="currentColor" strokeWidth="3.5" aria-hidden>
                      <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Factory + wholesale */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-28">
        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="h-full">
            <div className="relative h-full overflow-hidden rounded-[var(--radius-scoop)] bg-blueberry p-6 text-cream sm:p-12">
              <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">The Factory Shop</p>
              <h2 className="font-display mt-3 text-[2rem] font-black leading-[0.95] sm:text-5xl">
                Watch the magic get churned.
              </h2>
              <p className="mt-4 max-w-md text-cream/80 sm:mt-5 sm:text-lg">
                Our Meadow Mall shop isn&apos;t just a scoop shop: it&apos;s where the ice cream is
                made. Watch our team at work, then treat yourself to the freshest scoop in town.
              </p>
              <ButtonLink href="/visit" variant="light" className="mt-6 sm:mt-8">
                Find the Factory Shop
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="h-full">
            <div className="h-full rounded-[var(--radius-scoop)] bg-waffle-soft p-6 sm:p-12">
              <Eyebrow className="!text-[#8a5a24]">For businesses</Eyebrow>
              <h2 className="font-display mt-3 text-[2rem] font-black leading-[0.95] text-navy sm:text-4xl">
                Serve the ice cream they&apos;ll come back for.
              </h2>
              <p className="mt-5 text-ink-muted">
                Markets, restaurants, inns and cafés across Maine can carry our small-batch ice cream.
              </p>
              <ButtonLink href="/wholesale" variant="secondary" className="mt-6 sm:mt-8">
                Wholesale program
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing */}
      <section className="px-4 pb-16 text-center sm:px-6 sm:pb-24">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl font-black leading-[0.95] sm:text-6xl">
            Your first stop
            <span className="text-strawberry italic"> (and last treat) </span>
            in Boothbay Harbor
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-ink-muted sm:mt-6 sm:text-lg">
            Whether it&apos;s your first visit or your 50th, come taste why generations of visitors call
            us their favorite spot in Maine. Just be warned: one scoop may lead to a lifelong obsession.
          </p>
          <ButtonLink href="/visit" className="mt-8">
            Plan your visit
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
