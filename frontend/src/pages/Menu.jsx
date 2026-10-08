import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, RefreshCw } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { useLocalizedSeo } from "@/lib/locale";
import { fetchProducts } from "@/lib/api";
import { CATEGORY_NOTES, MENU_CATEGORIES } from "@/lib/site";
import { useTranslation } from "react-i18next";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";

export default function Menu() {
  const { t, i18n } = useTranslation();
  const isGu = i18n.language === "gu";
  usePageMeta(useLocalizedSeo("/menu"));

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ["products"], queryFn: fetchProducts, retry: 1 });
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const products = data || [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const inCategory = category === "All" || p.category === category;
      const inSearch =
        !q ||
        `${p.name} ${p.gujarati_name} ${p.short_description} ${p.description} ${p.gujarati_description} ${p.gujarati_short_description}`
          .toLowerCase()
          .includes(q);
      return inCategory && inSearch;
    });
  }, [products, category, search]);

  const tabs = ["All", ...MENU_CATEGORIES];
  const countFor = (tab) =>
    tab === "All"
      ? products.length
      : products.filter((p) => p.category === tab).length;

  return (
    <>
      <header className="relative overflow-hidden bg-leaf" data-testid="menu-header">
        <div
          className="pattern-dots-light absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <span
          aria-hidden="true"
          className="font-guj text-outline-cream pointer-events-none absolute -bottom-10 right-0 select-none whitespace-nowrap text-[24vw] font-bold leading-none md:text-[14vw]"
        >
          {t("home.marquee.1")} 
        </span>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <SectionHeading
            dark
            eyebrow={t("menu.header.eyebrow")}
            title={
              <>
                {t("menu.header.title_1")}{" "}
                <em className="italic text-gold">{t("menu.header.title_2")}</em>
              </>
            }
            lede={t("menu.header.lede")}
          />
        </div>
      </header>

      <section
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        data-testid="menu-catalog"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Menu categories"
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={category === tab}
                data-testid={`menu-category-tab-${tab
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                onClick={() => setCategory(tab)}
                className={`rounded-full px-4 py-2 font-display text-sm font-semibold transition-all duration-300 ${
                  category === tab
                    ? "bg-leaf text-cream shadow-soft"
                    : "border border-leaf/15 bg-ivory text-stone-600 hover:border-leaf/40"
                }`}
              >
                {t(`menu.categories.${tab}`, tab)}{" "}
                <span className="text-xs opacity-60">({countFor(tab)})</span>
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Search
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="menu-search-input"
              placeholder={t("menu.search")}
              aria-label={t("menu.search")}
              className="w-full rounded-full border border-leaf/15 bg-ivory py-2.5 pl-10 pr-4 text-sm text-charcoal placeholder:text-stone-400 focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/30"
            />
          </div>
        </div>

        {isError ? (
          <div
            className="mt-10 rounded-3xl border border-dashed border-chili/30 bg-ivory px-6 py-16 text-center"
            data-testid="menu-error-state"
          >
            <p className="font-serif text-2xl font-semibold text-leaf">
              {t("menu.error")}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              {t("menu.check_connection")}
            </p>
            <button
              onClick={() => refetch()}
              data-testid="menu-retry-btn"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-forest"
            >
              <RefreshCw className="h-4 w-4" /> {t("menu.try_again")}
            </button>
          </div>
        ) : isLoading ? (
          <div
            className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            data-testid="menu-loading-skeleton"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] animate-pulse rounded-2xl bg-leaf/5"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="mt-10 rounded-3xl border border-dashed border-leaf/20 bg-ivory px-6 py-16 text-center"
            data-testid="menu-empty-state"
          >
            <p className="font-serif text-2xl font-semibold text-leaf">
              {search ? t("menu.no_match") : t("menu.empty")}
            </p>
            <p className="mt-2 text-sm text-stone-500">
              {search
                ? t("menu.no_match_desc")
                : t("menu.empty_desc")}
            </p>
          </div>
        ) : (
          <>
            {category !== "All" && CATEGORY_NOTES[category] && (
              <p className="mt-8 text-sm italic text-stone-500">
                {t(`menu.notes.${category}`, CATEGORY_NOTES[category])}
              </p>
            )}
            <div
              className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              data-testid="menu-grid"
            >
              {filtered.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
