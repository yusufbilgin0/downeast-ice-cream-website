/**
 * Business facts. Everything here was either confirmed by the owner or taken
 * from the existing downeasticecreamfactory.com site. Do not add facts that
 * have not been confirmed. When a CMS is added, this file becomes its seed data.
 */

export const site = {
  name: "Downeast Ice Cream Factory",
  shortName: "Downeast",
  url: "https://downeasticecreamfactory.com",
  founded: 1979,
  town: "Boothbay Harbor, Maine",
  phone: { display: "(207) 315-6670", href: "tel:+12073156670" },
  social: {
    facebook: "https://www.facebook.com/downeasticecream",
    instagram: "https://www.instagram.com/downeasticecreamfactory",
  },
  description:
    "Super premium, old-fashioned hard ice cream handcrafted in small batches in Boothbay Harbor, Maine since 1979. 65+ homemade flavors at two shops: on Pier 1 and at the Meadow Mall Factory Shop.",
} as const;

export type Location = {
  id: "pier" | "factory";
  name: string;
  tagline: string;
  blurb: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  mapsQuery: string;
};

export const locations: Location[] = [
  {
    id: "pier",
    name: "On the Pier",
    tagline: "Right in the heart of it all",
    blurb:
      "Take a stroll down Pier 1 and follow the breeze to our oceanfront shop. Enjoy your cone or cup in our cozy parlor or at a picnic table overlooking the harbor.",
    street: "1 By-Way",
    city: "Boothbay Harbor",
    region: "ME",
    postalCode: "04538",
    mapsQuery: "Downeast Ice Cream Factory, 1 By-Way, Boothbay Harbor, ME 04538",
  },
  {
    id: "factory",
    name: "The Factory Shop",
    tagline: "Where the magic happens",
    blurb:
      "Heading in or out of downtown? Our Factory Shop at the Meadow Mall, across from Hannaford, is where the ice cream is made. Watch our team churn out the creamy magic, then treat yourself to the freshest scoop in town.",
    street: "185 Townsend Ave",
    city: "Boothbay Harbor",
    region: "ME",
    postalCode: "04538",
    mapsQuery: "Downeast Ice Cream Factory, 185 Townsend Ave, Boothbay Harbor, ME 04538",
  },
];

export const directionsUrl = (loc: Location) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.mapsQuery)}`;

export const mapEmbedUrl = (loc: Location) =>
  `https://www.google.com/maps?q=${encodeURIComponent(loc.mapsQuery)}&output=embed`;

/**
 * Season and hours (both shops share them).
 * - Season: confirmed by the owner (May to October 2027).
 * - Exact opening and closing days are not confirmed yet, so the badge only
 *   switches on month boundaries.
 * - Daily hours come from the old site ("Daily from 12 pm to 9 pm").
 *   `hoursConfirmed` stays false until the owner confirms them for 2027.
 */
export const season = {
  year: 2027,
  openMonth: 5, // May
  closeMonth: 10, // October (open through the end of the month)
  label: "May through October",
  dailyOpenHour: 12,
  dailyCloseHour: 21,
  hoursLabel: "Daily, 12 – 9 pm",
  hoursConfirmed: false,
  timeZone: "America/New_York",
} as const;

export const nav = [
  { href: "/flavors", label: "Flavors" },
  { href: "/sundaes", label: "Sundaes" },
  { href: "/visit", label: "Visit" },
  { href: "/story", label: "Our Story" },
  { href: "/wholesale", label: "Wholesale" },
] as const;
