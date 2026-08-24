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

// The home page ("/") defaults to this city.
export const DEFAULT_CITY_SLUG = "auckland";

export function cityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export const DEFAULT_CITY = cityBySlug(DEFAULT_CITY_SLUG)!;
