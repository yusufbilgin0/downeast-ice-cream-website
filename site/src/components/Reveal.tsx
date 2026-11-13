import type { ReactNode } from "react";

/**
 * Fades and lifts content in as it scrolls into view, using CSS scroll-driven
 * animations (see `.reveal` in globals.css). No JavaScript, so content is never
 * stuck hidden: browsers without support, and visitors who prefer reduced
 * motion, simply see it immediately.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Small stagger (seconds), applied as a later start within the reveal range. */
  delay?: number;
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`} style={delay ? ({ "--reveal-shift": `${Math.round(delay * 100)}%` } as React.CSSProperties) : undefined}>
      {children}
    </div>
  );
}
