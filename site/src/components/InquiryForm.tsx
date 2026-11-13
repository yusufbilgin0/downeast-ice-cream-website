"use client";

import { useState, type FormEvent } from "react";
import { site } from "@/content/site";

type State = "idle" | "sending" | "sent" | "error" | "unavailable";

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  autoComplete,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  textarea?: boolean;
}) {
  const id = `f-${name}`;
  const cls =
    "mt-2 w-full rounded-2xl bg-paper px-4 py-3 text-navy ring-1 ring-navy/15 focus:outline-none focus:ring-2 focus:ring-blueberry aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-buoy";
  const common = {
    id,
    name,
    required,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-err` : undefined,
    className: cls,
  };
  return (
    <div className={textarea ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="font-semibold text-navy">
        {label}
        {required && <span className="text-buoy"> *</span>}
      </label>
      {textarea ? <textarea rows={5} {...common} /> : <input type={type} {...common} />}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm font-semibold text-buoy">
          {error}
        </p>
      )}
    </div>
  );
}

export function InquiryForm({ kind }: { kind: "contact" | "wholesale" }) {
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = { kind, ...Object.fromEntries(new FormData(form)) };
    setState("sending");
    setErrors({});
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("sent");
        form.reset();
      } else if (res.status === 422) {
        setErrors(json.errors ?? {});
        setState("idle");
      } else if (res.status === 503) {
        setState("unavailable");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-[var(--radius-scoop)] bg-mint-soft p-8 text-center">
        <p className="font-display text-3xl font-black text-navy">Thanks! Message received.</p>
        <p className="mt-2 text-ink-muted">We&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Name" name="name" required autoComplete="name" error={errors.name} />
      <Field label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" error={errors.phone} />
      {kind === "wholesale" ? (
        <Field label="Business name" name="business" required autoComplete="organization" error={errors.business} />
      ) : (
        <div aria-hidden className="hidden sm:block" />
      )}
      <Field
        label={kind === "wholesale" ? "Tell us about your business" : "Message"}
        name="message"
        required
        textarea
        error={errors.message}
      />
      {/* Honeypot for bots */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2" aria-live="polite">
        {state === "unavailable" && (
          <p className="mb-4 rounded-2xl bg-waffle-soft p-4 text-navy">
            Our online form isn&apos;t connected yet. Please call us at{" "}
            <a href={site.phone.href} className="whitespace-nowrap font-semibold underline">{site.phone.display}</a>.
          </p>
        )}
        {state === "error" && (
          <p className="mb-4 rounded-2xl bg-strawberry-soft p-4 text-navy">
            Something went wrong sending your message. Please try again or call{" "}
            <a href={site.phone.href} className="whitespace-nowrap font-semibold underline">{site.phone.display}</a>.
          </p>
        )}
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex min-h-12 items-center rounded-full bg-buoy px-7 font-semibold text-white shadow-[0_6px_0_#7f2018] transition-all hover:bg-[#a82d23] active:translate-y-1 active:shadow-[0_2px_0_#7f2018] disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : kind === "wholesale" ? "Send inquiry" : "Send message"}
        </button>
      </div>
    </form>
  );
}
