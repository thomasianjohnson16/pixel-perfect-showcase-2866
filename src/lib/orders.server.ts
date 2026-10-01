import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { gatewayFetch, type PaddleEnv } from "./paddle.server";

export const PDF_PATH = "SteadyPawSeniorPetGuide.pdf";
const LINK_TTL = 60 * 60 * 24;
export const DOWNLOAD_LIMIT = 10;

type OrderMeta = { consent?: string; utm_source?: string; utm_campaign?: string; utm_content?: string };

async function fetchCustomerEmail(env: PaddleEnv, customerId?: string | null) {
  if (!customerId) return null;
  try {
    const res = await gatewayFetch(env, `/customers/${encodeURIComponent(customerId)}`);
    const json = (await res.json()) as { data?: { email?: string } };
    return json.data?.email ?? null;
  } catch {
    return null;
  }
}

/** Saves the order once. Returns true if it was newly created. */
export async function saveOrder(
  env: PaddleEnv,
  txnId: string,
  customerId: string | null | undefined,
  meta: OrderMeta | null | undefined,
) {
  // Single insert: the unique transaction id guarantees only one caller wins,
  // so the webhook and the thank-you check can never both send the email.
  const email = await fetchCustomerEmail(env, customerId);
  const clip = (v?: string) => (v ? String(v).slice(0, 200) : null);
  const { error } = await supabaseAdmin.from("orders").insert({
    paddle_transaction_id: txnId,
    email,
    consent_ticked: meta?.consent === "true",
    environment: env,
    utm_source: clip(meta?.utm_source),
    utm_campaign: clip(meta?.utm_campaign),
    utm_content: clip(meta?.utm_content),
  });
  if (error) {
    if (error.code === "23505") return false; // already saved by the other path
    throw error;
  }
  if (email) await sendDownloadEmail(email, txnId).catch((e) => console.error("[email] failed", e));
  return true;
}

/** Asks the payment provider directly whether a transaction is paid (used while the webhook may still be on its way). */
export async function confirmWithProvider(env: PaddleEnv, txnId: string) {
  const res = await gatewayFetch(env, `/transactions/${encodeURIComponent(txnId)}`);
  if (!res.ok) return false;
  const json = (await res.json()) as {
    data?: { status?: string; customer_id?: string; custom_data?: OrderMeta };
  };
  const status = json.data?.status;
  if (status !== "completed" && status !== "paid") return false;
  await saveOrder(env, txnId, json.data?.customer_id, json.data?.custom_data);
  return true;
}

export async function createSignedDownloadUrl() {
  const { data, error } = await supabaseAdmin.storage.from("products").createSignedUrl(PDF_PATH, LINK_TTL, {
    download: "Senior-Pet-Mobility-28-Day-Plan.pdf",
  });
  if (error || !data) throw error ?? new Error("Could not sign URL");
  return data.signedUrl;
}

export function siteOrigin() {
  return process.env["PUBLIC_SITE_URL"] ?? "";
}

export type EmailResult = { sent: true } | { sent: false; reason: "email_not_set_up" | "failed" };

/**
 * Sends the download email. No email domain is connected yet, so this reports
 * "email_not_set_up". Wire the real sender in here once a domain is verified.
 */
export async function sendDownloadEmail(email: string, txnId: string): Promise<EmailResult> {
  console.warn("[email] NOT SENT: no email domain configured", { to: email.replace(/(.).+@/, "$1***@"), txnId });
  return { sent: false, reason: "email_not_set_up" };
}

/** Returns the set of transaction ids that have an approved refund. */
export async function fetchRefundedTxns(env: PaddleEnv, txnIds: string[]) {
  const refunded = new Set<string>();
  for (let i = 0; i < txnIds.length; i += 50) {
    const chunk = txnIds.slice(i, i + 50);
    try {
      const res = await gatewayFetch(env, `/adjustments?action=refund&transaction_id=${chunk.map(encodeURIComponent).join(",")}&per_page=200`);
      if (!res.ok) continue;
      const json = (await res.json()) as { data?: { transaction_id: string; status: string }[] };
      for (const a of json.data ?? []) if (a.status === "approved") refunded.add(a.transaction_id);
    } catch (e) {
      console.error("[refunds] lookup failed", e);
    }
  }
  return refunded;
}
