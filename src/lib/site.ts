/** The only public domain search engines should see. */
export const SITE_URL = "https://steadypaw.enterprises";
export const SITE_NAME = "Steady Paws";
export const OG_IMAGE = `${SITE_URL}/og-cover.jpg`;

/** Absolute URL for a path on the public site. */
export const absUrl = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;

/** Shared canonical + og:url + site-wide OG tags for a page path. */
export function pageSeo(path: string) {
  const url = absUrl(path);
  return {
    meta: [
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_IE" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

/**
 * Indexable pages listed in /sitemap.xml. Add new routes here
 * (e.g. /about, /exercises/..., /guides/...) and they appear automatically.
 */
export const SITEMAP_ROUTES: { path: string; lastmod: string; changefreq?: string; priority?: string }[] = [
  { path: "/", lastmod: "2026-10-04", changefreq: "weekly", priority: "1.0" },
  { path: "/videos", lastmod: "2026-10-04", changefreq: "monthly", priority: "0.8" },
];
