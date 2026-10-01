import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { Download, Loader2, PawPrint, Instagram } from "lucide-react";
import { getOrderStatus, requestNewLink } from "@/lib/orders.functions";
import { getPaddleEnvironment } from "@/lib/paddle";
import { track } from "@/lib/pixel";
import { CookieBanner } from "@/components/CookieBanner";

export const Route = createFileRoute("/thank-you")({
  validateSearch: (s: Record<string, unknown>) => {
    // Our own redirect uses ?txn=; the payment provider's return link uses ?_ptxn=.
    const v = typeof s["txn"] === "string" ? s["txn"] : typeof s["_ptxn"] === "string" ? s["_ptxn"] : undefined;
    return { txn: v as string | undefined };
  },
  head: () => ({
    meta: [
      { title: "Thank you – your guide is ready | Steady Paws" },
      { name: "description", content: "Download your Senior Pet Mobility 28-day plan." },
      { property: "og:title", content: "Thank you | Steady Paws" },
      { property: "og:description", content: "Download your Senior Pet Mobility 28-day plan." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

const tips = [
  "Open it in the free Adobe Acrobat Reader app to type and tick on your phone.",
  "Start with page 4 (safety) and page 5 (your Day 1 score).",
  "Film your 20-second 'before' video today.",
];

function ThankYou() {
  const { txn } = Route.useSearch();
  const [petLabel, setPetLabel] = useState("your pet");

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("sp_pet") || "null") as { name?: string; pet?: string } | null;
      if (saved?.name) setPetLabel(saved.name);
      else if (saved?.pet) setPetLabel(`your ${saved.pet.toLowerCase()}`);
    } catch { /* ignore */ }
  }, []);

  const validTxn = txn && /^txn_[a-z0-9]+$/i.test(txn) ? txn : null;
  const { data } = useQuery({
    queryKey: ["order", validTxn],
    enabled: !!validTxn,
    queryFn: () => getOrderStatus({ data: { txn: validTxn!, environment: getPaddleEnvironment() } }),
    refetchInterval: (q) => (q.state.data?.paid ? false : 3000),
  });
  const paid = !!data?.paid;

  useEffect(() => {
    if (!paid || !validTxn) return;
    const key = `sp_purchase_${validTxn}`;
    try {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(key, "1");
    } catch { /* ignore */ }
    // eventID lets Meta de-duplicate if this ever fires twice for the same order.
    track("Purchase", { value: 14, currency: "EUR" }, validTxn);
  }, [paid, validTxn]);

  return (
    <main className="min-h-screen bg-cream text-ink">
      <section className="bg-forest-deep px-5 py-16 text-center text-cream sm:py-24">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="inline-flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-amber" fill="currentColor" aria-hidden />
            <span className="font-serif text-xl font-semibold">Steady Paws</span>
          </Link>
          <h1 className="mt-8 text-4xl font-semibold leading-tight sm:text-5xl">
            You're in. Let's get {petLabel} moving.
          </h1>
          <div className="mt-10">
            {!validTxn ? (
              <p className="text-lg text-cream/85">Your download link is on its way by email. You can also request a new one below.</p>
            ) : paid ? (
              <a href={`/api/public/download?txn=${encodeURIComponent(validTxn)}`} className="btn-amber px-10 py-5 text-xl">
                <Download className="h-6 w-6" aria-hidden /> Download your guide
              </a>
            ) : (
              <p className="inline-flex items-center gap-3 text-lg" role="status">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Confirming your payment…
              </p>
            )}
          </div>
          {paid && <p className="mt-4 text-base text-cream/75">Tap to download now — no need to wait for an email. This page link keeps working, so bookmark it.</p>}
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold">3 quick tips</h2>
          <ol className="mt-6 space-y-4">
            {tips.map((t, i) => (
              <li key={t} className="flex gap-4 rounded-2xl bg-card p-5 shadow-soft">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest font-semibold text-cream">{i + 1}</span>
                <span className="pt-1">{t}</span>
              </li>
            ))}
          </ol>

          <LostLink />

          <p className="mt-12 flex items-center justify-center gap-2 text-center text-ink/75">
            <Instagram className="h-5 w-5 text-forest" aria-hidden /> Tag us on Instagram with your Day 28 certificate photo.
          </p>
        </div>
      </section>
      <CookieBanner />
    </main>
  );
}

function LostLink() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = z.string().trim().email().max(255).safeParse(email);
    if (!parsed.success) return setErr("Please enter a valid email address.");
    setErr(null);
    setBusy(true);
    try { await requestNewLink({ data: { email: parsed.data } }); } catch { /* same message regardless */ }
    setBusy(false);
    setSent(true);
  };

  return (
    <div className="mt-12 rounded-2xl bg-sage p-6">
      <h2 className="text-xl font-semibold">Lost your link?</h2>
      <p className="mt-1 text-ink/75">Enter the email you used to buy and we'll send a fresh 24-hour link.</p>
      {sent ? (
        <p className="mt-4 font-medium" role="status">If we find your order, a new link is on its way.</p>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="lost-email" className="sr-only">Purchase email</label>
          <input id="lost-email" type="email" required maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" className="min-h-12 flex-1 rounded-full border-2 border-ink/10 bg-card px-5 text-base outline-none focus:border-forest" />
          <button type="submit" disabled={busy} className="btn-outline">{busy ? "Sending…" : "Send new link"}</button>
        </form>
      )}
      {err && <p role="alert" className="mt-2 text-base text-danger">{err}</p>}
    </div>
  );
}
