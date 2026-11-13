import { useId } from "react";

/** Deterministic pseudo-random numbers so each flavor always gets the same flecks. */
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const SCOOP_PATH =
  "M12 64 C6 42 22 18 50 12 C64 5 86 8 99 20 C113 29 118 47 111 63 C107 71 101 66 95 73 C89 79 82 70 75 77 C67 83 61 73 53 79 C45 85 38 75 31 79 C23 83 16 73 12 64 Z";

/**
 * Illustrated scoop of ice cream. Pure SVG, so it is crisp at any size and
 * costs nothing to download. Decorative: hidden from screen readers.
 */
export function Scoop({
  base,
  fleck,
  seed,
  className,
}: {
  base: string;
  fleck?: string;
  seed: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const rand = seeded(seed);
  const flecks = fleck
    ? Array.from({ length: 16 }, () => ({
        x: 22 + rand() * 80,
        y: 20 + rand() * 50,
        r: 1.4 + rand() * 2.4,
        rot: rand() * 180,
      }))
    : [];

  return (
    <svg viewBox="0 0 124 90" className={className} aria-hidden focusable="false">
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={SCOOP_PATH} />
        </clipPath>
        <radialGradient id={`shade-${id}`} cx="35%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#13213a" stopOpacity="0.22" />
        </radialGradient>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <rect width="124" height="90" fill={base} />
        {/* scooped ridges */}
        <path d="M20 40 C40 30 70 28 104 38" stroke="#13213a" strokeOpacity="0.07" strokeWidth="3" fill="none" />
        <path d="M16 56 C44 46 78 46 110 54" stroke="#13213a" strokeOpacity="0.07" strokeWidth="3" fill="none" />
        {flecks.map((f, i) => (
          <rect
            key={i}
            x={f.x}
            y={f.y}
            width={f.r * 1.8}
            height={f.r}
            rx={f.r / 2}
            fill={fleck}
            transform={`rotate(${f.rot} ${f.x} ${f.y})`}
          />
        ))}
        <rect width="124" height="90" fill={`url(#shade-${id})`} />
      </g>
    </svg>
  );
}
