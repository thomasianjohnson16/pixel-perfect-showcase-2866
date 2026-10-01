// Meta Pixel — loads only after the visitor accepts marketing cookies.
// Replace with the real Pixel ID. While it's empty, nothing is loaded or sent.
export const META_PIXEL_ID = "";

const CONSENT_KEY = "sp_cookie_consent"; // "accepted" | "rejected"

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

export type ConsentChoice = "accepted" | "rejected" | null;

export function getConsent(): ConsentChoice {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: "accepted" | "rejected") {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
    localStorage.setItem(CONSENT_KEY + "_at", new Date().toISOString());
  } catch {
    /* ignore */
  }
  if (choice === "accepted") loadPixel();
  else window.fbq?.("consent", "revoke");
}

let loaded = false;
export function loadPixel() {
  if (loaded || !META_PIXEL_ID || getConsent() !== "accepted" || typeof window === "undefined") return;
  loaded = true;
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod(...args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true; t.src = v;
    b.head.appendChild(t);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("consent", "grant");
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
}

export function track(event: string, params?: Record<string, unknown>, eventId?: string) {
  if (!loaded || getConsent() !== "accepted" || !window.fbq) return;
  window.fbq("track", event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}
