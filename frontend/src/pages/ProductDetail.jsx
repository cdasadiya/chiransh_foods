import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, MessageCircle, Minus, Plus, RefreshCw } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { LocaleLink, useLocalizedSeo } from "@/lib/locale";
import { enquirySearch, orderDetailsText, orderTotal } from "@/lib/order";
import { addonsForSlug, priceLabel, showsBulkInstructions, whatsappUrl } from "@/lib/site";
import { productNames } from "@/lib/productCopy";
import { useSettings } from "@/context/SettingsContext";
import FoodImage from "@/components/FoodImage";
import OrderInstructions from "@/components/OrderInstructions";
import NotFound from "@/pages/NotFound";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VegMark from "@/components/VegMark";

const actionButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold transition-all duration-300";

const AVAILABILITY = {
  available: { label: "Available now", cls: "border-green-600/30 bg-green-50 text-green-700" },
  seasonal: { label: "Seasonal", cls: "border-saffron/30 bg-saffron/10 text-saffron-deep" },
  unavailable: { label: "Currently unavailable", cls: "border-stone-300 bg-stone-100 text-stone-500" },
};

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setQuantity(1);
    setSelectedIds([]);
  }, [slug]);
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
                <p lang="en" className="mt-0.5 font-display text-base font-semibold text-leaf" data-testid="product-detail-price">
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

            <OrderPanel
              product={product}
              productName={mainName}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              settings={settings}
              t={t}
            />

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

function OrderPanel({
  product,
  productName,
  quantity,
  setQuantity,
  selectedIds,
  setSelectedIds,
  settings,
  t,
}) {
  const addons = addonsForSlug(product.slug);
  const selectedAddons = addons
    .filter((addon) => selectedIds.includes(addon.id))
    .map((addon) => ({
      id: addon.id,
      name: t(`addons.${addon.id}`),
      price: addon.price,
    }));
  const total = orderTotal(
    product.price,
    selectedAddons.map((addon) => addon.price),
    quantity,
  );
  const summary = orderDetailsText(t, {
    productName,
    unitPrice: product.price,
    quantity,
    addons: selectedAddons,
  });
  const wa = whatsappUrl(settings, null, summary);
  const enquiryTo = `/contact?${enquirySearch({
    slug: product.slug,
    quantity,
    addonIds: selectedAddons.map((addon) => addon.id),
  })}`;

  function toggleAddon(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  return (
    <div className="mt-7 space-y-5">
      {addons.length > 0 && (
        <fieldset data-testid="product-addons">
          <legend className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600">
            {t("addons.heading")}
          </legend>
          <div className="mt-3 space-y-2">
            {addons.map((addon) => (
              <label
                key={addon.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-leaf/15 bg-ivory px-4 py-3"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                    data-testid={`addon-${addon.id}`}
                    className="h-4 w-4 accent-leaf"
                  />
                  <span className="text-sm text-charcoal">{t(`addons.${addon.id}`)}</span>
                </span>
                <span lang="en" className="font-display text-sm font-semibold text-leaf">
                  {priceLabel(addon.price)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600">
            {t("addons.quantity")}
          </p>
          <div className="mt-2 inline-flex items-center rounded-full border border-leaf/15 bg-ivory">
            <button
              type="button"
              aria-label={t("addons.decrease")}
              data-testid="quantity-decrease"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-leaf"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span lang="en" className="min-w-8 text-center font-display text-sm font-semibold text-leaf" data-testid="product-quantity">
              {quantity}
            </span>
            <button
              type="button"
              aria-label={t("addons.increase")}
              data-testid="quantity-increase"
              onClick={() => setQuantity((current) => Math.min(99, current + 1))}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-leaf"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        {total != null && (
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600">
              {t("addons.total")}
            </p>
            <p lang="en" className="mt-0.5 font-display text-base font-semibold text-leaf" data-testid="product-detail-total">
              {priceLabel(total)}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="product-detail-whatsapp-btn"
            className={`${actionButton} bg-forest text-cream hover:bg-leaf hover:shadow-soft`}
          >
            <MessageCircle className="h-4 w-4" /> {t("order.whatsapp", "Order on WhatsApp")}
          </a>
        )}
        <LocaleLink
          to={enquiryTo}
          data-testid="product-detail-enquiry-btn"
          className={`${actionButton} ${
            wa
              ? "border border-leaf/20 bg-ivory text-leaf hover:border-leaf"
              : "bg-saffron text-cream shadow-soft hover:bg-saffron-deep"
          }`}
        >
          {t("order.enquiry", "Send an enquiry")} <ArrowRight className="h-4 w-4" />
        </LocaleLink>
      </div>
      {product.availability === "unavailable" && (
        <p className="text-sm italic text-stone-500">
          {t("menu.unavailable", "This dish is currently unavailable — contact us to enquire when it's back.")}
        </p>
      )}
    </div>
  );
}
