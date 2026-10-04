import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PawPrint } from "lucide-react";

export function ExerciseShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-clip bg-cream text-ink">
      <header className="px-5 pt-8">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 font-serif text-xl font-semibold text-forest-deep">
            <PawPrint className="h-6 w-6 text-amber" aria-hidden /> Steady Paws
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-10 text-lg leading-relaxed">{children}</main>
      <footer className="bg-forest-deep px-5 py-8 text-cream/85">
        <nav aria-label="Footer" className="mx-auto flex max-w-3xl flex-wrap gap-x-6">
          {([["Home", "/"], ["Exercises", "/exercises"], ["Video demos", "/videos"], ["About", "/about"], ["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund Policy", "/refund-policy"], ["Disclaimer", "/disclaimer"]] as const).map(([l, to]) => (
            <Link key={to} to={to} className="inline-flex min-h-12 items-center hover:text-cream">{l}</Link>
          ))}
        </nav>
        <p className="mx-auto mt-4 max-w-3xl text-base text-cream/60">Educational content only. Not a substitute for advice from your vet.</p>
      </footer>
    </div>
  );
}
