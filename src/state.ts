import { atom } from "nanostores";
import {
  CITY_STORAGE_KEY,
  DEFAULT_CITY,
  cityBySlug,
  type City,
} from "./data/cities";

// The city being shown. Starts as the default; whatever the bootstrap script
// resolved replaces it on load, and picking one from the nav or the hint banner
// sets it for good.
export const city = atom<City>(DEFAULT_CITY);

/**
 * The city the inline bootstrap script settled on, read back off <html>. That
 * script has already weighed the stored choice, the geo cookie and the default,
 * so this is the one place the rest of the page needs to look.
 */
export function activeCity(): City {
  const slug = document.documentElement.dataset.city;
  return (slug && cityBySlug(slug)) || DEFAULT_CITY;
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
