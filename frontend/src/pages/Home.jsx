import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageCircle, UtensilsCrossed } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { LocaleLink, useLocalizedSeo } from "@/lib/locale";
import { fetchProducts } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { useTranslation } from "react-i18next";
import {
  FALLBACK_PRODUCTS,
  whatsappUrl,
} from "@/lib/site";
import Marquee from "@/components/Marquee";
import OrderButtons from "@/components/OrderButtons";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VegMark from "@/components/VegMark";
import { ValuesGrid } from "@/components/Values";

const MARQUEE_ITEMS = [
  "Baroda-style Sev Usal",
  "સેવ ઉસળ",
  "Tuvar Totha",
  "તુવેર ટોઠા",
  "100% Pure Vegetarian",
  "Homemade Heritage",
  "Gujarati Street Food",
  "Warm Indian Hospitality",
];

const lineReveal = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 0.9, delay: 0.15 + i * 0.13, ease: [0.22, 1, 0.36, 1] },
  }),
};

function HeroLine({ index, children }) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        custom={index}
        variants={lineReveal}
        initial="hidden"
        animate="show"
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function RotatingBadge() {
  return (
    <div
      className="absolute -top-7 right-2 z-10 hidden h-28 w-28 sm:block md:-right-6"
      data-testid="hero-veg-badge"
      aria-hidden="true"
    >
      <div className="h-full w-full animate-slow-spin">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path
              id="badge-circle"
              d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text className="fill-leaf font-display text-[10px] font-semibold uppercase tracking-[0.16em]">
            <textPath href="#badge-circle">
              100% Vegetarian · Gujarati Street Food ·
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <VegMark className="h-7 w-7" />
      </div>
    </div>
  );
}

