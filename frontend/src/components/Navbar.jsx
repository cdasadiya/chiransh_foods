import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { useSettings } from "@/context/SettingsContext";
import { whatsappUrl } from "@/lib/site";
import { LocaleLink, useLocale } from "@/lib/locale";
import { localePath, splitLocale } from "@/lib/seo";

const LINKS = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { lang } = useLocale();
  const { settings } = useSettings();
  const wa = whatsappUrl(settings);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const orderHref = wa || localePath("/contact", lang);
  const orderLabel = wa ? t("nav.order_whatsapp", "Order on WhatsApp") : t("home.cta_button");
  const externalProps = wa ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const barePath = splitLocale(pathname).path;
  const isActive = (to) => (to === "/" ? barePath === "/" : barePath === to || barePath.startsWith(`${to}/`));
  const switchLanguage = () => navigate(localePath(pathname, lang === "en" ? "gu" : "en"));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-shadow duration-300 ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        <div className="border-b border-leaf/10 bg-cream/85 backdrop-blur-xl">
          <nav
            className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
            aria-label="Main navigation"
          >
            <Logo />
            <ul className="hidden items-center gap-8 lg:flex">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <LocaleLink
                    to={l.to}
                    data-testid={`nav-${l.label.toLowerCase()}-link`}
                    className={`font-display text-sm font-semibold tracking-wide transition-colors ${
                      isActive(l.to) ? "text-leaf" : "text-stone-600 hover:text-leaf"
                    }`}
                  >
                    {t(`nav.${l.label.toLowerCase()}`)}
                    <span
                      className={`mt-0.5 block h-0.5 rounded-full bg-saffron transition-all duration-300 ${
                        isActive(l.to) ? "w-full" : "w-0"
                      }`}
                    />
                  </LocaleLink>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-3">
              <button
                onClick={switchLanguage}
                className="hidden sm:inline-flex items-center justify-center font-display text-sm font-semibold text-leaf px-3 py-1.5 border border-leaf rounded-full hover:bg-leaf hover:text-cream transition-colors"
                title="Toggle Language"
              >
                {lang === "en" ? "GU" : "EN"}
              </button>
              <a
                href={orderHref}
                {...externalProps}
                data-testid="nav-order-cta"
                className="hidden rounded-full bg-leaf px-5 py-2.5 font-display text-sm font-semibold text-cream transition-all duration-300 hover:bg-forest hover:shadow-soft sm:inline-flex"
              >
                {orderLabel}
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
                data-testid="nav-mobile-toggle"
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-leaf/15 text-leaf transition-colors hover:bg-leaf/5 lg:hidden"
              >
                {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-testid="nav-mobile-menu"
            className="fixed inset-0 z-[60] flex flex-col bg-leaf px-6 pb-10 pt-5 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo light />
              <button
                onClick={() => setOpen(false)}
                data-testid="nav-mobile-close"
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-10 flex flex-col">
              <li className="mb-4 flex justify-center">
                <button
                  onClick={() => { switchLanguage(); setOpen(false); }}
                  className="inline-flex items-center justify-center font-display text-sm font-semibold text-cream px-4 py-2 border border-cream rounded-full hover:bg-cream hover:text-leaf transition-colors"
                >
                  {lang === "en" ? "Switch to Gujarati" : "Switch to English"}
                </button>
              </li>
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LocaleLink
                    to={l.to}
                    data-testid={`nav-mobile-${l.label.toLowerCase()}-link`}
                    className="block border-b border-cream/10 py-4 font-serif text-3xl font-medium text-cream"
                  >
                    {t(`nav.${l.label.toLowerCase()}`)}
                  </LocaleLink>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="mt-auto"
            >
              <a
                href={orderHref}
                {...externalProps}
                data-testid="nav-mobile-order-cta"
                className="flex w-full items-center justify-center rounded-full bg-saffron px-6 py-4 font-display text-base font-semibold text-cream"
              >
                {orderLabel}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
