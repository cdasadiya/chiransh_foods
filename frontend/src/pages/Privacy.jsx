import LegalPage from "./Legal";
import usePageMeta from "@/hooks/usePageMeta";
import { getRouteSeo } from "@/lib/routeSeo";

export default function Privacy() {
  usePageMeta(getRouteSeo("/privacy"));

  return (
    <LegalPage
      testId="privacy-policy"
      eyebrow="Legal"
      title={
        <>
          Privacy <em className="italic text-gold">Policy</em>
        </>
      }
      intro="Chiransh Foods respects your privacy. This policy explains, in plain language, what we collect and what we do with it."
      sections={[
        {
          h: "What we collect",
          p: [
            "When you send an order enquiry through our website, we collect the details you choose to share: your name, phone number, email address (optional), product interest and message. We collect nothing else and do not use advertising cookies on this website.",
          ],
        },
        {
          h: "How we use it",
          p: [
            "Your enquiry details are used for one purpose only — to respond to your enquiry and arrange your order. We do not sell, rent or share your information with third parties for marketing.",
          ],
        },
        {
          h: "How it is stored",
          p: [
            "Enquiries are stored securely in our database and are accessible only to Chiransh Foods. We keep them only as long as needed to serve you.",
          ],
        },
        {
          h: "Your choices",
          p: [
            "You may ask us at any time to update or delete the details you have shared. Simply reach out through our Contact page and we will take care of it.",
          ],
        },
        {
          h: "Updates",
          p: [
            "If this policy changes, the updated version will be published on this page.",
          ],
        },
      ]}
    />
  );
}
