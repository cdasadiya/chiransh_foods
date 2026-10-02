import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const FAQS = [
  {
    q: "Is Chiransh Foods fully vegetarian?",
    a: "Yes. Every dish Chiransh Foods makes is 100% vegetarian. We do not offer any non-vegetarian products — and we never will.",
  },
  {
    q: "What cuisine does Chiransh Foods specialise in?",
    a: "We specialise in Gujarati cuisine and Gujarati street food, with fast food and Indian categories planned as our menu grows.",
  },
  {
    q: "What is Baroda-style Sev Usal?",
    a: "Sev Usal is a popular street-food specialty associated with Vadodara (Baroda) — a hearty, slow-simmered spiced pea curry served steaming hot and crowned with crunchy sev, onion and a squeeze of lemon. It is one of our signature dishes.",
  },
  {
    q: "What is Tuvar Totha?",
    a: "Tuvar Totha is a much-loved Gujarati snack/curry-style street food made with tuvar (pigeon peas). Comforting, hearty and full of homestyle character, it is one of our signature dishes.",
  },
  {
    q: "Where do you serve?",
    a: "Chiransh Foods is associated with Gujarat, India. Our exact service area is being finalised — please contact us for current availability.",
  },
  {
    q: "How can I place an order?",
    a: "The quickest way is WhatsApp — tap \"Order on WhatsApp\" anywhere on the site and send us a pre-filled message. You can also send your details through the enquiry form on our Contact page and we'll confirm your order directly. Online ordering is coming soon.",
  },
  {
    q: "Do you offer pickup?",
    a: "Please contact Chiransh Foods for current availability. Pickup options will be announced soon.",
  },
  {
    q: "Do you offer delivery?",
    a: "Please contact Chiransh Foods for current availability. Delivery options — including pickup, local delivery and delivery partners — will be announced soon.",
  },
  {
    q: "How can I contact Chiransh Foods?",
    a: "WhatsApp is the quickest way to reach us — chat with us directly from any \"Order on WhatsApp\" button. You can also use the enquiry form on our Contact page. Phone and email details will be published soon.",
  },
];

export default function FAQ() {
  usePageMeta({
    title: "FAQ — Chiransh Foods | Gujarati Vegetarian Food",
    description:
      "Frequently asked questions about Chiransh Foods — our 100% vegetarian Gujarati dishes, Baroda-style Sev Usal, Tuvar Totha, ordering and availability.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  });

  const [open, setOpen] = useState(0);

  return (
    <>
      <header className="relative overflow-hidden bg-leaf" data-testid="faq-header">
        <div
          className="pattern-dots-light absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <SectionHeading
            dark
            eyebrow="FAQ"
            title={
              <>
                Questions, <em className="italic text-gold">answered</em>
              </>
            }
            lede="Everything you need to know about Chiransh Foods — and if we've missed something, just ask."
          />
        </div>
      </header>

      <section
        className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24"
        data-testid="faq-section"
      >
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 0.04, 0.2)}>
                <div
                  data-testid={`faq-item-${i}`}
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? "border-leaf/25 bg-ivory shadow-soft"
                      : "border-leaf/10 bg-ivory/60 hover:border-leaf/25"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    data-testid={`faq-toggle-${i}`}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-serif text-lg font-semibold text-leaf">
                      {f.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isOpen ? "bg-saffron text-cream" : "bg-leaf/5 text-leaf"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-stone-600">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
