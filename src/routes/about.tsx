import { createFileRoute, Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import { CONTACT_EMAIL } from "@/components/LegalPage";
import { OG_IMAGE, absUrl, ldScript, organizationLd, pageSeo } from "@/lib/site";

const TITLE = "About Steady Paws | Gentle Exercise for Older Pets";
const DESC =
  "Steady Paws makes simple home exercise plans for older dogs and cats, built from published veterinary rehab guidance. Made in Greystones, Ireland.";

const sources = [
  ["Simple home exercises for older dogs with osteoarthritis, VIN lecture notes", "https://www.vin.com/doc/?id=5328195"],
  ["Keeping senior dogs strong, stable and engaged, dvm360", "https://www.dvm360.com/view/canine-fitness-month-keeping-senior-dogs-strong-stable-and-engaged"],
  ["Strength exercises for dogs of every age, Oakland Veterinary Referral Services", "https://www.ovrs.com/blog/?p=4889"],
  ["Helping your cat with osteoarthritis, VCA Animal Hospitals", "https://vcahospitals.com/know-your-pet/helping-your-cat-with-osteoarthritis"],
  ["How to keep a stiff cat moving, Zoetis Ireland", "https://www.zoetispets.com/ie-en/blog/cat/keep-stiff-cat-moving"],
  ["Keeping your senior cat active, Zoetis Petcare", "https://www.zoetispetcare.com/blog/article/keeping-senior-cat-active"],
] as const;

const { "@context": _ctx, ...org } = organizationLd;
const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: TITLE,
  url: absUrl("/about"),
  description: DESC,
  mainEntity: {
    ...org,
    founder: {
      "@type": "Person",
      name: "Tom",
      address: { "@type": "PostalAddress", addressLocality: "Greystones", addressCountry: "IE" },
    },
  },
};

export const Route = createFileRoute("/about")({
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
      ...pageSeo("/about").meta,
    ],
    links: pageSeo("/about").links,
    scripts: [ldScript(aboutLd)],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="px-5 pt-8">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 font-serif text-xl font-semibold text-forest-deep">
            <PawPrint className="h-6 w-6 text-amber" aria-hidden /> Steady Paws
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12 text-lg leading-relaxed">
        <h1 className="text-4xl font-semibold sm:text-5xl">About Steady Paws</h1>
        <p className="mt-6 text-ink/80">
          Steady Paws makes simple, gentle exercise plans that owners can do at home with older dogs and cats. No equipment, no clinic visits, about 10 minutes a day.
        </p>

        <h2 className="mt-12 text-3xl font-semibold">Why I started it</h2>
        <p className="mt-4 text-ink/80">
          I'm Tom, and I live in Greystones, Co. Wicklow, with our 7-year-old Labrador, Ranger. Seven is around when vets start calling a lab a senior. He hasn't slowed down yet, and I'd like to keep it that way, so I went looking for simple exercises we could do together at home. Most of what I found was written for vets, not owners. Steady Paws is the plain-English version I wanted.
        </p>

        <h2 className="mt-12 text-3xl font-semibold">Where the exercises come from</h2>
        <p className="mt-4 text-ink/80">
          Every exercise is adapted from published veterinary rehabilitation and senior-pet guidance, rewritten so any owner can follow it safely. I'm not a vet, so the plan includes a traffic-light safety check and clear stop signs for every exercise, and it always recommends checking with your vet first.
        </p>
        <h3 className="mt-6 font-serif text-xl font-semibold">Sources</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          {sources.map(([label, href]) => (
            <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="text-forest underline">{label}</a></li>
          ))}
        </ul>

        <h2 className="mt-12 text-3xl font-semibold">Contact</h2>
        <p className="mt-4 text-ink/80">
          Questions about the plan? Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-forest underline">{CONTACT_EMAIL}</a>. Follow along on X{" "}
          <a href="https://x.com/SteadyPaw" target="_blank" rel="noopener noreferrer" className="text-forest underline">@SteadyPaw</a> and Instagram{" "}
          <a href="https://www.instagram.com/steadypawsmobility/" target="_blank" rel="noopener noreferrer" className="text-forest underline">@steadypawsmobility</a>.
        </p>
      </main>
      <footer className="bg-forest-deep px-5 py-8 text-cream/85">
        <nav aria-label="Footer" className="mx-auto flex max-w-3xl flex-wrap gap-x-6">
          {([["Home", "/"], ["Exercises", "/exercises"], ["Video demos", "/videos"], ["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund Policy", "/refund-policy"], ["Disclaimer", "/disclaimer"]] as const).map(([l, to]) => (
            <Link key={to} to={to} className="inline-flex min-h-12 items-center hover:text-cream">{l}</Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
