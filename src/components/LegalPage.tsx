import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const SELLER = "Thomas Johnson";
export const BRAND = "Steady Paws";
export const CONTACT_EMAIL = "hello@steadypaws.com";
export const UPDATED = "2 October 2026";

/** Shared shell for the legal pages (terms, privacy, refunds, disclaimer). */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="bg-forest-deep px-5 py-5 text-cream">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="font-serif text-xl font-semibold">Steady Paws</Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="font-serif text-4xl font-semibold">{title}</h1>
        <p className="mt-2 text-ink/70">Last updated: {UPDATED}</p>
        <div className="legal mt-8 space-y-5 text-base leading-relaxed [&_a]:underline [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <footer className="bg-forest-deep px-5 py-8 text-cream/80">
        <nav className="mx-auto flex max-w-3xl flex-wrap gap-x-6" aria-label="Legal">
          <Link to="/" className="inline-flex min-h-12 items-center hover:text-cream">Home</Link>
          <Link to="/terms" className="inline-flex min-h-12 items-center hover:text-cream">Terms</Link>
          <Link to="/privacy" className="inline-flex min-h-12 items-center hover:text-cream">Privacy</Link>
          <Link to="/refund-policy" className="inline-flex min-h-12 items-center hover:text-cream">Refund Policy</Link>
          <Link to="/disclaimer" className="inline-flex min-h-12 items-center hover:text-cream">Disclaimer</Link>
        </nav>
      </footer>
    </div>
  );
}

export function legalHead(title: string, description: string, path: string) {
  const full = `${title} | Steady Paws`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: path },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: path }],
  };
}
