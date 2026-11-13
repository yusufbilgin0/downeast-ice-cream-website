import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions, feedback or special requests? Call Downeast Ice Cream Factory at (207) 315-6670 or send us a message.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Get in touch" title={<>We&apos;d love to hear from you</>}>
        <p>
          Questions, feedback or special requests? Call us at{" "}
          <a href={site.phone.href} className="whitespace-nowrap font-semibold text-blueberry underline underline-offset-4">
            {site.phone.display}
          </a>{" "}
          or send a message below. Looking for hours and directions?{" "}
          <Link href="/visit" className="font-semibold text-blueberry underline underline-offset-4">
            Visit us
          </Link>
          .
        </p>
      </PageHero>
      <section className="px-4 pb-24 sm:px-6" aria-label="Contact form">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-scoop)] bg-paper p-6 ring-1 ring-navy/5 sm:p-10">
          <InquiryForm kind="contact" />
        </div>
      </section>
    </>
  );
}
