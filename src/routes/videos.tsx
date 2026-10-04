import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { PawPrint } from "lucide-react";
import { demoVideos, videoUrl, videoFileUrl } from "@/lib/videos";
import { OG_IMAGE, SITE_URL, absUrl, ldScript, pageSeo } from "@/lib/site";

const videosLd = demoVideos.map((v) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.title,
  description: v.description,
  thumbnailUrl: [OG_IMAGE],
  contentUrl: videoFileUrl(v.file),
  embedUrl: `${absUrl("/videos")}#${v.id}`,
  uploadDate: v.uploadDate,
  duration: "PT20S",
}));

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Video demos", item: absUrl("/videos") },
  ],
};

const TITLE = "Senior Dog Exercise Videos: 11 Home Physio Demos | Steady Paws";
const DESC = "Watch 20-second demos of 11 gentle exercises for older dogs and cats: sit-to-stand, stretches, balance and DIY cavaletti. No equipment needed.";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
      ...pageSeo("/videos").meta,
    ],
    links: pageSeo("/videos").links,
    scripts: [...videosLd.map(ldScript), ldScript(breadcrumbLd)],
  }),
  component: VideosPage,
});

function VideosPage() {
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ block: "start" });
      const v = el.querySelector("video");
      if (v) { v.muted = true; void v.play().catch(() => {}); }
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);

  return (
    <div id="top" className="min-h-screen bg-cream text-ink">
      <header className="px-5 pt-8">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 font-serif text-xl font-semibold text-forest-deep">
            <PawPrint className="h-6 w-6 text-amber" aria-hidden /> Steady Paws
          </Link>
          <h1 className="mt-8 text-4xl font-semibold sm:text-5xl">Video demos</h1>
          <p className="mt-4 text-lg text-ink/75">
            Every exercise from your 28-day plan, about 20 seconds each. Watch once before you start, then follow the steps in your PDF.
          </p>
        </div>
      </header>

      <nav aria-label="Jump to exercise" className="sticky top-0 z-20 mt-6 border-b border-ink/10 bg-cream/95 px-5 py-3 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-3xl gap-2 overflow-x-auto">
          {demoVideos.map((v) => (
            <a key={v.id} href={`#${v.id}`}
              className="flex min-h-12 shrink-0 items-center rounded-full bg-sage px-4 font-medium text-forest hover:bg-forest hover:text-cream">
              {v.id.startsWith("cat") ? `Cat ${v.badge}` : `Dog ${v.badge}`}
            </a>
          ))}
        </div>
      </nav>

      <main className="px-5 pb-16">
        <div className="mx-auto max-w-3xl">
          {demoVideos.map((v) => (
            <section key={v.id} id={v.id} className="scroll-mt-24 border-b border-ink/10 py-12 last:border-0">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest font-serif text-xl text-cream">{v.badge}</span>
                <h2 className="text-2xl font-semibold sm:text-3xl">{v.title}</h2>
              </div>
              <video
                src={videoUrl(v.file)} controls playsInline muted loop preload="metadata"
                aria-label={`Demo video: ${v.title}`}
                className="mt-6 aspect-square w-full max-w-[640px] rounded-2xl bg-sage object-cover shadow-soft"
              />
              <a href="#top" className="mt-4 inline-flex min-h-12 items-center font-medium text-forest underline">Back to top</a>
            </section>
          ))}
        </div>
      </main>

      <footer className="bg-forest-deep px-5 py-8 text-center text-cream/85">
        Educational content only. Check with your vet before starting a new routine.
      </footer>
    </div>
  );
}
