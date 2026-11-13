import { season } from "@/content/site";

export type ShopStatus =
  | { kind: "open"; label: string; detail: string }
  | { kind: "closed-today"; label: string; detail: string }
  | { kind: "off-season"; label: string; detail: string };

/** Wall-clock parts for the shops' time zone, regardless of the visitor's. */
function harborTime(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: season.timeZone,
    year: "numeric",
    month: "numeric",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return { year: get("year"), month: get("month"), hour: get("hour") };
}

const fmtHour = (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "am" : "pm"}`;

export function getShopStatus(now = new Date()): ShopStatus {
  const { year, month, hour } = harborTime(now);
  const inSeason =
    year === season.year && month >= season.openMonth && month <= season.closeMonth;

  if (!inSeason) {
    const upcoming = year < season.year || (year === season.year && month < season.openMonth);
    return {
      kind: "off-season",
      label: "Closed for the winter",
      detail: upcoming
        ? `Back for the ${season.year} season · ${season.label}`
        : `See you next season`,
    };
  }

  if (!season.hoursConfirmed) {
    return { kind: "open", label: "Open for the season", detail: season.hoursLabel };
  }

  if (hour >= season.dailyOpenHour && hour < season.dailyCloseHour) {
    return { kind: "open", label: "Open now", detail: `Until ${fmtHour(season.dailyCloseHour)} today` };
  }
  return {
    kind: "closed-today",
    label: "Closed right now",
    detail: `Opens at ${fmtHour(season.dailyOpenHour)}`,
  };
}
