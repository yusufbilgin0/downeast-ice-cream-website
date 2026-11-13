import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/flavors", "/sundaes", "/visit", "/story", "/wholesale", "/contact"];
  return pages.map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: p === "/flavors" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/flavors" || p === "/visit" ? 0.9 : 0.6,
  }));
}
