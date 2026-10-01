import { createFileRoute } from "@tanstack/react-router";

// Hands out a fresh 24-hour private link for a paid order and counts the download.
export const Route = createFileRoute("/api/public/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const txn = new URL(request.url).searchParams.get("txn") ?? "";
        if (!/^txn_[a-z0-9]{10,80}$/i.test(txn)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { createSignedDownloadUrl } = await import("@/lib/orders.server");
        const { data: order } = await supabaseAdmin
          .from("orders").select("id, download_count").eq("paddle_transaction_id", txn).maybeSingle();
        if (!order) return new Response("Order not found", { status: 404 });
        try {
          const url = await createSignedDownloadUrl();
          await supabaseAdmin.from("orders").update({ download_count: order.download_count + 1 }).eq("id", order.id);
          return new Response(null, { status: 302, headers: { Location: url, "Cache-Control": "no-store" } });
        } catch (e) {
          console.error("download error", e);
          return new Response("The guide isn't available yet. Please email us.", { status: 503 });
        }
      },
    },
  },
});
