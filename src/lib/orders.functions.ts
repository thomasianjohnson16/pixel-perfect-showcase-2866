import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const envSchema = z.enum(["sandbox", "live"]);

/** Checks the admin password (server-side only). */
async function checkAdmin(password: string): Promise<string | null> {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) return "Admin password not set up yet.";
  const { timingSafeEqual, createHash } = await import("crypto");
  const h = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(h(password), h(expected)) ? null : "Wrong password.";
}

export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ priceId: z.string().max(100), environment: envSchema }).parse(d))
  .handler(async ({ data }) => {
    const { gatewayFetch } = await import("./paddle.server");
    const res = await gatewayFetch(data.environment, `/prices?external_id=${encodeURIComponent(data.priceId)}`);
    const json = (await res.json()) as { data?: { id: string }[] };
    if (!json.data?.length) throw new Error("Price not found");
    return json.data[0]!.id;
  });

export const getOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ txn: z.string().regex(/^txn_[a-z0-9]+$/i).max(80), environment: envSchema }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders").select("id").eq("paddle_transaction_id", data.txn).maybeSingle();
    if (order) return { paid: true as const };
    const { confirmWithProvider } = await import("./orders.server");
    const paid = await confirmWithProvider(data.environment, data.txn).catch(() => false);
    return { paid };
  });

export const requestNewLink = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ email: z.string().trim().email().max(255) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendDownloadEmail } = await import("./orders.server");
    const { data: order } = await supabaseAdmin
      .from("orders").select("paddle_transaction_id, email")
      .ilike("email", data.email).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (order?.email) await sendDownloadEmail(order.email, order.paddle_transaction_id);
    return { ok: true };
  });

export const adminResendEmail = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200), orderId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const denied = await checkAdmin(data.password);
    if (denied) return { ok: false as const, message: denied };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders").select("email, paddle_transaction_id").eq("id", data.orderId).maybeSingle();
    if (!order?.email) return { ok: false as const, message: "This order has no email address." };
    const { sendDownloadEmail } = await import("./orders.server");
    const r = await sendDownloadEmail(order.email, order.paddle_transaction_id).catch(() => ({ sent: false as const, reason: "failed" as const }));
    if (r.sent) return { ok: true as const, message: "Email sent." };
    return { ok: false as const, message: r.reason === "email_not_set_up" ? "Not sent: email domain not set up yet." : "Sending failed — try again." };
  });

export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const denied = await checkAdmin(data.password);
    if (denied) return { ok: false as const, error: denied };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, paddle_transaction_id, created_at, email, download_count, utm_source, utm_campaign, utm_content, environment, consent_ticked")
      .order("created_at", { ascending: false }).limit(500);
    if (error) return { ok: false as const, error: "Could not load orders." };
    const { fetchRefundedTxns } = await import("./orders.server");
    const list = orders ?? [];
    const refunded = new Set<string>();
    for (const env of ["sandbox", "live"] as const) {
      const ids = list.filter((o) => o.environment === env).map((o) => o.paddle_transaction_id);
      if (ids.length) (await fetchRefundedTxns(env, ids)).forEach((t) => refunded.add(t));
    }
    return {
      ok: true as const,
      orders: list.map(({ paddle_transaction_id, ...o }) => ({ ...o, refunded: refunded.has(paddle_transaction_id) })),
    };
  });

export const adminResetDownloads = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200), orderId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const denied = await checkAdmin(data.password);
    if (denied) return { ok: false as const, message: denied };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").update({ download_count: 0 }).eq("id", data.orderId);
    return error ? { ok: false as const, message: "Could not reset." } : { ok: true as const, message: "Downloads reset." };
  });

const videoName = z.string().trim().min(1).max(200)
  .regex(/^[^/\\]+\.mp4$/i, "Only .mp4 files are allowed.");

export const adminListVideos = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const denied = await checkAdmin(data.password);
    if (denied) return { ok: false as const, error: denied };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: files, error } = await supabaseAdmin.storage.from("videos")
      .list("", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
    if (error) return { ok: false as const, error: "Could not load videos." };
    return {
      ok: true as const,
      videos: (files ?? []).filter((f) => f.id).map((f) => ({
        name: f.name,
        size: (f.metadata as { size?: number } | null)?.size ?? 0,
        created_at: f.created_at,
        url: supabaseAdmin.storage.from("videos").getPublicUrl(f.name).data.publicUrl,
      })),
    };
  });

export const adminCreateVideoUpload = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200), name: videoName }).parse(d))
  .handler(async ({ data }) => {
    const denied = await checkAdmin(data.password);
    if (denied) return { ok: false as const, message: denied };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: s, error } = await supabaseAdmin.storage.from("videos")
      .createSignedUploadUrl(data.name, { upsert: true });
    if (error || !s) return { ok: false as const, message: "Could not start upload." };
    return { ok: true as const, path: s.path, token: s.token };
  });
