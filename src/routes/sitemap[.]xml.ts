import { createFileRoute } from "@tanstack/react-router";
import { SITEMAP_ROUTES, absUrl } from "@/lib/site";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = SITEMAP_ROUTES.map((r) =>
          `  <url><loc>${absUrl(r.path)}</loc><lastmod>${r.lastmod}</lastmod>` +
          (r.changefreq ? `<changefreq>${r.changefreq}</changefreq>` : "") +
          (r.priority ? `<priority>${r.priority}</priority>` : "") + `</url>`,
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});
