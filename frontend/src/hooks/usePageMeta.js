import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, absUrl } from "@/lib/site";
import { canonicalUrl } from "@/lib/seo";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function syncAlternates(alternates) {
  const items = Array.isArray(alternates) ? alternates : [];
  const wanted = new Set(items.map((item) => item.hreflang));
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => {
    if (!wanted.has(el.getAttribute("hreflang"))) el.remove();
  });
  items.forEach((item) => {
    let el = document.head.querySelector(`link[rel="alternate"][hreflang="${item.hreflang}"]`);
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "alternate");
      el.setAttribute("hreflang", item.hreflang);
      document.head.appendChild(el);
    }
    el.setAttribute("href", item.href);
  });
}

/**
 * Per-page SEO: title, description, canonical, Open Graph, Twitter card, JSON-LD.
 */
export default function usePageMeta({
  title,
  description,
  image,
  type = "website",
  jsonLd,
  noindex = false,
  canonical,
  lang,
  ogLocale,
  alternates,
}) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";
  const alternatesKey = JSON.stringify(alternates || []);

  useEffect(() => {
    document.title = title;
    if (lang) document.documentElement.lang = lang;
    const url = canonical || canonicalUrl(window.location.pathname);

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    upsertLink("canonical", url);
    syncAlternates(alternates);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", SITE_NAME);
    const localeMap = { gu: "gu_IN", hi: "hi_IN", en: "en_IN" };
    upsertMeta("property", "og:locale", ogLocale || localeMap[lang] || "en_IN");
    upsertMeta("property", "og:image", absUrl(image || DEFAULT_OG_IMAGE));

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", absUrl(image || DEFAULT_OG_IMAGE));

    document.head
      .querySelectorAll("script[data-seo-ld]")
      .forEach((s) => s.remove());
    if (jsonLdKey && jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-ld", "true");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, image, type, noindex, canonical, lang, ogLocale, alternatesKey, alternates, jsonLdKey, jsonLd]);
}
