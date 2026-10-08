import { createElement, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { localePath, splitLocale } from "@/lib/seo";
import { getRouteSeo } from "@/lib/routeSeo";

export function useLocale() {
  const { pathname } = useLocation();
  return splitLocale(pathname);
}

export function useLocalizedSeo(barePath) {
  const { lang } = useLocale();
  return getRouteSeo(localePath(barePath, lang));
}

export function LocaleLink({ to, ...props }) {
  const { lang } = useLocale();
  const href = typeof to === "string" ? localePath(to, lang) : to;
  return createElement(Link, { to: href, ...props });
}

export function LocaleSync() {
  const { lang } = useLocale();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  return null;
}
