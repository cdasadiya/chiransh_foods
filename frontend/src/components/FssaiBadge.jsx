import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";

const LICENSE_FALLBACK = "XXXXXXXXXXXX";

function FssaiMark({ className = "" }) {
  return (
    <svg
      viewBox="-11.5 -2.8 259.3 168.2"
      width="259"
      height="168"
      className={`block h-auto min-w-0 max-w-full ${className}`}
      aria-hidden="true"
    >
      <path d="M44.92 159.4 H178.8" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
      <text fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontWeight="600" fontSize="124">
        <tspan x="8" y="118" fill="#142D21">
          fss
        </tspan>
        <tspan fill="#D97706">ai</tspan>
      </text>
      <path d="M19.94 60.5 H208" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
      <circle cx="204" cy="60.5" r="5.4" fill="#B45309" />
      <g transform="translate(200 58) rotate(-42)">
        <path d="M11 36C11 20 3 11 11 0C19 11 11 20 11 36Z" fill="#15803d" />
        <path d="M11 30C11 20 11 10 11 4" stroke="#F7FBF8" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function FssaiBadge({ tone = "light", className = "" }) {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const license = settings?.fssai?.license || LICENSE_FALLBACK;
  const onDark = tone === "onDark";
  const gujarati = i18n.resolvedLanguage === "gu" || i18n.language?.startsWith("gu");

  return (
    <figure data-testid="fssai-badge" className={`w-full min-w-0 max-w-[19.5rem] ${className}`}>
      <div className="rounded-3xl border border-leaf/10 bg-cream px-4 pb-3.5 pt-2 shadow-soft">
        <FssaiMark className="h-auto w-full" />
        <p
          className={`text-center font-medium leading-snug text-leaf ${
            gujarati ? "font-guj text-[0.85rem]" : "font-sans text-[0.7rem]"
          }`}
        >
          {t("footer.fssai_name")}
        </p>
      </div>
      <figcaption
        className={`mt-2.5 text-center font-display text-[0.8rem] font-semibold tracking-wide ${
          onDark ? "text-cream" : "text-charcoal"
        }`}
      >
        {t("footer.fssai_license_label")}{" "}
        <span className="tracking-[0.14em]" data-testid="fssai-license">
          {license}
        </span>
      </figcaption>
    </figure>
  );
}
