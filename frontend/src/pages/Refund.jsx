import LegalPage from "./Legal";
import usePageMeta from "@/hooks/usePageMeta";

export default function Refund() {
  usePageMeta({
    title: "Refund / Cancellation Policy — Chiransh Foods",
    description:
      "How order changes, cancellations and refunds are handled at Chiransh Foods.",
  });

  return (
    <LegalPage
      testId="refund-cancellation-policy"
      eyebrow="Legal"
      title={
        <>
          Refund / <em className="italic text-gold">Cancellation</em> Policy
        </>
      }
      intro="Ordering at Chiransh Foods is currently arranged by direct contact, so this policy is intentionally simple."
      sections={[
        {
          h: "Changing or cancelling an order",
          p: [
            "Need to change or cancel an order you've enquired about? Contact us as soon as possible — ideally before we begin preparing your food — and we will do our best to accommodate you.",
          ],
        },
        {
          h: "Payments & refunds",
          p: [
            "No online payments are taken on this website. If a payment has been arranged with us directly and an order is cancelled or unavailable, any amount due back to you will be refunded in full through the same arrangement.",
          ],
        },
        {
          h: "When online ordering launches",
          p: [
            "Once online checkout and payments become available on this website, this page will be updated with the matching cancellation and refund terms before those features go live.",
          ],
        },
      ]}
    />
  );
}
