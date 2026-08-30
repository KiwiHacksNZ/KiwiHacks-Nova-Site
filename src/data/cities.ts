// Shared constants for the Nova site.

// Single source of truth for the sign-up link. Used by every "Sign up for Nova!" button.
export const SIGNUP_URL = "https://kiwihacks.fillout.com/nova";

export type City = {
  name: string;
  // URL slug, e.g. "/auckland".
  slug: string;
  date: string;
};

// Dropdown order.
export const CITIES: City[] = [
  { name: "Wellington", slug: "wellington", date: "28-29 Sep" },
  { name: "Christchurch", slug: "christchurch", date: "2-3 Oct" },
  { name: "Auckland", slug: "auckland", date: "9-10 Oct" },
];

// localStorage key holding the slug of the city the visitor explicitly picked.
// Read by the inline bootstrap script in Layout.astro before first paint.
export const CITY_STORAGE_KEY = "selectedCity";

// Cookie set by the Vercel edge middleware (middleware.ts) holding the slug it
// guessed from the request IP. Only consulted when there is no stored choice.
export const CITY_COOKIE = "detectedCity";

// Shown to visitors who haven't picked a city, alongside a banner offering the
// other two. A stored choice always wins over this.
export const DEFAULT_CITY_SLUG = "auckland";

export function cityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export const DEFAULT_CITY = cityBySlug(DEFAULT_CITY_SLUG)!;

// The hero banner line, used both at build time and by the inline script that
// swaps in the visitor's city.
export function cityBannerText(city: City): string {
  return `${city.name}  ·  ${city.date}  ·  Location TBC`;
}

// ISO 3166-2 subdivision codes (minus the "NZ-" prefix, which is how Vercel
// reports them) for the regions each city serves. Matching on region rather
// than city name means the suburbs count too: someone in Manukau or Lower Hutt
// gets Auckland or Wellington rather than falling through to the default.
const REGION_TO_SLUG: Record<string, string> = {
  AUK: "auckland",
  WGN: "wellington",
  CAN: "christchurch",
};

// Fallback for when the region is missing but the city name isn't.
const CITY_NAME_TO_SLUG: Record<string, string> = {
  auckland: "auckland",
  wellington: "wellington",
  "lower hutt": "wellington",
  "upper hutt": "wellington",
  porirua: "wellington",
  christchurch: "christchurch",
};

/**
 * Best guess at a Nova city from a request's geo headers, or undefined if the
 * visitor isn't near one. Anyone outside New Zealand falls through to
 * undefined, and so gets the default city: region codes are only unique within
 * a country, so they are meaningless without the country check.
 */
export function cityFromGeo(geo: {
  country?: string;
  city?: string;
  countryRegion?: string;
}): City | undefined {
  if (geo.country?.toUpperCase() !== "NZ") return undefined;

  const byRegion =
    geo.countryRegion && REGION_TO_SLUG[geo.countryRegion.toUpperCase()];
  if (byRegion) return cityBySlug(byRegion);

  const byName = geo.city && CITY_NAME_TO_SLUG[geo.city.trim().toLowerCase()];
  if (byName) return cityBySlug(byName);

  return undefined;
}
