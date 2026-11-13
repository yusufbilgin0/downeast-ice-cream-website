import { readFile } from "node:fs/promises";
import { fetchGoogleReviews, reviewsConfigured } from "@/lib/googleReviews";

/**
 * GET /api/reviews: live Google rating + reviews for the homepage.
 * The browser calls this only when the reviews section is about to scroll into
 * view. Responses are never cached (Google Maps Platform terms).
 */
const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  // Local layout testing only: never active on Vercel.
  if (process.env.REVIEWS_MOCK_FILE && process.env.VERCEL !== "1") {
    return Response.json(JSON.parse(await readFile(process.env.REVIEWS_MOCK_FILE, "utf8")), { headers: noStore });
  }
  if (!reviewsConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503, headers: noStore });
  }
  try {
    return Response.json(await fetchGoogleReviews(), { headers: noStore });
  } catch (e) {
    console.error("[reviews]", e instanceof Error ? e.message : e);
    // Quota reached, bad key, network: the page keeps its plain review links.
    return Response.json({ error: "unavailable" }, { status: 502, headers: noStore });
  }
}
