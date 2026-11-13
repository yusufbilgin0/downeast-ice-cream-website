"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

const icon = "size-5";
const items = [
  {
    href: "/flavors",
    label: "Flavors",
    svg: (
      <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M5.5 10.5a6.5 6.5 0 0 1 13 0Z" fill="currentColor" fillOpacity=".25" />
        <path d="M7 10.5h10l-5 11Z" />
        <path d="M8.6 14h6.8M10.2 17.5h3.6" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    href: "/visit",
    label: "Find us",
    svg: (
      <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
  },
];

/**
 * Phone-only bottom bar with the three things visitors on the go want:
 * flavors, directions, and a call button. Slides in after the first screen.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Quick actions"
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-all duration-300 md:hidden ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
      }`}
    >
      <ul className="grid grid-cols-3 gap-1 rounded-full bg-navy/95 p-1.5 text-cream shadow-xl shadow-navy/30 backdrop-blur">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                tabIndex={shown ? undefined : -1}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors ${
                  active ? "bg-cream text-navy" : "hover:bg-white/10"
                }`}
              >
                {it.svg}
                {it.label}
              </Link>
            </li>
          );
        })}
        <li>
          <a
            href={site.phone.href}
            tabIndex={shown ? undefined : -1}
            className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-buoy text-sm font-semibold text-white"
          >
            <svg viewBox="0 0 24 24" className={icon} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
            </svg>
            Call<span className="sr-only"> {site.phone.display}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
