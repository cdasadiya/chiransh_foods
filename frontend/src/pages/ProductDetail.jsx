import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { LocaleLink, useLocalizedSeo } from "@/lib/locale";
import { priceLabel, showsBulkInstructions } from "@/lib/site";
import { productNames } from "@/lib/productCopy";
import FoodImage from "@/components/FoodImage";
import OrderInstructions from "@/components/OrderInstructions";
import NotFound from "@/pages/NotFound";
import OrderButtons from "@/components/OrderButtons";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VegMark from "@/components/VegMark";

const AVAILABILITY = {
  available: { label: "Available now", cls: "border-green-600/30 bg-green-50 text-green-700" },
  seasonal: { label: "Seasonal", cls: "border-saffron/30 bg-saffron/10 text-saffron-deep" },
  unavailable: { label: "Currently unavailable", cls: "border-stone-300 bg-stone-100 text-stone-500" },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug),
    retry: false,
  });
  const { data: all } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const is404 = isError && error?.response?.status === 404;

  const names = product ? productNames(product, i18n.language) : null;
  const mainName = names?.name || "";
  const secondaryName = names?.secondary || "";
  const desc = names?.description || "";
  const shortDesc = names?.short_description || "";

  const seo = useLocalizedSeo(`/menu/${slug || ""}`);
  usePageMeta({ ...seo, noindex: Boolean(is404) || seo.noindex, alternates: is404 ? [] : seo.alternates });

  if (is404) return <NotFound />;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8" data-testid="product-loading">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-leaf/5" />
          <div className="space-y-4">
            <div className="h-10 w-3/4 animate-pulse rounded-xl bg-leaf/5" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-leaf/5" />
            <div className="h-24 animate-pulse rounded-xl bg-leaf/5" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 text-center sm:px-6" data-testid="product-error-state">
        <p className="font-serif text-3xl font-semibold text-leaf">
          {t("product.load_error")}
        </p>
        <p className="mt-3 text-sm text-stone-500">
          {t("product.load_error_detail")}
        </p>
        <button
          onClick={() => refetch()}
          data-testid="product-retry-btn"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-leaf px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-forest"
        >
          <RefreshCw className="h-4 w-4" /> {t("product.try_again")}
        </button>
      </div>
    );
  }

  const avail = AVAILABILITY[product.availability] || AVAILABILITY.available;
  const related = (all || [])
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, 3);

  return (
    <>
      <nav
        aria-label={t("a11y.breadcrumb")}
        className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-28"
        data-testid="product-breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500">
          <li>
            <LocaleLink to="/" className="transition-colors hover:text-leaf">
              {t("nav.home", "Home")}
            </LocaleLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <LocaleLink to="/menu" className="transition-colors hover:text-leaf">
              {t("nav.menu", "Menu")}
            </LocaleLink>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="font-medium text-leaf" aria-current="page">
            {mainName}
          </li>
        </ol>
      </nav>

      <section
        className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pb-24"
        data-testid="product-detail"
      >
        <Reveal className="relative">
          <div
            className="pattern-dots absolute -left-5 -top-5 h-full w-full rounded-3xl"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-3xl shadow-lift">
            <FoodImage
              src={product.image}
              alt={`${mainName} — ${shortDesc}`}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              {product.badge && (
                <span className="rounded-full bg-leaf/5 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-[0.15em] text-saffron-deep">
                  {t(`menu.badges.${product.badge}`, product.badge)}
                </span>
              )}
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-[0.15em] ${avail.cls}`}
                data-testid="product-availability"
              >
                {t(`product.${product.availability}`, avail.label)}
              </span>
              {product.vegetarian && <VegMark className="h-5 w-5" />}
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-leaf sm:text-5xl">
              {mainName}
            </h1>
            {secondaryName && (
              <p className="font-guj mt-2 text-2xl text-saffron-deep" lang={i18n.language === "en" ? "gu" : "en"}>
                {secondaryName}
              </p>
            )}

            <p className="mt-4 text-base leading-relaxed text-stone-600">
              {desc}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-leaf/10 py-4">
              <div>
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                  {t("menu.price", "Price")}
                </p>
                <p className="mt-0.5 font-display text-base font-semibold text-leaf" data-testid="product-detail-price">
                  {product.price == null || product.price === "" ? t("menu.price_contact") : priceLabel(product.price)}
                </p>
              </div>
              <div>
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                  {t("menu.category", "Category")}
                </p>
                <p className="mt-0.5 font-display text-base font-semibold text-leaf">
                  {t(`menu.categories.${product.category}`, product.category)}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <OrderButtons productName={mainName} testPrefix="product-detail" />
              {product.availability === "unavailable" && (
                <p className="mt-3 text-sm italic text-stone-500">
                  {t("menu.unavailable", "This dish is currently unavailable — contact us to enquire when it's back.")}
                </p>
              )}
            </div>

            <div className="mt-9 space-y-5">
              <div data-testid="product-ingredients">
                <h2 className="font-serif text-xl font-semibold text-leaf">
                  {t("menu.ingredients", "Ingredients")}
                </h2>
                {product.ingredients?.length ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <li
                        key={ing}
                        className="rounded-full border border-leaf/15 bg-ivory px-3 py-1 text-sm text-stone-600"
                      >
                        {ing}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {t("menu.ingredient_info")}
                  </p>
                )}
              </div>
              {showsBulkInstructions(product.category) ? (
                <OrderInstructions />
              ) : (
                <div data-testid="product-serving-info">
                  <h2 className="font-serif text-xl font-semibold text-leaf">
                    {t("menu.serving", "Serving")}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    {product.serving_info ||
                      t("menu.serving_info")}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="border-t border-leaf/10 bg-ivory"
          data-testid="related-products"
        >
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading
              eyebrow={t("menu.keep_exploring", "Keep Exploring")}
              title={
                <>
                  {t("menu.may_also_love", "You may also")} <em className="italic text-saffron-deep">{t("menu.love", "love")}</em>
                </>
              }
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  index={i}
                  dataTestId={`related-product-card-${p.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
