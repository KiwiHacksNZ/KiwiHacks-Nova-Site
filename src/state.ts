import { atom } from "nanostores";
import { CITY_STORAGE_KEY, cityBySlug, type City } from "./data/cities";

// The visitor's chosen city, or null until they pick one. There is no default
// city: the landing page gates on this being set.
export const city = atom<City | null>(null);

/** The persisted choice, or null if there isn't a valid one. */
export function readStoredCity(): City | null {
  try {
    const slug = localStorage.getItem(CITY_STORAGE_KEY);
    return (slug && cityBySlug(slug)) || null;
  } catch {
    // Private mode / storage disabled — fall back to a per-session choice.
    return null;
  }
}

/**
 * Record the choice: store, publish to subscribers, and flip the document
 * attributes the gate CSS keys off so city-specific content becomes visible.
 */
export function selectCity(next: City): void {
  try {
    localStorage.setItem(CITY_STORAGE_KEY, next.slug);
  } catch {
    // Ignore — the choice still applies for this page view.
  }
  document.documentElement.dataset.city = next.slug;
  delete document.documentElement.dataset.cityPick;
  city.set(next);
}
