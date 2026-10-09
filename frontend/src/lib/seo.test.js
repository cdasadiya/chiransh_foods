import { describe, expect, it } from "vitest";
import {
  escapeHtml,
  getPageSeo,
  hreflangAlternates,
  isKnownPath,
  localePath,
  renderSeoTags,
  sitemapEntries,
  splitLocale,
} from "./seo";

const products = [{ slug: "baroda-style-sev-usal", name: "Baroda-Style Sev Usal", sort_order: 1, category: "Sev Usal (Regular)", short_description: "Usal", description: "Usal" }];

describe("locales", () => {
  it("splits english and gujarati paths", () => {
    expect(splitLocale("/menu")).toEqual({ lang: "en", path: "/menu" });
    expect(splitLocale("/gu")).toEqual({ lang: "gu", path: "/" });
    expect(splitLocale("/gu/menu/baroda-style-sev-usal")).toEqual({
      lang: "gu",
      path: "/menu/baroda-style-sev-usal",
    });
    expect(splitLocale("/hi")).toEqual({ lang: "en", path: "/hi" });
  });

  it("builds locale paths without an english prefix", () => {
    expect(localePath("/menu", "en")).toBe("/menu");
    expect(localePath("/", "gu")).toBe("/gu");
    expect(localePath("/contact", "gu")).toBe("/gu/contact");
  });

  it("lists hreflang for english, gujarati, and x-default", () => {
    const langs = hreflangAlternates("/about").map((item) => item.hreflang);
    expect(langs).toEqual(["en", "gu", "x-default"]);
  });

  it("knows public pages and real dishes only", () => {
    expect(isKnownPath("/hi", products)).toBe(false);
    expect(isKnownPath("/gu/faq", products)).toBe(true);
    expect(isKnownPath("/menu/baroda-style-sev-usal", products)).toBe(true);
    expect(isKnownPath("/menu/missing", products)).toBe(false);
    expect(isKnownPath("/nope", products)).toBe(false);
  });

  it("noindexes unknown pages and indexes translated legal pages", () => {
    expect(getPageSeo("/missing", { products }).noindex).toBe(true);
    const privacy = getPageSeo("/gu/privacy", { products });
    expect(privacy.noindex).toBe(false);
    expect(privacy.lang).toBe("gu");
    expect(privacy.alternates.map((item) => item.hreflang)).toEqual(["en", "gu", "x-default"]);
  });

  it("escapes html in seo tags", () => {
    const tags = renderSeoTags({
      title: `<script>`,
      description: "ok",
      canonical: "https://chiransh-foods.onrender.com/",
      image: "/images/og-image.jpg",
      type: "website",
      ogLocale: "en_IN",
      alternates: [],
      jsonLd: { name: "</script><script>alert(1)</script>" },
    });
    expect(tags).not.toContain("<script>alert");
    expect(escapeHtml(`"<>&`)).toBe("&quot;&lt;&gt;&amp;");
  });

  it("includes three language urls in the sitemap", () => {
    const locs = sitemapEntries(products).map((entry) => entry.loc);
    expect(locs).not.toContain("https://chiransh-foods.onrender.com/hi");
    expect(locs).toContain("https://chiransh-foods.onrender.com/gu/menu/baroda-style-sev-usal");
    expect(locs).toContain("https://chiransh-foods.onrender.com/privacy");
  });
});
