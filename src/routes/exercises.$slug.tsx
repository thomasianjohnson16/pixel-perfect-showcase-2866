import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExerciseShell } from "@/components/ExerciseShell";
import { getExercise, type Exercise } from "@/data/exercises";
import { demoVideos, videoFileUrl, videoUrl } from "@/lib/videos";
import { OG_IMAGE, SITE_URL, absUrl, ldScript, pageSeo } from "@/lib/site";

const cut = (s: string, n = 155) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(" ", n - 1)).replace(/[,.;:]$/, "") + "…");

function videoFor(e: Exercise) {
  return demoVideos.find((v) => v.id === e.videoId)!;
}

export const Route = createFileRoute("/exercises/$slug")({
  loader: ({ params }) => {
    const exercise = getExercise(params.slug);
    if (!exercise) throw notFound();
    return { exercise };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Exercise not found | Steady Paws" }, { name: "robots", content: "noindex" }] };
    const e = loaderData.exercise;
    const path = `/exercises/${e.slug}`;
    const desc = cut(e.answer);
    const v = videoFor(e);
    const howTo = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: e.h1,
      description: e.answer,
      ...(e.isoTime ? { totalTime: e.isoTime } : {}),
      step: e.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
      video: {
        "@type": "VideoObject",
        name: `${e.name}: 20-second demo`,
        description: v.description,
        thumbnailUrl: [OG_IMAGE],
        contentUrl: videoFileUrl(v.file),
        embedUrl: absUrl(path),
        uploadDate: v.uploadDate,
        duration: "PT20S",
      },
    };
    const crumbs = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Exercises", item: absUrl("/exercises") },
        { "@type": "ListItem", position: 3, name: e.name, item: absUrl(path) },
      ],
    };
    return {
      meta: [
        { title: e.title },
        { name: "description", content: desc },
        { property: "og:title", content: e.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: OG_IMAGE },
        ...pageSeo(path).meta,
      ],
      links: pageSeo(path).links,
      scripts: [ldScript(howTo), ldScript(crumbs)],
    };
  },
  notFoundComponent: ExerciseNotFound,
  component: ExercisePage,
});

function ExerciseNotFound() {
  return (
    <ExerciseShell>
      <h1 className="text-4xl font-semibold">Exercise not found</h1>
      <Link to="/exercises" className="mt-6 inline-flex min-h-12 items-center text-forest underline">See all exercises</Link>
    </ExerciseShell>
  );
}

function ExercisePage() {
  const { exercise: e } = Route.useLoaderData();
  const v = videoFor(e);
  const related = e.related.map(getExercise).filter((x): x is Exercise => !!x);
  return (
    <ExerciseShell>
      <nav aria-label="Breadcrumb" className="text-base text-ink/70">
        <Link to="/" className="underline">Home</Link> <span aria-hidden>›</span>{" "}
        <Link to="/exercises" className="underline">Exercises</Link> <span aria-hidden>›</span> {e.name}
      </nav>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{e.h1}</h1>
      <p className="mt-5 text-ink/85">{e.answer}</p>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Quick facts">
        {[e.time, e.reps, e.safety].map((f) => (
          <li key={f} className="rounded-full bg-sage px-4 py-2 text-base font-medium text-forest">{f}</li>
        ))}
      </ul>

      <figure className="mt-8">
        <video src={videoUrl(v.file)} controls playsInline muted loop autoPlay preload="metadata"
          aria-label={`Demo video: ${e.name}`}
          className="aspect-square w-full max-w-[640px] rounded-2xl bg-sage object-cover shadow-soft" />
        <figcaption className="mt-2 text-base text-ink/70">20-second demo</figcaption>
      </figure>

      <h2 className="mt-12 text-3xl font-semibold">Who it helps</h2>
      <p className="mt-3 text-ink/80">{e.who}</p>

      <h2 className="mt-12 text-3xl font-semibold">How to do it</h2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 text-ink/85">
        {e.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>

      <h2 className="mt-12 text-3xl font-semibold">Stop if</h2>
      <div className="mt-4 rounded-2xl border-l-4 border-danger bg-danger/10 p-5">
        <p><strong className="text-danger">Stop if: </strong>{e.stop}</p>
      </div>

      <p className="mt-8 text-base italic text-ink/70">Always check with your vet before starting a new exercise routine.</p>

      <div className="mt-12 rounded-2xl bg-forest-deep p-8 text-cream">
        <p className="font-serif text-2xl font-semibold">This is one of 11 exercises in the 28-Day Senior Mobility Plan</p>
        <Link to="/" hash="buy" className="btn-amber mt-6">Get the plan – €14</Link>
      </div>

      <h2 className="mt-12 text-3xl font-semibold">More exercises</h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {related.map((r) => (
          <li key={r.slug}>
            <Link to="/exercises/$slug" params={{ slug: r.slug }} className="block rounded-2xl bg-card p-5 shadow-soft">
              <span className="font-serif text-xl font-semibold">{r.name}</span>
              <span className="mt-1 block text-base text-ink/70">{r.who}</span>
            </Link>
          </li>
        ))}
      </ul>
    </ExerciseShell>
  );
}
