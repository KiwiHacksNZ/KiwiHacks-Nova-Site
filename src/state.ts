import { atom } from "nanostores";
import {
  CITY_STORAGE_KEY,
  DEFAULT_CITY,
  cityBySlug,
  type City,
} from "./data/cities";

// The city being shown. Starts as the default; a stored choice replaces it on
// load, and picking one from the nav or the hint banner sets it for good.
export const city = atom<City>(DEFAULT_CITY);

/** The persisted choice, or null if the visitor hasn't made one. */
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
 * Record an explicit choice: store it, publish it to subscribers, and drop the
 * `data-city-default` flag so the hint banner stops showing.
 */
export function selectCity(next: City): void {
  try {
    localStorage.setItem(CITY_STORAGE_KEY, next.slug);
  } catch {
    // Ignore — the choice still applies for this page view.
  }
  document.documentElement.dataset.city = next.slug;
  delete document.documentElement.dataset.cityDefault;
  city.set(next);
}
