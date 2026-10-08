import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { useLocalizedSeo } from "@/lib/locale";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const IMG =
  "/images";

const GALLERY = [
  { src: `${IMG}/d3b76fd97342f13594358947b448a9c10a2319e38042a72df4c09224ad05bb14.webp`, alt: "Baroda-style Sev Usal served in a brass katori", caption: "Signature — Baroda-style Sev Usal" },
  { src: `${IMG}/a16bc408c30ead3a4c7c8c653f1ea3bab08f7e28bf4de8cd1454704edd1a3b56.webp`, alt: "Tuvar Totha served in a brass handi with buttered pav", caption: "Signature — Tuvar Totha" },
  { src: `${IMG}/c40ef399919f6e648344482807be7c4af8d4e9b5ac051f1c39f5c367f2969e3d.webp`, alt: "Close-up of Sev Usal with crunchy sev topping", caption: "The crunch of fresh sev" },
  { src: `${IMG}/fa1f7f80282d9234bddfe7d4727039ca7a61db10d8511ce6089f9f6d30bab81a.webp`, alt: "Fresh green tuvar pods on stone", caption: "Fresh tuvar pods" },
  { src: `${IMG}/384a05646bbcef1e73af0433ab6e9d7d2e31ab9757a30e99bd75df1fc4db15c2.webp`, alt: "Flat-lay of Indian spices", caption: "Our spice palette" },
  { src: `${IMG}/da7bd498a6ba6bcf1a798b19b9852a5c933f812e8c34dd3f232eca06200a0382.webp`, alt: "Hands sprinkling sev over a steaming bowl", caption: "Finishing touches" },
  { src: `${IMG}/0fcaf35923b615c8dcab00e8a9843eac3ba0e899512260c0ed9f3bbc8569f608.webp`, alt: "Buttered pav toasting on a griddle", caption: "Buttered pav, toasted golden" },
  { src: `${IMG}/f60e06ce5df687c2b2b455940b778d6a054b268564dceae3fc75de82cc31877d.webp`, alt: "Gujarati vegetarian spread on a wooden table", caption: "The Gujarati table" },
  { src: `${IMG}/spiced_usal_simmering.png`, alt: "Spiced usal simmering in a pot", caption: "Slow-simmered usal" },
  { src: `${IMG}/bcf4d62101e67d8b5fbc90de6d671f52fc6c820f74b1b1a8cb6c4d9e9134792b.webp`, alt: "Close-up of tuvar totha with tempering", caption: "Totha, straight off the fire" },
];

export default function Gallery() {
  const { t } = useTranslation();
  const captionsData = t("gallery.captions", { returnObjects: true });
  const captions = Array.isArray(captionsData) ? captionsData : [];

  usePageMeta(useLocalizedSeo("/gallery"));

  const [active, setActive] = useState(null);

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (dir) =>
      setActive((i) =>
        i === null ? i : (i + dir + GALLERY.length) % GALLERY.length,
      ),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, step]);

  return (
    <>
      <header className="relative overflow-hidden bg-leaf" data-testid="gallery-header">
        <div
          className="pattern-dots-light absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <SectionHeading
            dark
            eyebrow={t("gallery.eyebrow_header", "Gallery")}
            title={
              <>
                {t("gallery.title_header_1", "The flavours, ")} <em className="italic text-gold">{t("gallery.title_header_2", "up close")}</em>
              </>
            }
            lede={t("gallery.lede", "A look at our food, our ingredients and the care behind every plate. Styled brand imagery — real photographs will replace these as they're captured.")}
          />
        </div>
      </header>

      {GALLERY.length === 0 ? (
        <div className="mx-auto max-w-3xl px-4 py-24 text-center" data-testid="gallery-empty-state">
          <p className="font-serif text-2xl font-semibold text-leaf">
            {t("gallery.empty_title", "Our gallery is being plated.")}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            {t("gallery.empty_text", "Please check back soon.")}
          </p>
        </div>
      ) : (
        <section
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
          data-testid="gallery-grid"
        >
          <div className="columns-2 gap-4 space-y-4 md:columns-3">
            {GALLERY.map((g, i) => {
              const translatedCaption = captions[i] || g.caption;
              return (
                <Reveal key={g.src} delay={Math.min(i * 0.05, 0.25)}>
                  <button
                    onClick={() => setActive(i)}
                    data-testid={`gallery-item-${i}`}
                    aria-label={`Open image: ${translatedCaption}`}
                    className="group relative block w-full overflow-hidden rounded-2xl shadow-soft transition-shadow duration-300 hover:shadow-lift"
                  >
                    <img
                      src={g.src}
                      alt={translatedCaption}
                      loading="lazy"
                      decoding="async"
                      className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-leaf/85 to-transparent p-4 pt-10 text-left text-xs font-medium text-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {translatedCaption}
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-leaf/95 p-4 backdrop-blur"
            data-testid="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={GALLERY[active].caption}
            onClick={close}
          >
            <button
              onClick={close}
              data-testid="gallery-lightbox-close"
              aria-label="Close image viewer"
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              data-testid="gallery-lightbox-prev"
              aria-label="Previous image"
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10 md:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              data-testid="gallery-lightbox-next"
              aria-label="Next image"
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10 md:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <motion.figure
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY[active].src}
                alt={GALLERY[active].alt}
                className="max-h-[78vh] w-auto rounded-2xl object-contain shadow-lift"
              />
              <figcaption className="mt-4 text-center font-serif text-lg italic text-cream/85">
                {captions[active] || GALLERY[active].caption}
                <span className="ml-3 font-display text-xs not-italic tracking-[0.2em] text-cream/50">
                  {active + 1} / {GALLERY.length}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
