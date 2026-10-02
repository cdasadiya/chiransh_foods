import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, RefreshCw, Sparkles } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { absUrl, priceLabel, SITE_NAME } from "@/lib/site";
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

  usePageMeta({
    title: product
      ? `${product.name} (${product.gujarati_name}) — Chiransh Foods`
      : "Product — Chiransh Foods",
    description: product
      ? `${product.short_description} ${product.name} is a 100% vegetarian ${product.category.toLowerCase()} dish by Chiransh Foods, Gujarat.`
      : "Discover authentic Gujarati vegetarian dishes by Chiransh Foods.",
    type: "product",
    image: product?.image,
    noindex: is404 || isLoading,
    jsonLd: product
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: [absUrl(product.image)],
            description: product.description || product.short_description,
            category: product.category,
            brand: { "@type": "Organization", name: SITE_NAME },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${window.location.origin}/` },
              { "@type": "ListItem", position: 2, name: "Menu", item: `${window.location.origin}/menu` },
              { "@type": "ListItem", position: 3, name: product.name },
            ],
          },
        ]
      : undefined,
  });

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
          We couldn't load this dish.
        </p>
        <p className="mt-3 text-sm text-stone-500">
          Please check your connection and try again.
        </p>
        <button
          onClick={() => refetch()}
          data-testid="product-retry-btn"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 font-display text-sm font-semibold text-cream transition-colors hover:bg-forest"
        >
          <RefreshCw className="h-4 w-4" /> Try again
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
        aria-label="Breadcrumb"
        className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 lg:pt-28"
        data-testid="product-breadcrumb"
      >
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500">
          <li>
            <Link to="/" className="transition-colors hover:text-leaf">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link to="/menu" className="transition-colors hover:text-leaf">
              Menu
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="font-medium text-leaf" aria-current="page">
            {product.name}
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
            <img
              src={product.image}
              alt={`${product.name} — ${product.short_description}`}
              className="aspect-[4/3] w-full object-cover"
              fetchPriority="high"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              {product.badge && (
                <span className="rounded-full bg-leaf/5 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-[0.15em] text-saffron-deep">
                  {product.badge}
                </span>
              )}
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-[0.15em] ${avail.cls}`}
                data-testid="product-availability"
              >
                {avail.label}
              </span>
              {product.vegetarian && <VegMark className="h-5 w-5" />}
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-leaf sm:text-5xl">
              {product.name}
            </h1>
            {product.gujarati_name && (
              <p className="font-guj mt-2 text-2xl text-saffron-deep" lang="gu">
                {product.gujarati_name}
              </p>
            )}

            <p className="mt-4 text-base leading-relaxed text-stone-600">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-leaf/10 py-4">
              <div>
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                  Price
                </p>
                <p className="mt-0.5 font-display text-base font-semibold text-leaf" data-testid="product-detail-price">
                  {priceLabel(product.price)}
                </p>
              </div>
              <div>
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                  Category
                </p>
                <p className="mt-0.5 font-display text-base font-semibold text-leaf">
                  {product.category}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <OrderButtons productName={product.name} testPrefix="product-detail" />
              {product.availability === "unavailable" && (
                <p className="mt-3 text-sm italic text-stone-500">
                  This dish is currently unavailable — contact us to enquire
                  when it's back.
                </p>
              )}
            </div>

            <div className="mt-9 space-y-5">
              <div data-testid="product-ingredients">
                <h2 className="font-serif text-xl font-semibold text-leaf">
                  Ingredients
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
                    Detailed ingredient information is available on request —
                    please contact us for current details.
                  </p>
                )}
              </div>
              <div data-testid="product-serving-info">
                <h2 className="font-serif text-xl font-semibold text-leaf">
                  Serving
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {product.serving_info ||
                    "Serving details are available on request. Please contact Chiransh Foods for current availability."}
                </p>
              </div>
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
              eyebrow="Keep Exploring"
              title={
                <>
                  You may also <em className="italic text-saffron-deep">love</em>
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
