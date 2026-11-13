"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Site-wide motion policy. Components always render the same markup on the
 * server and in the browser; Motion itself skips transform/layout animation for
 * visitors who prefer reduced motion. (Branching on the preference inside
 * components caused server/browser mismatches that left content hidden.)
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
