import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { getRouteSeo } from "@/lib/routeSeo";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VegMark from "@/components/VegMark";
import { BRAND_VALUES } from "@/components/Values";

const IMG =
  "/images";

export default function About() {
  const { t } = useTranslation();
  usePageMeta(getRouteSeo("/about"));

  return (
    <>
      <header className="relative overflow-hidden bg-leaf" data-testid="about-header">
        <div
          className="pattern-dots-light absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <span
          aria-hidden="true"
          className="font-guj text-outline-cream pointer-events-none absolute -bottom-8 right-0 select-none whitespace-nowrap text-[22vw] font-bold leading-none md:text-[13vw]"
        >
          {t("about.header_story", "વાર્તા")}
        </span>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <SectionHeading
            dark
            eyebrow={t("about.eyebrow_story", "Our Story")}
            title={
              <>
                {t("about.title_story_1", "A love letter to Gujarat's ")}
                <em className="italic text-gold">{t("about.title_story_2", "street food")}</em>
              </>
            }
            lede={t("about.lede", "Chiransh Foods began where all good Gujarati food begins — at home, around real flavours.")}
          />
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-28" data-testid="about-story">
        <div>
          <SectionHeading
            eyebrow={t("about.eyebrow_who", "Who We Are")}
            title={
              <>
                {t("about.title_who_1", "Born of Gujarat's ")}
                <em className="italic text-saffron-deep">{t("about.title_who_2", "street-food soul")}</em>
              </>
            }
          />
          <Reveal delay={0.1}>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-stone-600">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
              <p>{t("about.p3")}</p>
            </div>
          </Reveal>
        </div>
        <Reveal className="relative">
          <div
            className="pattern-dots absolute -right-4 -top-6 h-full w-full rounded-3xl sm:-right-6"
            aria-hidden="true"
          />
          <img
            src={`${IMG}/f60e06ce5df687c2b2b455940b778d6a054b268564dceae3fc75de82cc31877d.webp`}
            alt="A Gujarati vegetarian food spread on a wooden table"
            loading="lazy"
            decoding="async"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
          />
        </Reveal>
      </section>

      <section className="border-y border-leaf/10 bg-ivory" data-testid="about-values">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            eyebrow={t("about.eyebrow_stand", "What We Stand For")}
            title={
              <>
                {t("about.title_stand_1", "Small kitchen, ")}
                <em className="italic text-saffron-deep">{t("about.title_stand_2", "high standards")}</em>
              </>
            }
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BRAND_VALUES.map((v, i) => (
              <Reveal key={v.slug} delay={i * 0.08} className="h-full">
                <div
                  data-testid={`about-value-card-${v.slug}`}
                  className="flex h-full flex-col rounded-3xl border border-leaf/10 bg-cream p-7 shadow-soft"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-leaf text-cream">
                    <v.Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-leaf">
                    {t(`values.${v.slug}_title`, v.title)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {t(`values.${v.slug}_text`, v.text)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28" data-testid="about-food">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <img
              src={`${IMG}/384a05646bbcef1e73af0433ab6e9d7d2e31ab9757a30e99bd75df1fc4db15c2.webp`}
              alt="A flat-lay of Indian spices — turmeric, chilies and coriander seeds"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lift"
            />
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow={t("about.eyebrow_food", "Our Food")}
              title={
                <>
                  {t("about.title_food_1", "Honest ingredients, ")}
                  <em className="italic text-saffron-deep">{t("about.title_food_2", "patient cooking")}</em>
                </>
              }
            />
            <Reveal delay={0.1}>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-stone-600">
                <p>{t("about.p4")}</p>
                <p>{t("about.p5")}</p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-leaf/15 bg-ivory px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.2em] text-leaf">
                  <VegMark className="h-3.5 w-3.5" /> {t("about.veg_100", "100% Vegetarian")}
                </span>
                <Link
                  to="/menu"
                  data-testid="about-explore-menu-btn"
                  className="group inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-forest"
                >
                  {t("about.explore_menu", "Explore the menu")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
