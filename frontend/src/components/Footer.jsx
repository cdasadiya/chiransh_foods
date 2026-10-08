import { LocaleLink } from "@/lib/locale";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { FaFacebook as Facebook, FaInstagram as Instagram, FaYoutube as Youtube } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { useSettings } from "@/context/SettingsContext";
import { whatsappUrl } from "@/lib/site";

const EXPLORE = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const LEGAL = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Refund / Cancellation", to: "/refund" },
];

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const phone = settings?.contact?.phone;
  const email = settings?.contact?.email;
  const wa = whatsappUrl(settings);

  const socials = [
    { label: "Instagram", url: settings?.social?.instagram, Icon: Instagram },
    { label: "Facebook", url: settings?.social?.facebook, Icon: Facebook },
    { label: "YouTube", url: settings?.social?.youtube, Icon: Youtube },
  ].filter((s) => s.url);

  const contactRows = [
    { label: "Phone", value: phone, href: phone ? `tel:${phone}` : null, Icon: Phone, testId: "footer-phone-link" },
    { label: "WhatsApp", value: wa ? "Chat with us" : null, href: wa, Icon: MessageCircle, testId: "footer-whatsapp-link" },
    { label: "Email", value: email, href: email ? `mailto:${email}` : null, Icon: Mail, testId: "footer-email-link" },
  ];

  return (
    <footer className="bg-leaf text-cream" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo light />
            <p className="mt-5 max-w-sm font-serif text-lg italic leading-relaxed text-cream/80">
              {t("footer.description", "Authentic Gujarati vegetarian food, with the soul of Gujarat's street-food culture.")}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ label, url, Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Chiransh Foods on ${label}`}
                    data-testid={`footer-social-${label.toLowerCase()}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <nav className="md:col-span-3" aria-label="Footer">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {t("footer.explore", "Explore")}
            </h3>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.to}>
                  <LocaleLink
                    to={l.to}
                    data-testid={`footer-${l.label.toLowerCase()}-link`}
                    className="text-sm text-cream/75 transition-colors hover:text-cream"
                  >
                    {t(`nav.${l.to.slice(1) || 'home'}`, l.label)}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Legal">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {t("footer.legal", "Legal")}
            </h3>
            <ul className="mt-5 space-y-3">
              {LEGAL.map((l) => (
                <li key={l.to}>
                  <LocaleLink
                    to={l.to}
                    data-testid={`footer-legal-${l.label.toLowerCase().split(" ")[0]}-link`}
                    className="text-sm text-cream/75 transition-colors hover:text-cream"
                  >
                    {t(`footer.${l.to.slice(1).split('/')[0]}`, l.label)}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h3 className="font-display text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {t("footer.contact", "Contact")}
            </h3>
            <ul className="mt-5 space-y-3">
              {contactRows.map(
                ({ label, value, href, Icon, testId }) =>
                  value &&
                  href && (
                    <li key={label}>
                      <a
                        href={href}
                        target={href?.startsWith("http") ? "_blank" : undefined}
                        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        data-testid={testId}
                        className="inline-flex items-center gap-2 text-sm text-cream/75 transition-colors hover:text-cream"
                      >
                        <Icon className="h-4 w-4" /> {t(`footer.${label.toLowerCase()}`, value)}
                      </a>
                    </li>
                  ),
              )}
              {!phone && !wa && !email && (
                <li className="text-sm italic text-cream/60">
                  {t("footer.contact_soon", "Contact details coming soon — reach us via the enquiry form.")}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-6 sm:flex-row">
          <p className="text-xs text-cream/60">
            {t("footer.copyright", `© ${new Date().getFullYear()} Chiransh Foods · Gujarat, India`)}
          </p>
          <p className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cream/50">
            {t("footer.tagline", "100% Vegetarian · Made with care")}
          </p>
        </div>
      </div>
    </footer>
  );
}
