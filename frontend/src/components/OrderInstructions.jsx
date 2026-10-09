import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";

export default function OrderInstructions({ className = "" }) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const phoneDisplay = settings?.contact?.phone_display || "+91 91063 54619";
  const phoneHref = String(settings?.contact?.phone || "+919106354619").replace(/[^\d+]/g, "");
  const points = t("instructions.points", { returnObjects: true });
  const items = Array.isArray(points) ? points : [];

  return (
    <section
      data-testid="order-instructions"
      className={`rounded-3xl border border-leaf/10 bg-ivory p-5 sm:p-6 lg:p-8 ${className}`}
    >
      <h2 className="font-serif text-2xl font-semibold leading-snug text-leaf sm:text-3xl">
        {t("instructions.eyebrow")}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600 sm:text-base">
        {t("instructions.lede")}
      </p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-leaf/10 bg-cream px-4 py-3">
          <dt className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {t("instructions.quantity_label")}
          </dt>
          <dd className="mt-1 text-sm font-medium leading-relaxed text-charcoal">
            {t("instructions.quantity")}
          </dd>
        </div>
        <div className="min-w-0 rounded-2xl border border-leaf/10 bg-cream px-4 py-3">
          <dt className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-500">
            {t("instructions.booking_label")}
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-charcoal">
            {t("instructions.booking_prefix")}{" "}
            <a
              href={`tel:${phoneHref}`}
              className="font-semibold text-leaf underline-offset-2 hover:underline"
            >
              {phoneDisplay}
            </a>
          </dd>
        </div>
      </dl>
      <h3 className="mt-6 font-serif text-lg font-semibold text-leaf">
        {t("instructions.quality_title")}
      </h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((point) => (
          <li
            key={point}
            className="min-w-0 rounded-2xl border border-leaf/10 bg-cream px-3 py-3 text-sm leading-relaxed text-stone-700"
          >
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-stone-600 sm:text-base">
        {t("instructions.cta")}
      </p>
      <p className="mt-3 font-serif text-base leading-relaxed text-leaf sm:text-lg">
        {t("instructions.tagline")}
      </p>
    </section>
  );
}
