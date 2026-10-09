import { useTranslation } from "react-i18next";

export default function VegMark({ className = "h-4 w-4", title }) {
  const { t } = useTranslation();
  const label = title || t("product.veg");
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-[2px] border-[1.5px] border-green-700 bg-white/90 p-[2px] ${className}`}
    >
      <span className="block h-full w-full rounded-full bg-green-700" />
    </span>
  );
}
