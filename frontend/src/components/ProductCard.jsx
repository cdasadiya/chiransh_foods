import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import VegMark from "./VegMark";
import { priceLabel } from "@/lib/site";

export default function ProductCard({ product, index = 0, dataTestId }) {
  const { t, i18n } = useTranslation();
  const isGu = i18n.language === "gu";
  
  const mainName = isGu && product.gujarati_name ? product.gujarati_name : product.name;
  const secondaryName = isGu && product.gujarati_name ? product.name : product.gujarati_name;
  const shortDesc = isGu && product.gujarati_short_description ? product.gujarati_short_description : product.short_description;
  return (
    <Reveal delay={Math.min(index * 0.08, 0.3)} className="h-full">
      <Link
        to={`/menu/${product.slug}`}
        data-testid={dataTestId || `product-card-${product.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-leaf/10 bg-ivory shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
        aria-label={`${product.name} — view details`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image}
            alt={`${mainName} — ${shortDesc}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-[0.15em] text-leaf backdrop-blur">
              {product.badge}
            </span>
          )}
          {secondaryName && (
            <span className="font-guj absolute bottom-3 right-4 text-2xl text-cream drop-shadow-lg" aria-hidden="true">
              {secondaryName}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-xl font-semibold leading-snug text-leaf">
              {mainName}
            </h3>
            <VegMark className="mt-1 h-4 w-4 shrink-0" />
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">
            {shortDesc}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-leaf/10 pt-4">
            <span className="text-sm font-medium text-charcoal" data-testid={`product-price-${product.slug}`}>
              {priceLabel(product.price)}
            </span>
            <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-saffron-deep transition-transform duration-300 group-hover:translate-x-1">
              {t("menu.view_dish", "View dish")} <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
