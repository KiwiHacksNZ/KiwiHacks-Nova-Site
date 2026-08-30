import { geolocation, next } from "@vercel/edge";
import { CITY_COOKIE, cityFromGeo } from "./src/data/cities";

/*
 * Vercel edge middleware. The site is a static build, so it cannot look at the
 * request itself — this runs in front of the HTML and passes the visitor's
 * likely city down as a cookie, which the inline bootstrap script in
 * Layout.astro reads before first paint.
 *
 * The IP never leaves Vercel: `geolocation()` just parses the `x-vercel-ip-*`
 * headers Vercel already attached to the request.
 *
 * Everything downstream treats a missing cookie as "no guess", so if this ever
 * stops running the site quietly falls back to the default city.
 */

// Every HTML route, listed literally rather than as a pattern so there is no
// matcher syntax to get wrong. Static assets are left alone: they have no use
// for the cookie, and matching them would run this far more often than needed.
//
// Both slash forms are listed because either can be linked to from outside.
// A new page needs adding here, or its nav will show the default city.
export const config = {
  matcher: ["/", "/team", "/team/", "/faq", "/faq/"],
};

export default function middleware(request: Request): Response {
  const detected = cityFromGeo(geolocation(request));
  if (!detected) return next();

  return next({
    headers: {
      // Readable from JS by design — the bootstrap script needs it. It holds a
      // city slug and nothing identifying.
      "set-cookie": `${CITY_COOKIE}=${detected.slug}; Path=/; Max-Age=86400; SameSite=Lax; Secure`,
    },
  });
}
