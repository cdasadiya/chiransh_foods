import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { useLocalizedSeo } from "@/lib/locale";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function FAQ() {
  const { t } = useTranslation();
  const faqsData = t("faq.items", { returnObjects: true });
  const faqs = Array.isArray(faqsData) ? faqsData : [];

  usePageMeta(useLocalizedSeo("/faq"));

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
            eyebrow={t("faq.eyebrow_header", "FAQ")}
            title={
              <>
                {t("faq.title_header_1", "Questions, ")} <em className="italic text-gold">{t("faq.title_header_2", "answered")}</em>
              </>
            }
            lede={t("faq.lede", "Everything you need to know about Chiransh Foods — and if we've missed something, just ask.")}
          />
        </div>
      </header>

      <section
        className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24"
        data-testid="faq-section"
      >
        <div className="space-y-3">
          {faqs.map((f, i) => {
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
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    className="flex min-h-11 w-full items-center justify-between gap-4 px-6 py-5 text-left"
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
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-button-${i}`}
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
