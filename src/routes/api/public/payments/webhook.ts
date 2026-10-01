import { createFileRoute } from "@tanstack/react-router";
import { verifyWebhook, EventName, type PaddleEnv } from "@/lib/paddle.server";
import { saveOrder } from "@/lib/orders.server";

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const env = (new URL(request.url).searchParams.get("env") === "live" ? "live" : "sandbox") as PaddleEnv;
        try {
          const event = await verifyWebhook(request, env);
          if (event.eventType === EventName.TransactionCompleted) {
            const d = event.data as { id: string; customerId?: string | null; customData?: Record<string, string> | null };
            await saveOrder(env, d.id, d.customerId, d.customData);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
