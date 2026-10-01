import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  PawPrint, Download, Heart, ShieldCheck, Lock, Check, X, TrendingUp, Moon, Footprints,
  Timer, Gamepad2, Cat, Dumbbell, Droplets, RefreshCw, ChevronDown, CreditCard, Mail,
} from "lucide-react";
import cover from "@/assets/cover.jpg";
import page1 from "@/assets/page1.jpg";
import page2 from "@/assets/page2.jpg";
import page3 from "@/assets/page3.jpg";
import { PetQuiz } from "@/components/PetQuiz";
import { CheckoutProvider, ConsentBox, PaymentTestModeBanner, useCheckout } from "@/components/Checkout";
import { CookieBanner } from "@/components/CookieBanner";
import { track } from "@/lib/pixel";

export function BuyTrigger({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { buy } = useCheckout();
  return <button type="button" onClick={buy} className={className}>{children}</button>;
}

function PricingBuy() {
  const { consent, buy, busy, error } = useCheckout();
  return (
    <>
      <div className="mt-7"><ConsentBox id="consent-pricing" /></div>
      <button type="button" disabled={!consent || busy} onClick={buy} className="btn-amber mt-4 w-full text-lg disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? "Opening secure checkout…" : "Get instant access"}
      </button>
      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
    </>
  );
}

const TITLE = "Senior Pet Mobility: 28-Day Joint Exercise Plan | Steady Paws";
const DESC =
  "A gentle 10-minute-a-day home exercise plan for older dogs and cats. Interactive 16-page PDF, no equipment needed. €14, 30-day money-back guarantee.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Index,
});

const PRICE = "€14";
const buyBtn = "btn-amber";

function BuyButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <BuyTrigger className={`${buyBtn} ${className}`}>{children}</BuyTrigger>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2">
      <PawPrint className="h-6 w-6 text-amber" fill="currentColor" />
      <span className={`font-serif text-xl font-semibold ${light ? "text-cream" : "text-ink"}`}>
        Steady Paws
      </span>
    </a>
  );
}

const trust = [
  { icon: Download, label: "Instant download" },
  { icon: PawPrint, label: "Dogs & cats" },
  { icon: Heart, label: "30-day money-back guarantee" },
  { icon: Lock, label: "Secure checkout" },
];

function TrustRow() {
  return (
    <ul className="grid grid-cols-2 gap-3 text-sm text-cream/85 sm:flex sm:flex-wrap sm:gap-6">
      {trust.map(({ icon: I, label }) => (
        <li key={label} className="flex items-center gap-2">
          <I className="h-4 w-4 shrink-0 text-amber" /> {label}
        </li>
      ))}
    </ul>
  );
}

