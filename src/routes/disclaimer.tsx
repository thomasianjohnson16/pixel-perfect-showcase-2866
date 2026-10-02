import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, legalHead } from "@/components/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => legalHead("Disclaimer", "The Steady Paws guide is general education, not veterinary advice.", "/disclaimer"),
  component: Disclaimer,
});

function Disclaimer() {
  return (
    <LegalPage title="Disclaimer">
      <p>The Senior Pet Mobility guide and this website give general educational information about gentle exercise for older dogs and cats. They are not veterinary advice, and they don't replace an examination by a qualified vet.</p>
      <p>The guide does not diagnose, treat, cure or reverse arthritis or any other condition. Every pet is different, and results vary.</p>
      <ul>
        <li>Check with your vet before starting any new exercise routine, especially if your pet has a diagnosed condition, has recently had surgery, or is on medication.</li>
        <li>Stop straight away and contact your vet if your pet shows pain, limping, crying out, sudden weakness, or a hot or swollen joint.</li>
        <li>Always follow the traffic-light safety guide in the plan.</li>
      </ul>
      <p>You use the exercises at your own judgement and responsibility, within the limits set out in our Terms &amp; Conditions.</p>
    </LegalPage>
  );
}
