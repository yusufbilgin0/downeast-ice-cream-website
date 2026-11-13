import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="px-4 pb-24 pt-40 text-center sm:px-6">
      <title>Page not found | Downeast Ice Cream Factory</title>
      <p className="font-display text-8xl font-black text-strawberry">Oops!</p>
      <h1 className="font-display mt-4 text-4xl font-black text-navy">This scoop melted away.</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist. Maybe a flavor will cheer you up?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/flavors">See the flavors</ButtonLink>
        <ButtonLink href="/" variant="secondary">Back home</ButtonLink>
      </div>
    </section>
  );
}
