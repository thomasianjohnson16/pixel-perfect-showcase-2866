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
  { path: "/about", lastmod: "2026-10-04", changefreq: "monthly", priority: "0.6" },
];

/** Site-wide structured data (rendered in __root head on every page). */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon-512.png`,
  description: "Gentle home exercise plans for older dogs and cats, made in Ireland.",
  sameAs: [
    "https://x.com/SteadyPaw",
    "https://www.instagram.com/steadypawsmobility/",
    "https://www.etsy.com/shop/SteadyPawsMobility",
  ],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

export const ldScript = (data: unknown) => ({ type: "application/ld+json", children: JSON.stringify(data) });
