import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Lock, X } from "lucide-react";
import { openCheckout, getPaddleEnvironment } from "@/lib/paddle";

export const CONSENT_TEXT =
  "I want instant access to the download and understand that my 14-day withdrawal right ends once the download starts. My 30-day money-back guarantee still applies.";

type Ctx = { consent: boolean; setConsent: (v: boolean) => void; buy: () => void; busy: boolean; error: string | null };
// Keep one context object across hot reloads; otherwise a reload of this file
// creates a new context and existing buttons can't find the provider.
const g = globalThis as unknown as { __spCheckoutCtx?: React.Context<Ctx | null> };
const CheckoutCtx = (g.__spCheckoutCtx ??= createContext<Ctx | null>(null));

// Safe fallback so the page never goes blank: buttons just jump to the price box.
const fallback: Ctx = {
  consent: false,
  setConsent: () => {},
  buy: () => document.getElementById("buy")?.scrollIntoView({ behavior: "smooth" }),
  busy: false,
  error: null,
};

export function useCheckout() {
  const c = useContext(CheckoutCtx);
  if (!c) console.warn("useCheckout used outside CheckoutProvider");
  return c ?? fallback;
}

export function ConsentBox({ id }: { id: string }) {
  const { consent, setConsent } = useCheckout();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-ink/10 bg-card p-4 text-left text-base leading-relaxed has-[:checked]:border-forest">
      <input
        id={id}
        type="checkbox"
        required
        checked={consent}
        onChange={(e) => setConsent(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 accent-forest"
      />
      <span>{CONSENT_TEXT}</span>
    </label>
  );
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      await openCheckout();
      setOpen(false);
    } catch (e) {
      console.error(e);
      setError("Checkout couldn't open. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  const buy = () => (consent ? void start() : setOpen(true));

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <CheckoutCtx.Provider value={{ consent, setConsent, buy, busy, error }}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        className="m-auto w-[min(92vw,28rem)] rounded-3xl bg-cream p-0 text-ink shadow-soft backdrop:bg-ink/60"
        aria-labelledby="checkout-title"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="checkout-title" className="text-2xl font-semibold">One quick step</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-sage">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-1 text-ink/70">The 28-Day Senior Mobility Plan · €14</p>
          <div className="mt-5"><ConsentBox id="consent-modal" /></div>
          <button type="button" disabled={!consent || busy} onClick={start} className="btn-amber mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50">
            {busy ? "Opening secure checkout…" : "Continue to secure checkout"}
          </button>
          {error && <p role="alert" className="mt-3 text-base text-danger">{error}</p>}
          <p className="mt-4 flex items-center justify-center gap-2 text-base text-ink/70"><Lock className="h-4 w-4" aria-hidden /> Secure checkout · 30-day money-back guarantee</p>
        </div>
      </dialog>
    </CheckoutCtx.Provider>
  );
}

export function PaymentTestModeBanner() {
  if (getPaddleEnvironment() !== "sandbox") return null;
  return (
    <div className="w-full bg-amber/25 px-4 py-2 text-center text-base text-ink">
      Test mode: payments in the preview aren't real. Use card 4242 4242 4242 4242.
    </div>
  );
}