function Section({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-20 px-5 py-20 sm:py-24 ${className}`}>
      <div className="reveal mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`text-3xl font-semibold leading-tight sm:text-4xl ${className}`}>{children}</h2>;
}

const insideList = [
  "8 step-by-step dog exercises",
  "3 play-based cat exercises",
  "The 10-minute daily routine",
  "4-week plan that builds week by week",
  "Day 1 and Day 28 mobility score",
  "Tick-off 28-day tracker",
  "Traffic-light safety guide",
  "10-minute home upgrade checklist",
  "Questions to ask your vet",
  "Certificate of completion",
];

const faqs = [
  ["Is it suitable for my pet?", "Most older dogs and cats, with options to make every exercise easier. Check with your vet first if your pet has a diagnosed condition, is in pain, or has had recent surgery."],
  ["Do I need any equipment?", "No. A non-slip mat or rug, a firm cushion, a broom handle and treats."],
  ["How long does it take?", "About 10 minutes a day, split into two sessions if you like."],
  ["Does it work for cats?", "Yes. There's a dedicated cat section using play instead of reps."],
  ["How do I get it?", "Straight after payment you'll get a download link on screen and by email."],
  ["Can I fill it in on my phone?", "Yes, open it in the free Adobe Acrobat Reader app to type and tick. You can also print it."],
  ["Is this veterinary advice?", "No. It's an educational guide and doesn't replace your vet."],
  ["What if it's not for me?", "Email within 30 days for a full refund."],
];

type Testimonial = { quote: string; name: string; pet: string; photo?: string };
// Add real reviews here. The section stays hidden while this list is empty.
const testimonials: Testimonial[] = [];

function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Section>
      <H2 className="text-center">From owners like you</H2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.name + t.pet} className="rounded-2xl bg-card p-6 shadow-soft">
            <blockquote className="text-ink/85">“{t.quote}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-3 text-sm">
              {t.photo && <img src={t.photo} alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />}
              <span><strong>{t.name}</strong> · {t.pet}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function Index() {
  return (
    <CheckoutProvider>
      <PaymentTestModeBanner />
      <Landing />
      <CookieBanner />
    </CheckoutProvider>
  );
}

let viewContentSent = false;

function Landing() {
  const [showBar, setShowBar] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    let pastHero = false, buyVisible = false;
    const update = () => setShowBar(pastHero && !buyVisible);
    const hero = document.getElementById("top");
    const buy = document.getElementById("buy");
    const io2 = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === buy) {
          buyVisible = e.isIntersecting;
          if (e.isIntersecting && !viewContentSent) {
            viewContentSent = true;
            track("ViewContent", { content_name: "Senior Pet Mobility 28-Day Plan", value: 14, currency: "EUR" });
          }
        }
      });
      update();
    });
    hero && io2.observe(hero);
    buy && io2.observe(buy);
    return () => { io.disconnect(); io2.disconnect(); };
  }, []);

  return (
    <div className="bg-cream text-ink">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#inside" className="hover:text-forest">What's inside</a>
            <a href="#how" className="hover:text-forest">How it works</a>
            <a href="#faq" className="hover:text-forest">FAQ</a>
          </nav>
          <BuyTrigger className="btn-amber btn-sm">Get the guide – {PRICE}</BuyTrigger>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="overflow-hidden bg-forest-deep px-5 pb-20 pt-14 text-cream sm:pt-20">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="inline-block rounded-full bg-amber/15 px-4 py-1.5 text-xs font-medium tracking-wide text-amber">
              For senior dogs & cats · No equipment
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
              Help your older pet move more easily, in 10 minutes a day.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/80">
              A gentle 28-day home exercise plan built on the same simple moves vet rehab teams teach owners. All you need is a cushion, a broom handle and a few treats.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              <BuyButton className="text-lg">Get the 28-day plan – {PRICE}</BuyButton>
              <a href="#quiz" className="text-sm font-medium text-cream underline decoration-amber underline-offset-4">
                Not sure? Take the 30-second check
              </a>
            </div>
            <div className="mt-10"><TrustRow /></div>
          </div>
          <div className="flex justify-center">
            <div className="w-64 rotate-3 rounded-[2rem] bg-ink p-3 shadow-[0_40px_80px_-20px_oklch(0_0_0/0.6)] sm:w-80 lg:-rotate-0 lg:rotate-[4deg]">
              <img src={cover} width={768} height={1024} alt="Senior Pet Mobility guide cover" className="rounded-[1.4rem]" />
            </div>
          </div>
        </div>
      </section>

      {/* Little things */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <H2>You've noticed the little things.</H2>
          <p className="mt-5 text-lg text-ink/75">
            The pause at the bottom of the stairs. The second attempt at the sofa. The slower stand-up after a nap. Pets rarely complain. They quietly adapt.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
          {[
            [TrendingUp, "Hesitates at stairs or the sofa"],
            [Moon, "Slow to get up after resting"],
            [Footprints, "Back legs slip on smooth floors"],
            [Timer, "Shorter, slower walks"],
            [Gamepad2, "Less interest in play"],
            [Cat, "Cats: avoids high spots"],
          ].map(([I, t]) => {
            const Icon = I as typeof TrendingUp;
            return (
              <div key={t as string} className="rounded-2xl bg-card p-5 shadow-soft">
                <Icon className="h-7 w-7 text-forest" strokeWidth={1.5} />
                <p className="mt-3 text-sm font-medium sm:text-base">{t as string}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <p className="font-serif text-xl">Recognise two or more? This guide was written for you.</p>
          <BuyButton className="mt-6">Get the 28-day plan – {PRICE}</BuyButton>
        </div>
      </Section>

      {/* Why */}
      <Section className="pt-0 sm:pt-0">
        <H2 className="text-center">Why gentle exercise works</H2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [Dumbbell, "Muscle is joint armour", "Strong muscles hold joints steady and take load off sore cartilage."],
            [Droplets, "Motion is lotion", "Gentle movement keeps joints flexible and joint fluid circulating."],
            [RefreshCw, "Break the stiff loop", "Sore pets move less, lose muscle, then hurt more. Little and often breaks the cycle."],
          ].map(([I, t, d]) => {
            const Icon = I as typeof Dumbbell;
            return (
              <div key={t as string} className="rounded-2xl bg-sage p-7">
                <Icon className="h-8 w-8 text-forest" strokeWidth={1.5} />
                <h3 className="mt-4 text-xl font-semibold">{t as string}</h3>
                <p className="mt-2 text-ink/75">{d as string}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Inside */}
      <Section id="inside" className="bg-card">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <H2>What's inside</H2>
            <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6">
              {[cover, page1, page2, page3].map((src, i) => (
                <div key={i} className="w-56 shrink-0 snap-center rounded-2xl bg-card p-2 shadow-soft ring-1 ring-ink/5 sm:w-64">
                  <img src={src} width={768} height={1024} loading="lazy" alt={`Guide page ${i + 1}`} className="rounded-xl" />
                </div>
              ))}
            </div>
            <p className="text-xs text-ink/50">Swipe to see more pages →</p>
          </div>
          <div>
            <ul className="space-y-3">
              {insideList.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber/20">
                    <Check className="h-4 w-4 text-amber" strokeWidth={3} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-sage p-4 text-sm text-ink/75">
              Interactive PDF: type and tick right on your phone, tablet or computer. Or print it.
            </p>
          </div>
        </div>
      </Section>

      {/* How */}
      <Section id="how">
        <H2 className="text-center">How it works</H2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            ["Check the safety lights", "Two minutes so every session is a good one."],
            ["Score your pet on Day 1", "A 60-second mobility score you redo on Day 28."],
            ["10 minutes a day", "Follow the routine and tick the tracker."],
          ].map(([t, d], i) => (
            <div key={t} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest font-serif text-2xl text-cream">{i + 1}</div>
              <h3 className="mt-5 text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-ink/70">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Free exercise */}
      <Section className="bg-sage">
        <H2 className="text-center">Try one exercise free, right now</H2>
        <article className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl bg-card shadow-soft">
          <div className="p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">Exercise 1 · Dogs</p>
            <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">Sit-to-Stand — the everyday super-move</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {["2 min", "5 reps, building to 10", "Safe for most seniors"].map((c) => (
                <span key={c} className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-forest">{c}</span>
              ))}
            </div>
            <ol className="mt-7 space-y-4">
              {[
                "Back your pet's rear into a corner or against the sofa so they sit straight.",
                "Ask for a sit.",
                "Hold a treat at nose height just in front and lure them slowly up to standing.",
                "Ask for a sit again. That's one rep.",
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-cream">{i + 1}</span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="border-l-4 border-danger bg-danger/10 px-7 py-4 text-sm sm:px-10">
            <strong className="text-danger">Stop if: </strong>
            Sitting crooked or hauling up with the front legs: use the corner and do fewer reps.
          </div>
        </article>
        <div className="mt-10 text-center">
          <p className="font-serif text-xl">That's 1 of 11 exercises. Get the full plan.</p>
          <BuyButton className="mt-6">Get the 28-day plan – {PRICE}</BuyButton>
        </div>
      </Section>

      {/* Safety */}
      <Section>
        <H2 className="text-center">Safety comes first</H2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["bg-traffic-green", "Keep going", "Relaxed, happy, moving smoothly and keen for more."],
            ["bg-amber", "Ease off", "Slowing down, panting more or losing interest. Try the easier version."],
            ["bg-danger", "Stop and call your vet", "Limping, yelping, sudden pain or refusing to move."],
          ].map(([c, t, d]) => (
            <div key={t} className="rounded-2xl bg-card p-6 shadow-soft">
              <span className={`block h-4 w-4 rounded-full ${c}`} />
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-ink/70">{d}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-ink/70">
          Every exercise includes easier and harder versions and clear stop signs. Please check with your vet before starting, especially if your pet has a diagnosed condition.
        </p>
      </Section>

      {/* For you */}
      <Section className="pt-0 sm:pt-0">
        <H2 className="text-center">Is this for you?</H2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-sage p-7">
            <h3 className="text-xl font-semibold">Perfect if</h3>
            <ul className="mt-4 space-y-3">
              {["Your dog or cat is getting older and stiffer", "You want something simple you can do at home", "You have 10 minutes a day", "You want to see real progress"].map((t) => (
                <li key={t} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-forest" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-card p-7 shadow-soft">
            <h3 className="text-xl font-semibold">Not for</h3>
            <ul className="mt-4 space-y-3">
              {["Pets in sudden or severe pain (see your vet first)", "Pets recovering from surgery without vet sign-off", "Anyone looking for a cure for arthritis (this is support, not treatment)"].map((t) => (
                <li key={t} className="flex gap-3"><X className="h-5 w-5 shrink-0 text-ink/40" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <section id="buy" className="scroll-mt-20 bg-forest-deep px-5 py-20 sm:py-24">
        <div className="reveal mx-auto max-w-lg rounded-3xl bg-card p-8 text-center shadow-soft sm:p-10">
          <img src={cover} width={768} height={1024} loading="lazy" alt="" className="mx-auto w-28 -rotate-3 rounded-lg shadow-soft" />
          <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">The 28-Day Senior Mobility Plan</h2>
          <ul className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
            {["11 dog & cat exercises", "10-minute daily routine", "4-week plan + 28-day tracker", "Day 1 & Day 28 mobility score", "Traffic-light safety guide", "Home checklist, vet questions & certificate"].map((t) => (
              <li key={t} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-amber" strokeWidth={3} />{t}</li>
            ))}
          </ul>
          <p className="mt-8 font-serif text-6xl font-semibold">{PRICE}</p>
          <p className="mt-2 text-sm text-ink/60">One-time payment. Instant download. Yours to keep.</p>
          <PricingBuy />
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-sage p-4 text-left text-sm">
            <ShieldCheck className="h-6 w-6 shrink-0 text-forest" />
            <p><strong>30-day money-back guarantee.</strong> If it doesn't help, email us and we'll refund you. No forms, no fuss.</p>
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-ink/55">
            <Lock className="h-3.5 w-3.5" /> Secure checkout ·
            <CreditCard className="h-4 w-4" /> Visa · Mastercard · Apple Pay · Google Pay
          </div>
        </div>
      </section>

      <Testimonials />

      {/* FAQ */}
      <Section id="faq">
        <H2 className="text-center">Questions, answered</H2>
        <div className="mx-auto mt-10 max-w-2xl divide-y divide-ink/10 rounded-2xl bg-card px-6 shadow-soft">
          {faqs.map(([q, a], i) => (
            <div key={q}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left font-medium" aria-expanded={openFaq === i}>
                {q}
                <ChevronDown className={`h-5 w-5 shrink-0 text-forest transition ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="pb-5 text-ink/70">{a}</p>}
            </div>
          ))}
        </div>
      </Section>

      <section id="quiz" className="scroll-mt-20 bg-sage px-5 py-20 sm:py-24">
        <PetQuiz />
      </section>

      {/* Final CTA */}
      <section className="bg-forest-deep px-5 py-20 text-center text-cream sm:py-24">
        <div className="reveal mx-auto max-w-3xl">
          <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">More good years together start with ten minutes today.</h2>
          <BuyButton className="mt-8 text-lg">Get the 28-day plan – {PRICE}</BuyButton>
          <div className="mt-10 flex justify-center"><TrustRow /></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cream/10 bg-forest-deep px-5 pb-28 pt-10 text-cream/70 md:pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Logo light />
          <a href="mailto:hello@steadypaws.com" className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4" />hello@steadypaws.com</a>
          <nav className="flex flex-wrap gap-5 text-sm">
            {["Terms", "Privacy", "Refund Policy", "Disclaimer"].map((l) => <a key={l} href="#" className="hover:text-cream">{l}</a>)}
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-xs text-cream/50">Educational content only. Not a substitute for advice from your vet.</p>
      </footer>

      {/* Mobile sticky bar */}
      <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-cream/95 px-5 py-3 backdrop-blur transition-transform md:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium"><strong className="font-serif text-lg">{PRICE}</strong> · 28-day plan</span>
          <BuyTrigger className="btn-amber btn-sm">Get it</BuyTrigger>
        </div>
      </div>
    </div>
  );
}
