import LegalPage from "./Legal";
import usePageMeta from "@/hooks/usePageMeta";

export default function Terms() {
  usePageMeta({
    title: "Terms & Conditions — Chiransh Foods",
    description:
      "The terms that apply when you use the Chiransh Foods website and place order enquiries with us.",
  });

  return (
    <LegalPage
      testId="terms-conditions"
      eyebrow="Legal"
      title={
        <>
          Terms & <em className="italic text-gold">Conditions</em>
        </>
      }
      intro="These terms apply to your use of the Chiransh Foods website and the order enquiries you send through it."
      sections={[
        {
          h: "The website",
          p: [
            "This website presents Chiransh Foods — a 100% vegetarian Gujarati food brand from Gujarat, India. Content on this site (text, images and branding) belongs to Chiransh Foods and may not be reproduced without permission.",
          ],
        },
        {
          h: "Menu information & prices",
          p: [
            "Dishes, availability and descriptions on this website are kept accurate and up to date. Where a price is not listed, current prices are shared on enquiry — please contact us before placing an order.",
          ],
        },
        {
          h: "Ordering",
          p: [
            "Ordering is currently arranged by direct contact — through the enquiry form on our Contact page. An order is confirmed only when we respond and confirm it with you. Online checkout, payments and delivery integrations are planned but not yet active.",
          ],
        },
        {
          h: "Liability",
          p: [
            "We prepare all food with care and hygiene, but this website is provided 'as is'. To the extent permitted by law, Chiransh Foods is not liable for indirect losses arising from the use of this website.",
          ],
        },
        {
          h: "Governing law",
          p: [
            "These terms are governed by the laws of India.",
          ],
        },
      ]}
    />
  );
}
