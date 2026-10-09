import { useTranslation } from "react-i18next";
import { LocaleLink } from "@/lib/locale";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { whatsappUrl } from "@/lib/site";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold transition-all duration-300";

export default function OrderButtons({
  productName,
  align = "left",
  testPrefix = "order",
}) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const waMessage = productName
    ? t("order.whatsapp_product", { product: productName })
    : t("order.whatsapp_general");
  const wa = whatsappUrl(settings, productName, waMessage);
  const phone = settings?.contact?.phone;
  const hasDirect = Boolean(wa || phone);

  return (
    <div className={`flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`${testPrefix}-whatsapp-btn`}
          className={`${base} bg-forest text-cream hover:bg-leaf hover:shadow-soft`}
        >
          <MessageCircle className="h-4 w-4" /> {t("order.whatsapp", "Order on WhatsApp")}
        </a>
      )}
      {phone && (
        <a
          href={`tel:${String(phone).replace(/\s/g, "")}`}
          data-testid={`${testPrefix}-call-btn`}
          className={`${base} border border-leaf/20 bg-ivory text-leaf hover:border-leaf`}
        >
          <Phone className="h-4 w-4" /> {t("order.call", "Call to Order")}
        </a>
      )}
      <LocaleLink
        to="/contact"
        data-testid={`${testPrefix}-contact-btn`}
        className={`${base} ${
          hasDirect
            ? "border border-leaf/20 bg-ivory text-leaf hover:border-leaf"
            : "bg-saffron text-cream shadow-soft hover:bg-saffron-deep"
        }`}
      >
        {t("order.contact", "Contact to Order")} <ArrowRight className="h-4 w-4" />
      </LocaleLink>
    </div>
  );
}
