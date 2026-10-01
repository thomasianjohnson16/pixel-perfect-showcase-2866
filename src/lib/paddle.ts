import { resolvePaddlePrice } from "@/lib/orders.functions";
import { getUtm } from "@/lib/utm";
import { track } from "@/lib/pixel";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;
export const PRICE_ID = "senior_pet_mobility_onetime";

declare global {
  interface Window {
    Paddle: any;
  }
}

export function getPaddleEnvironment(): "sandbox" | "live" {
  return clientToken?.startsWith("test_") ? "sandbox" : "live";
}

let ready: Promise<void> | null = null;

export function initializePaddle() {
  if (ready) return ready;
  if (!clientToken) return Promise.reject(new Error("Payments are not configured"));
  ready = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      window.Paddle.Environment.set(getPaddleEnvironment() === "sandbox" ? "sandbox" : "production");
      window.Paddle.Initialize({
        token: clientToken,
        eventCallback: (e: { name?: string; data?: { transaction_id?: string } }) => {
          if (e.name === "checkout.completed" && e.data?.transaction_id) {
            setTimeout(() => {
              window.Paddle.Checkout.close();
              window.location.href = `/thank-you?txn=${encodeURIComponent(e.data!.transaction_id!)}`;
            }, 800);
          }
        },
      });
      resolve();
    };
    script.onerror = () => { ready = null; reject(new Error("Could not load checkout")); };
    document.head.appendChild(script);
  });
  return ready;
}

export async function openCheckout() {
  track("InitiateCheckout", { value: 14, currency: "EUR" });
  await initializePaddle();
  const priceId = await resolvePaddlePrice({ data: { priceId: PRICE_ID, environment: getPaddleEnvironment() } });
  const utm = getUtm();
  const customData: Record<string, string> = { consent: "true" };
  for (const [k, v] of Object.entries(utm)) if (v) customData[k] = v;
  window.Paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customData,
    settings: {
      displayMode: "overlay",
      successUrl: `${window.location.origin}/thank-you`,
      allowLogout: false,
      variant: "one-page",
    },
  });
}
