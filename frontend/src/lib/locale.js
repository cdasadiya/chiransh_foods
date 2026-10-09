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

/** Keep query and hash when a path is prefixed for English or Gujarati. */
export function localizedHref(to, lang) {
  if (typeof to !== "string") return to;
  const hashIndex = to.indexOf("#");
  const hash = hashIndex >= 0 ? to.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? to.slice(0, hashIndex) : to;
  const queryIndex = beforeHash.indexOf("?");
  const search = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;
  return `${localePath(path || "/", lang)}${search}${hash}`;
}

export function LocaleLink({ to, ...props }) {
  const { lang } = useLocale();
  const href = localizedHref(to, lang);
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
