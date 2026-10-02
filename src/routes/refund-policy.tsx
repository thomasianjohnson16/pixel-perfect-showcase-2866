import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead, CONTACT_EMAIL } from "@/components/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  head: () => legalHead("Refund Policy", "30-day money-back guarantee on the Steady Paws Senior Pet Mobility guide.", "/refund-policy"),
  component: Refund,
});

function Refund() {
  return (
    <LegalPage title="Refund Policy">
      <h2>30-day money-back guarantee</h2>
      <p>If the guide isn't right for you and your pet, you can ask for a full refund within 30 days of your order date. You don't need to give a reason.</p>

      <h2>How to ask for a refund</h2>
      <p>Refunds are handled by our payment provider and reseller, Paddle. To request one, either:</p>
      <ul>
        <li>visit <a href="https://paddle.net" target="_blank" rel="noopener noreferrer">paddle.net</a> and look up your order using the email address you bought with, or</li>
        <li>email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the email address you used, and we'll arrange it with Paddle.</li>
      </ul>
      <p>Refunds go back to your original payment method. Your bank may take a few days to show the money.</p>

      <h2>Your withdrawal right</h2>
      <p>Because the guide is a digital download, you agree at checkout that your 14-day right of withdrawal ends once the download starts. Our 30-day money-back guarantee above still applies in full.</p>

      <h2>More details</h2>
      <p>This policy works alongside <a href="https://www.paddle.com/legal/refund-policy" target="_blank" rel="noopener noreferrer">Paddle's Refund Policy</a> and <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer">Buyer Terms</a>. It does not affect your statutory rights.</p>
    </LegalPage>
  );
}
