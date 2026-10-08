export const CANONICAL_ORIGIN = "https://chiransh-foods.onrender.com";

const SITE_NAME = "Chiransh Foods";
const SITE_DESCRIPTION =
  "Chiransh Foods is a 100% vegetarian Gujarati food brand from Gujarat, India — serving authentic street-food favourites like Baroda-style Sev Usal (સેવ ઉસળ) and Tuvar Totha.";
const DEFAULT_OG_IMAGE = "/images/og-image.jpg";
const MENU_DESCRIPTION =
  "Explore the Chiransh Foods menu — 100% vegetarian Gujarati food: Sev Usal, Tuvar Totha, combos, Jain and Swaminarayan dishes, family packs, and drinks.";

export function normalizePath(pathname) {
  const raw = String(pathname || "/").split("?")[0].split("#")[0];
  if (raw === "" || raw === "/") return "/";
  return raw.replace(/\/+$/, "");
}

export function canonicalUrl(pathname) {
  return `${CANONICAL_ORIGIN}${normalizePath(pathname)}`;
}

export function absoluteAsset(pathname) {
  if (!pathname) return `${CANONICAL_ORIGIN}${DEFAULT_OG_IMAGE}`;
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${CANONICAL_ORIGIN}${path}`;
}

function socialLinks(settings) {
  const social = settings?.social || {};
  return [social.instagram, social.facebook, social.youtube].filter((url) => typeof url === "string" && url);
}

function breadcrumb(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: canonicalUrl(item.path) } : {}),
    })),
  };
}

function graph(nodes) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

function page({ title, description, path, image, type = "website", jsonLd, noindex = false }) {
  return {
    title,
    description,
    canonical: canonicalUrl(path),
    image: absoluteAsset(image),
    type,
    jsonLd,
    noindex,
  };
}

export function getPageSeo(pathname, data) {
  const path = normalizePath(pathname);
  const products = Array.isArray(data?.products) ? data.products : [];
  const settings = data?.settings || {};
  const faqs = Array.isArray(data?.faqs) ? data.faqs : [];
  const area = settings?.location?.service_area || settings?.location?.state || "Gujarat, India";

  if (path === "/") {
    return page({
      title: "Chiransh Foods | Authentic Gujarati Vegetarian Food",
      description: SITE_DESCRIPTION,
      path,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FoodEstablishment",
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: canonicalUrl("/"),
        image: absoluteAsset(DEFAULT_OG_IMAGE),
        servesCuisine: ["Gujarati", "Indian", "Street Food"],
        areaServed: { "@type": "AdministrativeArea", name: area },
        sameAs: socialLinks(settings),
      },
    });
  }

  if (path === "/menu") {
    const sorted = [...products].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return page({
      title: "Menu — Chiransh Foods | Gujarati Street Food & More",
      description: MENU_DESCRIPTION,
      path,
      jsonLd: graph([
        {
          "@type": "ItemList",
          name: "Chiransh Foods menu",
          itemListElement: sorted.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: canonicalUrl(`/menu/${product.slug}`),
          })),
        },
        breadcrumb([
          { name: "Home", path: "/" },
          { name: "Menu", path: "/menu" },
        ]),
      ]),
    });
  }

  if (path.startsWith("/menu/")) {
    const slug = decodeURIComponent(path.slice("/menu/".length));
    const product = products.find((item) => item.slug === slug);
    if (!product) {
      return page({
        title: "Page not found — Chiransh Foods",
        description: "Looks like this plate is empty. Return to the Chiransh Foods menu.",
        path,
        noindex: true,
      });
    }
    const secondary = product.gujarati_name ? ` (${product.gujarati_name})` : "";
    const shortDesc = product.short_description || product.description || "";
    return page({
      title: `${product.name}${secondary} — Chiransh Foods`,
      description: `${shortDesc} ${product.name} is a 100% vegetarian ${String(product.category || "Gujarati").toLowerCase()} dish by Chiransh Foods, Gujarat.`,
      path,
      image: product.image,
      type: "product",
      jsonLd: graph([
        {
          "@type": "Product",
          name: product.name,
          image: [absoluteAsset(product.image)],
          description: product.description || shortDesc,
          category: product.category,
          brand: { "@type": "Organization", name: SITE_NAME },
        },
        breadcrumb([
          { name: "Home", path: "/" },
          { name: "Menu", path: "/menu" },
          { name: product.name, path: `/menu/${product.slug}` },
        ]),
      ]),
    });
  }

  const staticPages = {
    "/about": {
      title: "About Us — Chiransh Foods | Our Gujarati Food Story",
      description:
        "Chiransh Foods is a home-grown, 100% vegetarian Gujarati food brand from Gujarat, India — bringing the authentic flavours of Gujarat's street-food culture to your table.",
    },
    "/gallery": {
      title: "Gallery — Chiransh Foods | Gujarati Food, Spices & Kitchen",
      description:
        "A look inside Chiransh Foods — our signature Gujarati dishes, fresh ingredients, hand-ground spices and the care behind every plate.",
    },
    "/contact": {
      title: "Contact & Order — Chiransh Foods | Gujarati Food in Gujarat",
      description:
        "Contact Chiransh Foods to order authentic Gujarati street food — Baroda-style Sev Usal, Tuvar Totha and more. Send us an order enquiry and we'll get back to you.",
    },
    "/faq": {
      title: "FAQ — Chiransh Foods | Gujarati Vegetarian Food",
      description:
        "Frequently asked questions about Chiransh Foods — our 100% vegetarian Gujarati dishes, Baroda-style Sev Usal, Tuvar Totha, ordering and availability.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    },
    "/privacy": {
      title: "Privacy Policy — Chiransh Foods",
      description: "How Chiransh Foods collects, uses and protects the information you share through our enquiry form.",
    },
    "/terms": {
      title: "Terms & Conditions — Chiransh Foods",
      description: "The terms that apply when you use the Chiransh Foods website and place order enquiries with us.",
    },
    "/refund": {
      title: "Refund / Cancellation Policy — Chiransh Foods",
      description: "How order changes, cancellations and refunds are handled at Chiransh Foods.",
    },
  };

  const found = staticPages[path];
  if (found) return page({ ...found, path });

  return page({
    title: "Page not found — Chiransh Foods",
    description: "Looks like this plate is empty. Return to the Chiransh Foods menu.",
    path,
    noindex: true,
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function meta(attr, key, content) {
  if (!content) return "";
  return `<meta ${attr}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`;
}

export function renderSeoTags(seo) {
  const json = seo.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c")}</script>`
    : "";
  return [
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    meta("name", "robots", seo.noindex ? "noindex, follow" : "index, follow"),
    meta("property", "og:title", seo.title),
    meta("property", "og:description", seo.description),
    meta("property", "og:type", seo.type || "website"),
    meta("property", "og:url", seo.canonical),
    meta("property", "og:site_name", SITE_NAME),
    meta("property", "og:image", seo.image),
    meta("property", "og:locale", "en_IN"),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", seo.title),
    meta("name", "twitter:description", seo.description),
    meta("name", "twitter:image", seo.image),
    json,
  ]
    .filter(Boolean)
    .join("\n    ");
}

