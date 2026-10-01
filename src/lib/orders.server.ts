import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { gatewayFetch, type PaddleEnv } from "./paddle.server";

export const PDF_PATH = "senior-pet-mobility.pdf";
const LINK_TTL = 60 * 60 * 24;

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
  const { data: existing } = await supabaseAdmin
    .from("orders").select("id").eq("paddle_transaction_id", txnId).maybeSingle();
  if (existing) return false;
  const email = await fetchCustomerEmail(env, customerId);
  const clip = (v?: string) => (v ? String(v).slice(0, 200) : null);
  const { error } = await supabaseAdmin.from("orders").upsert(
    {
      paddle_transaction_id: txnId,
      email,
      consent_ticked: meta?.consent === "true",
      environment: env,
      utm_source: clip(meta?.utm_source),
      utm_campaign: clip(meta?.utm_campaign),
      utm_content: clip(meta?.utm_content),
    },
    { onConflict: "paddle_transaction_id", ignoreDuplicates: true },
  );
  if (error) throw error;
  if (email) await sendDownloadEmail(email, txnId);
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

/**
 * Sends the download email. Email sending is not connected yet (needs an email
 * domain), so for now this only logs. Wire the real sender in here.
 */
export async function sendDownloadEmail(email: string, txnId: string) {
  console.log("[email] download email pending email setup", { to: email.replace(/(.).+@/, "$1***@"), txnId });
}
