import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, legalHead, SELLER, BRAND, CONTACT_EMAIL } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => legalHead("Terms & Conditions", "The terms for buying and using the Steady Paws Senior Pet Mobility guide.", "/terms"),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Terms & Conditions">
      <h2>1. Who you're buying from</h2>
      <p>
        {BRAND} is a trading name of {SELLER} ("we", "us"). When you buy the guide, you are entering into an agreement with {SELLER}. You can reach us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2>2. Accepting these terms</h2>
      <p>By using this website or buying our guide, you agree to these terms. If you don't agree, please don't use the site. If you buy as an individual, you confirm you are at least 18 years old.</p>

      <h2>3. The product</h2>
      <p>"Senior Pet Mobility: Exercises for Joint Health (28-Day Plan)" is a digital PDF guide with gentle home exercises, a 28-day tracker and a safety guide for older dogs and cats. It is delivered as a download straight after payment. It is general educational information, not veterinary advice. Please read our <Link to="/disclaimer">Disclaimer</Link>.</p>

      <h2>4. Orders, payment and our reseller</h2>
      <p>
        Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
      </p>
      <p>
        Payment, billing, taxes (including VAT), cancellations and refunds are governed by <a href="https://www.paddle.com/legal/checkout-buyer-terms" target="_blank" rel="noopener noreferrer">Paddle's Buyer Terms</a>. The guide is a one-off purchase. There is no subscription and nothing renews.
      </p>

      <h2>5. Your right of withdrawal and our guarantee</h2>
      <p>At checkout you agree that the download starts straight away and that your 14-day right of withdrawal ends once the download begins. Separately, we offer a 30-day money-back guarantee. See our <Link to="/refund-policy">Refund Policy</Link>.</p>

      <h2>6. Your licence</h2>
      <p>We give you a personal, non-exclusive, non-transferable licence to download and use the guide for your own pets. You may print it for personal use. You may not resell, share, upload, redistribute or publish the guide or any part of it.</p>

      <h2>7. Fair use of the site</h2>
      <p>You must not:</p>
      <ul>
        <li>use the site for anything unlawful, fraudulent or for sending spam;</li>
        <li>copy or infringe our intellectual property or anyone else's;</li>
        <li>try to break, probe or overload the site, introduce malware, or scrape content or download links.</li>
      </ul>

      <h2>8. Intellectual property</h2>
      <p>The guide, the website, its text, images, design and the {BRAND} name belong to {SELLER}. Buying the guide does not transfer any ownership.</p>

      <h2>9. Availability</h2>
      <p>We work hard to keep the site and downloads available, but we can't guarantee they will always be uninterrupted or error-free.</p>

      <h2>10. Suspending access</h2>
      <p>We may suspend or end your access to downloads if you seriously or repeatedly break these terms, don't pay, or if there is a security or fraud risk (for example, a download link being shared publicly).</p>

      <h2>11. Liability</h2>
      <p>
        To the fullest extent the law allows, the guide is provided "as is" without implied warranties. We are not liable for indirect or consequential losses. Our total liability to you is limited to the amount you paid for the guide. Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or any other liability that cannot be limited by law. It also does not affect your statutory rights as a consumer.
      </p>

      <h2>12. Changes</h2>
      <p>We may update these terms from time to time. The version on this page when you buy applies to your purchase.</p>

      <h2>13. Governing law</h2>
      <p>These terms are governed by the laws of Ireland. If you are a consumer, you also keep the protection of the mandatory laws of the country where you live, and you may bring claims in your local courts.</p>
    </LegalPage>
  );
}
