import type { MetadataRoute } from "next";
import { allowIndexing, site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    // Pre-launch / preview: ask all crawlers to stay out.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
