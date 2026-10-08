import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import { useSettings } from "@/context/SettingsContext";
import { whatsappUrl } from "@/lib/site";
import { LocaleLink, useLocale } from "@/lib/locale";
import { LOCALES, localePath, splitLocale } from "@/lib/seo";
import useDialog from "@/hooks/useDialog";

const LINKS = [
  { label: "home", to: "/" },
  { label: "menu", to: "/menu" },
  { label: "about", to: "/about" },
  { label: "gallery", to: "/gallery" },
  { label: "contact", to: "/contact" },
];

function LanguageLinks({ light = false, onNavigate }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { lang } = useLocale();
  return (
    <div role="group" aria-label={t("a11y.language")} className="flex items-center gap-1">
      {LOCALES.map((locale) => {
        const active = lang === locale.code;
        return (
          <Link
            key={locale.code}
            to={localePath(pathname, locale.code)}
            hrefLang={locale.htmlLang}
            lang={locale.htmlLang}
            aria-current={active ? "page" : undefined}
            aria-label={locale.label}
            onClick={onNavigate}
            className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full px-2 font-display text-xs font-semibold transition-colors ${
              active
                ? light
                  ? "bg-cream text-leaf"
                  : "bg-leaf text-cream"
                : light
                  ? "text-cream hover:bg-cream/10"
                  : "text-leaf hover:bg-leaf/5"
            }`}
          >
            {locale.short}
          </Link>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { lang } = useLocale();
  const { settings } = useSettings();
  const wa = whatsappUrl(settings, null, t("order.whatsapp_general"));
  const closeMenu = useCallback(() => setOpen(false), []);
  const dialogRef = useDialog(open, closeMenu);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const orderHref = wa || localePath("/contact", lang);
  const orderLabel = wa ? t("nav.order_whatsapp") : t("nav.order_contact");
  const externalProps = wa ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const barePath = splitLocale(pathname).path;
  const isActive = (to) => (to === "/" ? barePath === "/" : barePath === to || barePath.startsWith(`${to}/`));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-shadow duration-300 ${
          scrolled ? "shadow-soft" : ""
        }`}
      >
        <div className="border-b border-leaf/10 bg-cream/85 backdrop-blur-xl">
          <nav
            className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8"
            aria-label={t("a11y.main_nav")}
          >
            <Logo />
            <ul className="hidden items-center gap-8 lg:flex">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <LocaleLink
                    to={l.to}
                    data-testid={`nav-${l.label}-link`}
                    className={`font-display text-sm font-semibold tracking-wide transition-colors ${
                      isActive(l.to) ? "text-leaf" : "text-stone-600 hover:text-leaf"
                    }`}
                    aria-current={isActive(l.to) ? "page" : undefined}
                  >
                    {t(`nav.${l.label}`)}
                    <span
                      className={`mt-0.5 block h-0.5 rounded-full bg-saffron transition-all duration-300 ${
                        isActive(l.to) ? "w-full" : "w-0"
                      }`}
                    />
                  </LocaleLink>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden min-[360px]:block">
                <LanguageLinks />
              </div>
              <a
                href={orderHref}
                {...externalProps}
                data-testid="nav-order-cta"
                className="hidden min-h-11 items-center rounded-full bg-leaf px-5 py-2.5 font-display text-sm font-semibold text-cream transition-all duration-300 hover:bg-forest hover:shadow-soft sm:inline-flex"
              >
                {orderLabel}
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
                data-testid="nav-mobile-toggle"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t("a11y.close_menu") : t("a11y.open_menu")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-leaf/15 text-leaf transition-colors hover:bg-leaf/5 lg:hidden"
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
            ref={dialogRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("a11y.dialog_menu")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-testid="nav-mobile-menu"
            className="fixed inset-0 z-[60] flex h-dvh flex-col overflow-y-auto bg-leaf px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Logo light />
              <button
                onClick={closeMenu}
                data-testid="nav-mobile-close"
                aria-label={t("a11y.close_menu")}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <LanguageLinks light onNavigate={closeMenu} />
            </div>
            <ul className="mt-6 flex flex-col">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LocaleLink
                    to={l.to}
                    data-testid={`nav-mobile-${l.label}-link`}
                    className="block border-b border-cream/10 py-4 font-serif text-3xl font-medium text-cream"
                  >
                    {t(`nav.${l.label}`)}
                  </LocaleLink>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="mt-auto pt-8"
            >
              <a
                href={orderHref}
                {...externalProps}
                data-testid="nav-mobile-order-cta"
                className="flex min-h-11 w-full items-center justify-center rounded-full bg-saffron px-6 py-4 font-display text-base font-semibold text-cream"
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
