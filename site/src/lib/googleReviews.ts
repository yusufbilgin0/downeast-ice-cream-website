/**
 * Google rating + reviews via the Places API (New). Server-only.
 *
 * Google Maps Platform rules (developers.google.com/maps/documentation/places/web-service/policies):
 * - Reviews may NOT be cached or stored: every call fetches fresh data (no-store).
 * - Place IDs MAY be stored indefinitely, so the looked-up ID is memoized.
 * - The page must show "Google Maps" attribution, credit each author, link each
 *   review to Google Maps, and explain how reviews are ordered (see GoogleReviews.tsx).
 *
 * Billing: the `reviews` field puts each details call in the "Place Details Enterprise +
 * Atmosphere" SKU (1,000 free calls/month at the time of writing). The ID lookup uses
 * "Text Search Essentials (IDs Only)", which is free.
 */
import "server-only";
import { locations } from "@/content/site";

export type PublicReview = {
  rating: number;
  text: string;
  translated: boolean;
  when: string;
  mapsUri?: string;
  flagUri?: string;
  author: { name: string; uri?: string; photo?: string };
};

export type ReviewsPayload = {
  rating?: number;
  count?: number;
  mapsUri?: string;
  reviews: PublicReview[];
};

type GoogleReview = {
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  googleMapsUri?: string;
  flagContentUri?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

const API = "https://places.googleapis.com/v1";
let memoPlaceId: string | undefined;

export function reviewsConfigured() {
  return Boolean(process.env.GOOGLE_PLACES_API_KEY);
}

async function placeId(key: string): Promise<string> {
  if (process.env.GOOGLE_PLACE_ID) return process.env.GOOGLE_PLACE_ID;
  if (memoPlaceId) return memoPlaceId;
  const pier = locations[0];
  const res = await fetch(`${API}/places:searchText`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "places.id" },
    body: JSON.stringify({ textQuery: `Downeast Ice Cream Factory, ${pier.street}, ${pier.city}, ${pier.region} ${pier.postalCode}` }),
  });
  if (!res.ok) throw new Error(`place lookup failed: ${res.status}`);
  const id = (await res.json())?.places?.[0]?.id;
  if (!id) throw new Error("place not found");
  memoPlaceId = id;
  return id;
}

export async function fetchGoogleReviews(): Promise<ReviewsPayload> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("not configured");
  const id = await placeId(key);
  const res = await fetch(`${API}/places/${encodeURIComponent(id)}?languageCode=en`, {
    cache: "no-store",
    headers: {
      "X-Goog-Api-Key": key,
      // Only the fields the page shows (field masks also set the billing tier).
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
    },
  });
  if (!res.ok) throw new Error(`details failed: ${res.status}`);
  const p = await res.json();
  return {
    rating: typeof p.rating === "number" ? p.rating : undefined,
    count: typeof p.userRatingCount === "number" ? p.userRatingCount : undefined,
    mapsUri: p.googleMapsUri,
    reviews: ((p.reviews ?? []) as GoogleReview[])
      .filter((r) => r.text?.text && r.authorAttribution?.displayName)
      .map((r) => ({
        rating: r.rating ?? 0,
        text: r.text!.text!,
        translated: Boolean(r.originalText?.languageCode && r.originalText.languageCode !== r.text?.languageCode),
        when: r.relativePublishTimeDescription ?? "",
        mapsUri: r.googleMapsUri,
        flagUri: r.flagContentUri,
        author: {
          name: r.authorAttribution!.displayName!,
          uri: r.authorAttribution!.uri,
          photo: r.authorAttribution!.photoUri,
        },
      })),
  };
}
