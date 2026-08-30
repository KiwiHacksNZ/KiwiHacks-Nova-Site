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

// localStorage key holding the slug of the city the visitor picked.
// Read by the inline bootstrap script in Layout.astro before first paint.
export const CITY_STORAGE_KEY = "selectedCity";

export function cityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
