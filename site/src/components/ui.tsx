import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Tide-line divider between sections. `fill` is the color of the section below. */
export function Wave({ fill, className = "" }: { fill: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-16 ${className}`}
      aria-hidden
      focusable="false"
    >
      <path
        d="M0 40 C120 10 240 10 360 34 C480 58 600 70 720 50 C840 30 960 8 1080 18 C1200 28 1320 58 1440 46 L1440 80 L0 80 Z"
        fill={fill}
      />
    </svg>
  );
}

type ButtonProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "light";
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const styles = {
    primary: "bg-buoy text-white hover:bg-[#a82d23] shadow-[0_6px_0_#7f2018] active:translate-y-1 active:shadow-[0_2px_0_#7f2018]",
    secondary: "bg-paper text-navy ring-2 ring-navy hover:bg-navy hover:text-cream",
    light: "bg-cream text-navy hover:bg-white shadow-[0_6px_0_rgba(0,0,0,.25)] active:translate-y-1",
  }[variant];
  return (
    <Link
      {...rest}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all duration-200 ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.2em] text-blueberry ${className}`}>{children}</p>
  );
}

export function PageHero({
  eyebrow,
  title,
  children,
  bg = "bg-cream",
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  bg?: string;
}) {
  return (
    <section className={`${bg} px-4 pb-14 pt-32 sm:px-6 sm:pt-40`}>
      <div className="mx-auto max-w-6xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="font-display mt-4 max-w-3xl text-5xl font-black leading-[0.95] text-navy sm:text-7xl">
          {title}
        </h1>
        {children && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{children}</div>}
      </div>
    </section>
  );
}
