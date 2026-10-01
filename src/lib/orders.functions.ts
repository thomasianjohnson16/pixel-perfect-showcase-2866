import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const envSchema = z.enum(["sandbox", "live"]);

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

export const adminListOrders = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) return { ok: false as const, error: "Admin password not set up yet." };
    const { timingSafeEqual, createHash } = await import("crypto");
    const h = (s: string) => createHash("sha256").update(s).digest();
    if (!timingSafeEqual(h(data.password), h(expected))) return { ok: false as const, error: "Wrong password." };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, created_at, email, download_count, utm_source, utm_campaign, utm_content, environment, consent_ticked")
      .order("created_at", { ascending: false }).limit(500);
    if (error) return { ok: false as const, error: "Could not load orders." };
    return { ok: true as const, orders: orders ?? [] };
  });
