import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead, SELLER, BRAND, CONTACT_EMAIL } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => legalHead("Privacy Notice", "How Steady Paws collects, uses and protects your personal data.", "/privacy"),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Privacy Notice">
      <h2>Who we are</h2>
      <p>{BRAND} is a trading name of {SELLER}. {SELLER} is the data controller for personal data collected through this website. That means we decide how and why it is used. Contact: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>

      <h2>What we collect and why</h2>
      <ul>
        <li><strong>Order details</strong> (your email address, order number, date, whether you ticked the instant-access box, download count). We use these to deliver your guide, resend lost links, handle refunds and keep business records. Legal basis: performing our contract with you, and legal obligations (tax and accounting).</li>
        <li><strong>Campaign source</strong> (the "utm" tags in the link you arrived from, e.g. which Instagram post). We use this to understand which posts lead to sales. Legal basis: our legitimate interest in measuring our marketing.</li>
        <li><strong>Messages you send us</strong> (e.g. support emails). We use these to reply and help you. Legal basis: legitimate interest / contract.</li>
        <li><strong>Technical data</strong> (IP address, browser and device information in server logs). We use this to keep the site secure and working. Legal basis: legitimate interest.</li>
        <li><strong>Quiz answers and your pet's name</strong> stay in your own browser only. We do not receive or store them.</li>
      </ul>
      <p>Card and payment details are collected by Paddle, not by us. We never see your full card details.</p>

      <h2>Cookies</h2>
      <ul>
        <li><strong>Essential:</strong> small items saved in your browser that make the site work (e.g. remembering your cookie choice and the campaign link you came from).</li>
        <li><strong>Marketing (only with your consent):</strong> Meta Pixel, which helps us see whether our Facebook/Instagram posts lead to visits and purchases. It only loads if you click "Accept" on the cookie banner.</li>
      </ul>
      <p>You can change your choice at any time with "Cookie settings" at the bottom of the home page.</p>

      <h2>Who we share data with</h2>
      <ul>
        <li><strong>Paddle.com</strong>, our Merchant of Record, for selling the product, payments, tax compliance and invoicing. Paddle has its own <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer">privacy notice</a>.</li>
        <li><strong>Service providers</strong> who host the website, database and file storage, and who send email for us.</li>
        <li><strong>Meta Platforms</strong>, only if you accept marketing cookies.</li>
        <li><strong>Professional advisers</strong> (e.g. accountants, lawyers), where needed.</li>
        <li><strong>Authorities</strong>, where the law requires it.</li>
      </ul>
      <p>We never sell your personal data.</p>

      <h2>International transfers</h2>
      <p>Some of our providers may process data outside the UK/EEA (for example in the United States). Where this happens, we rely on adequacy decisions or the EU Standard Contractual Clauses to protect your data.</p>

      <h2>How long we keep it</h2>
      <p>We keep order records for as long as tax and accounting law requires (generally up to 6 years), then delete or anonymise them. Support emails are kept for up to 2 years. Marketing cookie data is kept according to your cookie choice and Meta's own retention.</p>

      <h2>Your rights</h2>
      <p>Under the GDPR you have the right to access your data, correct it, have it deleted, restrict or object to its use, receive it in a portable format, and withdraw consent at any time (this doesn't affect past processing). Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will reply within one month. You can also complain to your local data protection authority. In Ireland, that's the <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">Data Protection Commission</a>.</p>

      <h2>Security</h2>
      <p>We use appropriate technical and organisational measures to protect your data, including encrypted connections, private file storage, time-limited download links and restricted access to order records.</p>

      <h2>Changes</h2>
      <p>We may update this notice. The latest version will always be on this page.</p>
    </LegalPage>
  );
}
