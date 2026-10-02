import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { adminListOrders, adminResendEmail, adminResetDownloads } from "@/lib/orders.functions";
import { AdminVideos } from "@/components/AdminVideos";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Orders | Steady Paws admin" },
      { name: "description", content: "Private orders list." },
      { property: "og:title", content: "Steady Paws admin" },
      { property: "og:description", content: "Private orders list." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Admin,
});

type Order = {
  id: string; created_at: string; email: string | null; download_count: number;
  utm_source: string | null; utm_campaign: string | null; utm_content: string | null; environment: string; refunded: boolean;
};

function Admin() {
  const [pw, setPw] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const reset = async (id: string) => {
    const r = await adminResetDownloads({ data: { password: pw, orderId: id } }).catch(() => ({ ok: false, message: "Something went wrong." }));
    setNotes((n) => ({ ...n, [id]: r.message }));
    if (r.ok) setOrders((os) => os?.map((o) => (o.id === id ? { ...o, download_count: 0 } : o)) ?? null);
  };

  const resend = async (id: string) => {
    setSending(id);
    const r = await adminResendEmail({ data: { password: pw, orderId: id } }).catch(() => ({ ok: false, message: "Something went wrong." }));
    setSending(null);
    setNotes((n) => ({ ...n, [id]: r.message }));
  };

  const load = async (e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await adminListOrders({ data: { password: pw } }).catch(() => ({ ok: false as const, error: "Something went wrong." }));
    setBusy(false);
    if (res.ok) setOrders(res.orders as Order[]);
    else setErr(res.error);
  };

  return (
    <main className="min-h-screen bg-cream px-5 py-12 text-ink">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold">Orders</h1>
        {!orders ? (
          <form onSubmit={load} className="mt-6 flex max-w-md flex-col gap-3">
            <label htmlFor="pw" className="font-medium">Admin password</label>
            <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password"
              className="min-h-12 rounded-full border-2 border-ink/10 bg-card px-5 text-base outline-none focus:border-forest" />
            <button type="submit" disabled={busy || !pw} className="btn-amber">{busy ? "Checking…" : "Show orders"}</button>
            {err && <p role="alert" className="text-danger">{err}</p>}
          </form>
        ) : (
          <>
            <div className="mt-4 flex items-center gap-4">
              <p className="text-ink/70">{orders.length} orders</p>
              <button type="button" onClick={() => load()} className="btn-outline">Refresh</button>
            </div>
            <div className="mt-6 overflow-x-auto rounded-2xl bg-card shadow-soft">
              <table className="w-full text-left text-sm">
                <thead className="bg-sage">
                  <tr>{["Date", "Email", "Downloads", "UTM source", "Campaign", "Content", "Mode", "Email"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-ink/5">
                      <td className="whitespace-nowrap px-4 py-3">{new Date(o.created_at).toLocaleString("en-IE")}</td>
                      <td className="px-4 py-3">{o.email ?? "—"}{o.refunded && <span className="ml-2 rounded-full bg-danger/15 px-2 py-0.5 text-sm font-semibold text-danger">Refunded</span>}</td>
                      <td className="px-4 py-3">
                        <span>{o.download_count}/10</span>
                        {o.download_count > 0 && <button type="button" onClick={() => reset(o.id)} className="ml-2 underline">Reset downloads</button>}
                      </td>
                      <td className="px-4 py-3">{o.utm_source ?? "—"}</td>
                      <td className="px-4 py-3">{o.utm_campaign ?? "—"}</td>
                      <td className="px-4 py-3">{o.utm_content ?? "—"}</td>
                      <td className="px-4 py-3">{o.environment === "live" ? "Live" : "Test"}</td>
                      <td className="px-4 py-3">
                        <button type="button" disabled={!o.email || sending === o.id} onClick={() => resend(o.id)} className="btn-outline whitespace-nowrap">
                          {sending === o.id ? "Sending…" : "Resend download email"}
                        </button>
                        {notes[o.id] && <p role="status" className="mt-1 text-sm text-ink/70">{notes[o.id]}</p>}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-ink/60">No orders yet.</td></tr>}
                </tbody>
              </table>
            </div>
            <AdminVideos password={pw} />
          </>
        )}
      </div>
    </main>
  );
}
