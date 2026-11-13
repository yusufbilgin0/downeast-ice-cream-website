import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { allowIndexing, locations, site } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: allowIndexing ? undefined : { index: false, follow: false },
  title: {
    default: "Super Premium Ice Cream in Boothbay Harbor, Maine | Downeast Ice Cream Factory",
    template: "%s | Downeast Ice Cream Factory",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/images/harbor-cone-3d.jpg", width: 1066, height: 1334, alt: "A triple-scoop waffle cone of blueberry, strawberry and vanilla ice cream" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fbf5ea",
};

/** LocalBusiness data so search engines can show both shops. Hours are added once confirmed. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#org`,
      name: site.name,
      url: site.url,
      foundingDate: String(site.founded),
      logo: `${site.url}/brand/downeast-badge-1200.png`,
      telephone: "+1-207-315-6670",
      sameAs: [site.social.facebook, site.social.instagram],
    },
    ...locations.map((loc) => ({
      "@type": "IceCreamShop",
      "@id": `${site.url}/#${loc.id}`,
      name: `${site.name}: ${loc.name}`,
      parentOrganization: { "@id": `${site.url}/#org` },
      url: `${site.url}/visit`,
      telephone: "+1-207-315-6670",
      image: `${site.url}/images/harbor-cone-3d.jpg`,
      servesCuisine: "Ice cream",
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.street,
        addressLocality: loc.city,
        addressRegion: loc.region,
        postalCode: loc.postalCode,
        addressCountry: "US",
      },
    })),
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US" className={`${fraunces.variable} ${figtree.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