function Hero() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const { settings } = useSettings();
  const wa = whatsappUrl(settings);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const xWord = useTransform(scrollYProgress, [0, 1], [0, -160]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 lg:pt-36"
      data-testid="hero-section"
    >
      <div className="pattern-dots absolute inset-0 opacity-40" aria-hidden="true" />
      <motion.span
        aria-hidden="true"
        style={{ x: xWord }}
        className="font-guj text-outline pointer-events-none absolute -top-6 left-0 select-none whitespace-nowrap text-[26vw] font-bold leading-none md:text-[19vw]"
      >
        {t("home.marquee.1")}
      </motion.span>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-28">
        <div className="flex flex-col justify-center lg:col-span-7">
          <Reveal delay={0.05} y={16}>
            <span className="inline-flex items-center gap-2 rounded-full border border-leaf/15 bg-ivory px-4 py-2 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf sm:text-xs">
              <VegMark className="h-3.5 w-3.5" /> {t("home.hero.badge")}
            </span>
          </Reveal>

          <h1 className="mt-6 font-serif text-[2.6rem] font-semibold leading-[1.06] text-leaf sm:text-6xl lg:text-[4.25rem]">
            <HeroLine index={0}>{t("home.hero.title_1")}</HeroLine>
            <HeroLine index={1}>{t("home.hero.title_2")}</HeroLine>
            <HeroLine index={2}>
              {t("home.hero.title_3")} <em className="italic text-saffron-deep">{t("home.hero.title_gujarat")}</em>.
            </HeroLine>
          </h1>

          <Reveal delay={0.55} y={20}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-stone-600 sm:text-lg">
              {t("home.hero.desc")}
            </p>
          </Reveal>

          <Reveal delay={0.7} y={20}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <LocaleLink
                to="/menu"
                data-testid="hero-explore-menu-btn"
                className="group inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 font-display text-sm font-semibold text-cream shadow-soft transition-all duration-300 hover:bg-forest"
              >
                {t("home.hero.explore_menu")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </LocaleLink>
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-whatsapp-order-btn"
                  className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-display text-sm font-semibold text-cream shadow-soft transition-all duration-300 hover:bg-leaf"
                >
                  <MessageCircle className="h-4 w-4" /> {t("home.hero.order_whatsapp")}
                </a>
              ) : (
                <LocaleLink
                  to="/contact"
                  data-testid="hero-contact-order-btn"
                  className="inline-flex items-center gap-2 rounded-full border border-leaf/25 px-7 py-3.5 font-display text-sm font-semibold text-leaf transition-colors duration-300 hover:border-leaf hover:bg-ivory"
                >
                  {t("home.hero.contact_order")}
                </LocaleLink>
              )}
            </div>
          </Reveal>
        </div>

        <div className="relative lg:col-span-5">
          <motion.div style={{ y: yImg }} className="relative">
            <RotatingBadge />
            <motion.div
              initial={{
                clipPath: "inset(100% 0 0 0 round 999px 999px 24px 24px)",
              }}
              animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 24px 24px)" }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-b-3xl rounded-t-[999px] shadow-lift"
            >
              <img
                src={FALLBACK_PRODUCTS[0].image}
                alt="Baroda-style Sev Usal — spiced pea curry crowned with crunchy sev"
                className="aspect-[4/5] w-full object-cover"
                fetchPriority="high"
              />
            </motion.div>

            <Reveal
              delay={0.9}
              className="absolute -left-4 bottom-10 hidden sm:block md:-left-10"
            >
              <LocaleLink
                to="/menu/tuvar-totha"
                data-testid="hero-floating-tuvar-link"
                className="flex items-center gap-3 rounded-2xl border border-leaf/10 bg-ivory/95 p-3 pr-5 shadow-lift backdrop-blur transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={FALLBACK_PRODUCTS[1].image}
                  alt="Tuvar Totha served in a brass handi"
                  loading="lazy"
                  decoding="async"
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <span>
                  <span className="block font-serif text-base font-semibold text-leaf">
                    {t("home.marquee.2")} <span className="font-guj text-saffron-deep">{t("home.marquee.3")}</span>
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 font-display text-xs font-semibold text-saffron-deep">
                    {t("home.signature.view_dish")} <ArrowRight className="h-3 w-3" />
                  </span>
                </span>
              </LocaleLink>
            </Reveal>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SignatureBento({ products }) {
  const { t, i18n } = useTranslation();
  const isGu = i18n.language === "gu";
  const usal =
    products.find((p) => p.slug === "baroda-style-sev-usal") || products[0];
  const totha =
    products.find((p) => p.slug === "tuvar-totha") || products[1] || products[0];

  const BigCard = ({ product, testId }) => {
    const mainName = isGu && product.gujarati_name ? product.gujarati_name : product.name;
    const secondaryName = isGu && product.gujarati_name ? product.name : product.gujarati_name;
    const shortDesc = isGu && product.gujarati_short_description ? product.gujarati_short_description : product.short_description;
    
    return (
    <LocaleLink
      to={`/menu/${product.slug}`}
      data-testid={testId}
      className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl shadow-soft"
      aria-label={`${mainName} — view details`}
    >
      <img
        src={product.image}
        alt={`${product.name} — ${product.short_description}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-leaf/95 via-leaf/35 to-transparent" />
      <div className="relative p-7 md:p-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-leaf/40 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur">
          <UtensilsCrossed className="h-3 w-3" /> {product.badge || "Signature"}
        </span>
        <h3 className="mt-4 font-serif text-3xl font-semibold text-cream md:text-4xl">
          {mainName}
        </h3>
        {secondaryName && (
          <p className="font-guj mt-1 text-xl text-gold">{secondaryName}</p>
        )}
        <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/85">
          {shortDesc}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-cream transition-transform duration-300 group-hover:translate-x-1">
          {t("home.signature.view_dish")} <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </LocaleLink>
  )};

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      data-testid="signature-section"
    >
      <SectionHeading
        eyebrow={t("home.signature.eyebrow")}
        title={
          <>
            {t("home.signature.title_1")}{" "}
            <em className="italic text-saffron-deep">{t("home.signature.title_2")}</em>
          </>
        }
        lede={t("home.signature.lede")}
      />
      <div className="mt-12 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <BigCard product={usal} testId="bento-sev-usal-card" />
        </Reveal>
        <Reveal className="md:col-span-5" delay={0.1}>
          <BigCard product={totha} testId="bento-tuvar-totha-card" />
        </Reveal>
        <ValuesGrid />
      </div>
    </section>
  );
}

function StorySnapshot() {
  const { t } = useTranslation();
  return (
    <section
      className="bg-ivory"
      data-testid="story-snapshot-section"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28">
        <Reveal className="relative">
          <div
            className="pattern-dots absolute -left-6 -top-6 h-full w-full rounded-3xl"
            aria-hidden="true"
          />
          <img
            src="/images/da7bd498a6ba6bcf1a798b19b9852a5c933f812e8c34dd3f232eca06200a0382.webp"
            alt="Finishing touches — sprinkling crunchy sev over a steaming bowl"
            loading="lazy"
            decoding="async"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
          />
        </Reveal>
        <div>
          <SectionHeading
            eyebrow={t("home.story.eyebrow")}
            title={
              <>
                {t("home.story.title_1")}{" "}
                <em className="italic text-saffron-deep">{t("home.story.title_2")}</em>
              </>
            }
          />
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-stone-600">
              {t("home.story.p1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-stone-600">
              {t("home.story.p2")}
            </p>
            <LocaleLink
              to="/about"
              data-testid="home-read-story-btn"
              className="group mt-7 inline-flex items-center gap-2 font-display text-sm font-semibold text-leaf"
            >
              <span className="border-b border-saffron pb-0.5 transition-colors group-hover:text-saffron-deep">
                {t("home.story.read_story")}
              </span>
              <ArrowRight className="h-4 w-4 text-saffron-deep transition-transform duration-300 group-hover:translate-x-1" />
            </LocaleLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MenuPreview() {
  const { t } = useTranslation();
  const categories = [
    {
      slug: "gujarati-street-food",
      name: t("home.menu_preview.cats.gujarati.name"),
      note: t("home.menu_preview.cats.gujarati.note"),
      count: t("home.menu_preview.live"),
      soon: false,
    },
    {
      slug: "fast-food",
      name: t("home.menu_preview.cats.fast.name"),
      note: t("home.menu_preview.cats.fast.note"),
      count: t("home.menu_preview.soon"),
      soon: true,
    },
    {
      slug: "indian",
      name: t("home.menu_preview.cats.indian.name"),
      note: t("home.menu_preview.cats.indian.note"),
      count: t("home.menu_preview.soon"),
      soon: true,
    },
  ];

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
      data-testid="menu-preview-section"
    >
      <SectionHeading
        eyebrow={t("home.menu_preview.eyebrow")}
        title={
          <>
            {t("home.menu_preview.title_1")} <em className="italic text-saffron-deep">{t("home.menu_preview.title_2")}</em>{" "}
            {t("home.menu_preview.title_3")}
          </>
        }
        lede={t("home.menu_preview.lede")}
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08} className="h-full">
            <LocaleLink
              to="/menu"
              data-testid={`menu-preview-${c.slug}`}
              className={`group flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1 ${
                c.soon
                  ? "border-dashed border-leaf/20 bg-cream"
                  : "border-leaf/10 bg-ivory shadow-soft hover:shadow-lift"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-[0.15em] ${
                    c.soon
                      ? "bg-leaf/5 text-stone-500"
                      : "bg-leaf/5 text-saffron-deep"
                  }`}
                >
                  {c.count}
                </span>
                <ArrowRight className="h-4 w-4 text-leaf/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-leaf" />
              </div>
              <h3 className="mt-6 font-serif text-2xl font-semibold text-leaf">
                {c.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {c.note}
              </p>
            </LocaleLink>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2} className="mt-10 text-center">
        <LocaleLink
          to="/menu"
          data-testid="home-view-full-menu-btn"
          className="inline-flex items-center gap-2 rounded-full bg-saffron px-8 py-3.5 font-display text-sm font-semibold text-cream shadow-soft transition-all duration-300 hover:bg-saffron-deep"
        >
          {t("home.menu_preview.view_full")} <ArrowRight className="h-4 w-4" />
        </LocaleLink>
      </Reveal>
    </section>
  );
}

function OrderBand() {
  const { t } = useTranslation();
  return (
    <section
      className="relative overflow-hidden bg-leaf"
      data-testid="cta-band"
    >
      <div
        className="pattern-dots-light absolute inset-0 opacity-60"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-28">
        <Reveal>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {t("home.order.eyebrow")}
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-cream sm:text-5xl">
            {t("home.order.title_1")}{" "}
            <em className="italic text-gold">{t("home.order.title_2")}</em>.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-cream/70">
            {t("home.order.desc")}
          </p>
          <div className="mt-8">
            <OrderButtons align="center" testPrefix="cta" />
          </div>
          <p
            className="mt-12 text-xs italic text-cream/50"
            data-testid="reviews-coming-soon"
          >
            {t("home.order.reviews")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const products = data?.length ? data : FALLBACK_PRODUCTS;
  
  const translatedMarquee = t("home.marquee", { returnObjects: true });
  const actualMarqueeItems = Array.isArray(translatedMarquee) ? translatedMarquee : MARQUEE_ITEMS;

  usePageMeta(useLocalizedSeo("/"));

  return (
    <>
      <Hero />
      <Marquee items={actualMarqueeItems} />
      <SignatureBento products={products} />
      <StorySnapshot />
      <MenuPreview />
      <OrderBand />
    </>
  );
}
