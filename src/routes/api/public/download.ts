import { createFileRoute } from "@tanstack/react-router";

// Hands out a fresh 24-hour private link for a paid order and counts the download.
export const Route = createFileRoute("/api/public/download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const txn = new URL(request.url).searchParams.get("txn") ?? "";
        if (!/^txn_[a-z0-9]{10,80}$/i.test(txn)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { createSignedDownloadUrl, DOWNLOAD_LIMIT } = await import("@/lib/orders.server");
        const { data: order } = await supabaseAdmin
          .from("orders").select("id, download_count").eq("paddle_transaction_id", txn).maybeSingle();
        if (!order) return new Response("Order not found", { status: 404 });
        if (order.download_count >= DOWNLOAD_LIMIT) {
          const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Download limit reached</title><body style="font-family:system-ui;background:#FBF6EE;color:#1F2A24;padding:3rem 1.25rem;max-width:34rem;margin:auto;line-height:1.6"><h1 style="font-family:Georgia,serif">You've reached the download limit</h1><p>This link has been used ${DOWNLOAD_LIMIT} times. Just email us at <a href="mailto:hello@steadypaws.com">hello@steadypaws.com</a> and we'll unlock it for you straight away.</p></body>`;
          return new Response(html, { status: 403, headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
        }
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