export function applySeoToHtml(html, pathname, data) {
  const seo = getPageSeo(pathname, data);
  let next = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  next = next.replace(
    /<meta\s+name="description"[\s\S]*?>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  return next.replace("</head>", `    ${renderSeoTags(seo)}\n  </head>`);
}

// Date the public pages were last reviewed. Bump this when page copy or the menu changes.
// Do not set it from the server clock — a fresh timestamp on every request makes lastmod untrustworthy.
export const SITEMAP_LASTMOD = "2026-10-08";

const STATIC_SITEMAP_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/menu", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/gallery", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/refund", changefreq: "yearly", priority: "0.3" },
];

function dishPriority(product) {
  const category = String(product?.category || "");
  if (category.startsWith("Extras") || category === "Beverages") return "0.5";
  if (product?.badge === "Signature" || category.startsWith("Combos")) return "0.8";
  return "0.7";
}

export function sitemapEntries(products, lastmod = SITEMAP_LASTMOD) {
  const dishes = (Array.isArray(products) ? products : [])
    .filter((product) => product && typeof product.slug === "string" && product.slug)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((product) => ({
      path: `/menu/${product.slug}`,
      changefreq: "monthly",
      priority: dishPriority(product),
      lastmod: product.updated_on || lastmod,
    }));
  const [home, menu, ...rest] = STATIC_SITEMAP_PAGES;
  return [home, menu, ...dishes, ...rest].map((entry) => ({
    loc: canonicalUrl(entry.path),
    lastmod: entry.lastmod || lastmod,
    changefreq: entry.changefreq,
    priority: entry.priority,
  }));
}

function escapeXml(value) {
  return escapeHtml(value);
}

export function renderSitemap(products, lastmod = SITEMAP_LASTMOD) {
  const urls = sitemapEntries(products, lastmod)
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
