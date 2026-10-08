import { LocaleLink } from "@/lib/locale";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { whatsappUrl } from "@/lib/site";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-semibold transition-all duration-300";

export default function OrderButtons({
  productName,
  align = "left",
  testPrefix = "order",
}) {
  const { settings } = useSettings();
  const wa = whatsappUrl(settings, productName);
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
          <MessageCircle className="h-4 w-4" /> Order on WhatsApp
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phone}`}
          data-testid={`${testPrefix}-call-btn`}
          className={`${base} border border-leaf/20 bg-ivory text-leaf hover:border-leaf`}
        >
          <Phone className="h-4 w-4" /> Call to Order
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
        Contact to Order <ArrowRight className="h-4 w-4" />
      </LocaleLink>
    </div>
  );
}
