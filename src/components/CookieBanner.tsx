import { useEffect, useState } from "react";
import { getConsent, setConsent, loadPixel } from "@/lib/pixel";
import { captureUtm } from "@/lib/utm";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    captureUtm();
    const c = getConsent();
    if (c === "accepted") loadPixel();
    setShow(c === null);
    const reopen = () => setShow(true);
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  if (!show) return null;
  const choose = (c: "accepted" | "rejected") => { setConsent(c); setShow(false); };

  return (
    <div role="dialog" aria-label="Cookie choices" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl bg-card p-5 text-ink shadow-soft ring-1 ring-ink/10">
      <p className="text-base">
        We'd like to use marketing cookies (Meta Pixel) to see which posts help pet owners find us. Nothing is sent unless you say yes. You can change this any time under "Cookie settings" at the bottom of the page.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => choose("rejected")} className="btn-outline">No thanks</button>
        <button type="button" onClick={() => choose("accepted")} className="btn-outline">Accept</button>
      </div>
    </div>
  );
}
