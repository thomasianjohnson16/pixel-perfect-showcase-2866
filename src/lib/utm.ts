const KEY = "sp_utm";
const FIELDS = ["utm_source", "utm_campaign", "utm_content"] as const;
export type Utm = Partial<Record<(typeof FIELDS)[number], string>>;

/** Call once on page load: remembers the UTM tags from the landing URL for this visit. */
export function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Utm = {};
    for (const f of FIELDS) {
      const v = params.get(f);
      if (v) found[f] = v.slice(0, 200);
    }
    if (Object.keys(found).length) localStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* storage unavailable */
  }
}

export function getUtm(): Utm {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Utm;
  } catch {
    return {};
  }
}
