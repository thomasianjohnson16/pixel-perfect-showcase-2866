import { createFileRoute, Link } from "@tanstack/react-router";
import { ExerciseShell } from "@/components/ExerciseShell";
import { exercises } from "@/data/exercises";
import { OG_IMAGE, SITE_URL, absUrl, ldScript, pageSeo } from "@/lib/site";

const TITLE = "Gentle Exercises for Senior Dogs and Cats | Steady Paws";
const DESC = "11 gentle, equipment-free home exercises for older dogs and cats, each with a 20-second video demo, step-by-step instructions and clear stop signs.";

export const Route = createFileRoute("/exercises/")({
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
      ...pageSeo("/exercises").meta,
    ],
    links: pageSeo("/exercises").links,
    scripts: [ldScript({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Exercises", item: absUrl("/exercises") },
      ],
    })],
  }),
  component: ExercisesIndex,
});

function ExercisesIndex() {
  return (
    <ExerciseShell>
      <nav aria-label="Breadcrumb" className="text-base text-ink/70">
        <Link to="/" className="underline">Home</Link> <span aria-hidden>›</span> Exercises
      </nav>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Gentle Exercises for Senior Dogs and Cats</h1>
      <p className="mt-4 text-ink/80">Eleven gentle, equipment-free exercises: eight for dogs and three for cats. Each has a short video demo and clear stop signs.</p>
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {exercises.map((e) => (
          <li key={e.slug}>
            <Link to="/exercises/$slug" params={{ slug: e.slug }}
              className="block h-full rounded-2xl bg-card p-6 shadow-soft transition hover:-translate-y-0.5">
              <span className="inline-block rounded-full bg-sage px-3 py-1 text-base font-medium text-forest">{e.kind === "cat" ? "Cats" : "Dogs"} · {e.time}</span>
              <h2 className="mt-3 font-serif text-2xl font-semibold">{e.name}</h2>
              <p className="mt-2 text-base text-ink/75">{e.who}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ExerciseShell>
  );
}
