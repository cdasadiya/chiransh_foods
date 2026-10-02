import { useEffect } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, absUrl } from "@/lib/site";

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
}) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = title;
    const url = window.location.href;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    upsertLink("canonical", url);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:site_name", SITE_NAME);
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
  }, [title, description, image, type, noindex, jsonLdKey, jsonLd]);
}
