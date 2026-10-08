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

export function splitLocale(pathname) {
  const path = normalizePath(pathname);
  if (path === "/gu") return { lang: "gu", path: "/" };
  if (path.startsWith("/gu/")) return { lang: "gu", path: normalizePath(path.slice(3)) };
  return { lang: "en", path };
}

export function localePath(pathname, lang) {
  const bare = splitLocale(pathname).path;
  if (lang === "gu") return bare === "/" ? "/gu" : `/gu${bare}`;
  return bare;
}

const LEGAL_PATHS = new Set(["/privacy", "/terms", "/refund"]);

export function hreflangAlternates(pathname) {
  const { path } = splitLocale(pathname);
  if (LEGAL_PATHS.has(path)) return [];
  return [
    { hreflang: "en", href: canonicalUrl(localePath(path, "en")) },
    { hreflang: "gu", href: canonicalUrl(localePath(path, "gu")) },
    { hreflang: "x-default", href: canonicalUrl(localePath(path, "en")) },
  ];
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

function localBusinessFields(settings) {
  const phone = settings?.contact?.phone;
  const city = settings?.location?.city;
  const areas = Array.isArray(settings?.location?.areas) ? settings.location.areas.filter(Boolean) : [];
  const hours = settings?.business_hours || {};
  const fields = {};
  if (typeof phone === "string" && phone) fields.telephone = phone.replace(/\s/g, "");
  if (city) {
    fields.address = {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: settings?.location?.state || "Gujarat",
      addressCountry: "IN",
    };
  }
  if (areas.length) {
    fields.areaServed = areas.map((name) => ({
      "@type": "Place",
      name: city ? `${name}, ${city}` : name,
    }));
  }
  if (hours.opens && hours.closes) {
    fields.openingHoursSpecification = [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: hours.opens,
        closes: hours.closes,
      },
    ];
  }
  return fields;
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

function page({
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd,
  noindex = false,
  lang = "en",
  canonicalPath,
  alternates,
}) {
  return {
    title,
    description,
    canonical: canonicalUrl(canonicalPath || path),
    image: absoluteAsset(image),
    type,
    jsonLd,
    noindex,
    lang,
    ogLocale: lang === "gu" ? "gu_IN" : "en_IN",
    alternates: alternates ?? (noindex ? [] : hreflangAlternates(path)),
  };
}

const GU_SITE_DESCRIPTION =
  "ચિરાંશ ફૂડ્સ ગુજરાત, ભારતની ૧૦૦% શાકાહારી ગુજરાતી ફૂડ બ્રાન્ડ છે — બરોડા સ્ટાઇલ સેવ ઉસળ અને તુવેર ટોઠા જેવી અસલ સ્ટ્રીટ-ફૂડ વાનગીઓ પીરસે છે.";

const GU_MENU_DESCRIPTION =
  "ચિરાંશ ફૂડ્સનું મેનૂ જુઓ — ૧૦૦% શાકાહારી ગુજરાતી ભોજન: સેવ ઉસળ, તુવેર ટોઠા, કોમ્બો, જૈન અને સ્વામિનારાયણ વાનગીઓ, ફેમિલી પેક અને પીણાં.";

export function getPageSeo(pathname, data) {
  const { lang, path } = splitLocale(pathname);
  const localized = (bare) => localePath(bare, lang);
  const products = Array.isArray(data?.products) ? data.products : [];
  const settings = data?.settings || {};
  const faqs = lang === "gu"
    ? (Array.isArray(data?.faqsGu) && data.faqsGu.length ? data.faqsGu : data?.faqs)
    : data?.faqs;
  const faqItems = Array.isArray(faqs) ? faqs : [];
  const area = settings?.location?.service_area || settings?.location?.state || "Gujarat, India";
  const isGu = lang === "gu";
  const homeName = isGu ? "હોમ" : "Home";
  const menuName = isGu ? "મેનુ" : "Menu";

  if (path === "/") {
    const description = isGu ? GU_SITE_DESCRIPTION : SITE_DESCRIPTION;
    const business = localBusinessFields(settings);
    return page({
      lang,
      title: isGu ? "ચિરાંશ ફૂડ્સ | અસલ ગુજરાતી શાકાહારી ભોજન" : "Chiransh Foods | Authentic Gujarati Vegetarian Food",
      description,
      path: localized("/"),
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FoodEstablishment",
        name: isGu ? "ચિરાંશ ફૂડ્સ" : SITE_NAME,
        description,
        url: canonicalUrl(localized("/")),
        image: absoluteAsset(DEFAULT_OG_IMAGE),
        servesCuisine: ["Gujarati", "Indian", "Street Food"],
        inLanguage: isGu ? "gu" : "en",
        areaServed: business.areaServed || { "@type": "AdministrativeArea", name: area },
        ...(business.telephone ? { telephone: business.telephone } : {}),
        ...(business.address ? { address: business.address } : {}),
        ...(business.openingHoursSpecification
          ? { openingHoursSpecification: business.openingHoursSpecification }
          : {}),
        sameAs: socialLinks(settings),
      },
    });
  }

  if (path === "/menu") {
    const sorted = [...products].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    return page({
      lang,
      title: isGu ? "મેનૂ — ચિરાંશ ફૂડ્સ | ગુજરાતી સ્ટ્રીટ ફૂડ" : "Menu — Chiransh Foods | Gujarati Street Food & More",
      description: isGu ? GU_MENU_DESCRIPTION : MENU_DESCRIPTION,
      path: localized("/menu"),
      jsonLd: graph([
        {
          "@type": "ItemList",
          name: isGu ? "ચિરાંશ ફૂડ્સ મેનૂ" : "Chiransh Foods menu",
          itemListElement: sorted.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: isGu && product.gujarati_name ? product.gujarati_name : product.name,
            url: canonicalUrl(localized(`/menu/${product.slug}`)),
          })),
        },
        breadcrumb([
          { name: homeName, path: localized("/") },
          { name: menuName, path: localized("/menu") },
        ]),
      ]),
    });
  }

  if (path.startsWith("/menu/")) {
    const slug = decodeURIComponent(path.slice("/menu/".length));
    const product = products.find((item) => item.slug === slug);
    const here = localized(path);
    if (!product) {
      return page({
        lang,
        title: isGu ? "પાનું મળ્યું નથી — ચિરાંશ ફૂડ્સ" : "Page not found — Chiransh Foods",
        description: isGu
          ? "આ પાનું મેનૂમાં નથી. ચિરાંશ ફૂડ્સના મેનૂ પર પાછા જાઓ."
          : "Looks like this plate is empty. Return to the Chiransh Foods menu.",
        path: here,
        noindex: true,
      });
    }
    const name = isGu && product.gujarati_name ? product.gujarati_name : product.name;
    const secondary = !isGu && product.gujarati_name ? ` (${product.gujarati_name})` : "";
    const shortDesc = isGu
      ? product.gujarati_short_description || product.gujarati_description || product.short_description || ""
      : product.short_description || product.description || "";
    const description = isGu
      ? `${shortDesc} ${name} ચિરાંશ ફૂડ્સની ૧૦૦% શાકાહારી વાનગી છે.`
      : `${shortDesc} ${product.name} is a 100% vegetarian ${String(product.category || "Gujarati").toLowerCase()} dish by Chiransh Foods, Gujarat.`;
    return page({
      lang,
      title: isGu ? `${name} — ચિરાંશ ફૂડ્સ` : `${product.name}${secondary} — Chiransh Foods`,
      description,
      path: localized(`/menu/${product.slug}`),
      image: product.image,
      type: "product",
      jsonLd: graph([
        {
          "@type": "Product",
          name,
          image: [absoluteAsset(product.image)],
          description: (isGu ? product.gujarati_description : product.description) || shortDesc,
          category: product.category,
          inLanguage: isGu ? "gu" : "en",
          brand: { "@type": "Organization", name: isGu ? "ચિરાંશ ફૂડ્સ" : SITE_NAME },
        },
        breadcrumb([
          { name: homeName, path: localized("/") },
          { name: menuName, path: localized("/menu") },
          { name, path: localized(`/menu/${product.slug}`) },
        ]),
      ]),
    });
  }

  const staticPages = {
    "/about": {
      title: isGu ? "અમારા વિશે — ચિરાંશ ફૂડ્સ | ગુજરાતી ફૂડની વાર્તા" : "About Us — Chiransh Foods | Our Gujarati Food Story",
      description: isGu
        ? "ચિરાંશ ફૂડ્સ ગુજરાત, ભારતની ઘરગથ્થુ ૧૦૦% શાકાહારી ગુજરાતી ફૂડ બ્રાન્ડ છે — ગુજરાતની સ્ટ્રીટ-ફૂડ સંસ્કૃતિના અસલ સ્વાદ તમારા ટેબલ સુધી લાવે છે."
        : "Chiransh Foods is a home-grown, 100% vegetarian Gujarati food brand from Gujarat, India — bringing the authentic flavours of Gujarat's street-food culture to your table.",
    },
    "/gallery": {
      title: isGu ? "ગેલેરી — ચિરાંશ ફૂડ્સ | ગુજરાતી ભોજન, મસાલા અને રસોડું" : "Gallery — Chiransh Foods | Gujarati Food, Spices & Kitchen",
      description: isGu
        ? "ચિરાંશ ફૂડ્સની અંદર એક નજર — અમારી ખાસ ગુજરાતી વાનગીઓ, તાજી સામગ્રી, હાથથી દળેલા મસાલા અને દરેક થાળી પાછળની કાળજી."
        : "A look inside Chiransh Foods — our signature Gujarati dishes, fresh ingredients, hand-ground spices and the care behind every plate.",
    },
    "/contact": {
      title: isGu ? "સંપર્ક અને ઓર્ડર — ચિરાંશ ફૂડ્સ | અમદાવાદ" : "Contact & Order — Chiransh Foods | Ahmedabad",
      description: isGu
        ? "અમદાવાદમાં ચિરાંશ ફૂડ્સનો ઓર્ડર કરો. પિકઅપ ફક્ત ફોન કોલથી, દરરોજ સવારે ૧૦ થી રાત્રે ૧૧. કોલ અથવા WhatsApp +91 91063 54619."
        : "Order Chiransh Foods in Ahmedabad. Pickup is by phone call, daily 10:00 AM to 11:00 PM IST. Call or WhatsApp +91 91063 54619.",
    },
    "/faq": {
      title: isGu ? "પ્રશ્નો — ચિરાંશ ફૂડ્સ | ગુજરાતી શાકાહારી ભોજન" : "FAQ — Chiransh Foods | Gujarati Vegetarian Food",
      description: isGu
        ? "ચિરાંશ ફૂડ્સ વિશે વારંવાર પૂછાતા પ્રશ્નો — ૧૦૦% શાકાહારી ગુજરાતી વાનગીઓ, બરોડા સ્ટાઇલ સેવ ઉસળ, તુવેર ટોઠા, ઓર્ડર અને ઉપલબ્ધતા."
        : "Frequently asked questions about Chiransh Foods — our 100% vegetarian Gujarati dishes, Baroda-style Sev Usal, Tuvar Totha, ordering and availability.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: isGu ? "gu" : "en",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    },
    "/privacy": {
      title: isGu ? "ગોપનીયતા નીતિ — ચિરાંશ ફૂડ્સ" : "Privacy Policy — Chiransh Foods",
      description: isGu
        ? "ચિરાંશ ફૂડ્સ પૂછપરછ ફોર્મ દ્વારા મળેલી માહિતી કેવી રીતે એકત્ર કરે છે, વાપરે છે અને સુરક્ષિત રાખે છે."
        : "How Chiransh Foods collects, uses and protects the information you share through our enquiry form.",
    },
    "/terms": {
      title: isGu ? "સેવાની શરતો — ચિરાંશ ફૂડ્સ" : "Terms & Conditions — Chiransh Foods",
      description: isGu
        ? "ચિરાંશ ફૂડ્સની વેબસાઇટ વાપરતી વખતે અને ઓર્ડરની પૂછપરછ કરતી વખતે લાગુ પડતી શરતો."
        : "The terms that apply when you use the Chiransh Foods website and place order enquiries with us.",
    },
    "/refund": {
      title: isGu ? "રિફંડ / રદ નીતિ — ચિરાંશ ફૂડ્સ" : "Refund / Cancellation Policy — Chiransh Foods",
      description: isGu
        ? "ચિરાંશ ફૂડ્સમાં ઓર્ડરમાં ફેરફાર, રદ અને રિફંડ કેવી રીતે સંભાળવામાં આવે છે."
        : "How order changes, cancellations and refunds are handled at Chiransh Foods.",
    },
  };

  const found = staticPages[path];
  if (found) {
    const here = localized(path);
    if (LEGAL_PATHS.has(path)) {
      return page({
        ...found,
        lang,
        path: here,
        canonicalPath: path,
        noindex: isGu,
        alternates: [],
      });
    }
    return page({ ...found, lang, path: here });
  }

  return page({
    lang,
    title: isGu ? "પાનું મળ્યું નથી — ચિરાંશ ફૂડ્સ" : "Page not found — Chiransh Foods",
    description: isGu
      ? "આ પાનું મેનૂમાં નથી. ચિરાંશ ફૂડ્સના મેનૂ પર પાછા જાઓ."
      : "Looks like this plate is empty. Return to the Chiransh Foods menu.",
    path: localized(path),
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
  const alternates = (seo.alternates || [])
    .map((alt) => `<link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}" />`)
    .join("\n    ");
  return [
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
    alternates,
    meta("name", "robots", seo.noindex ? "noindex, follow" : "index, follow"),
    meta("property", "og:title", seo.title),
    meta("property", "og:description", seo.description),
    meta("property", "og:type", seo.type || "website"),
    meta("property", "og:url", seo.canonical),
    meta("property", "og:site_name", SITE_NAME),
    meta("property", "og:image", seo.image),
    meta("property", "og:locale", seo.ogLocale || "en_IN"),
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
  const lang = seo.lang === "gu" ? "gu" : "en";
  let next = html.replace(/<html lang="[^"]*">/i, `<html lang="${lang}">`);
  next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
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
  return [home, menu, ...dishes, ...rest].flatMap((entry) => {
    const alternates = hreflangAlternates(entry.path);
    const langs = LEGAL_PATHS.has(entry.path) ? ["en"] : ["en", "gu"];
    return langs.map((lang) => ({
      loc: canonicalUrl(localePath(entry.path, lang)),
      lastmod: entry.lastmod || lastmod,
      changefreq: entry.changefreq,
      priority: entry.priority,
      alternates,
    }));
  });
}

function escapeXml(value) {
  return escapeHtml(value);
}

export function renderSitemap(products, lastmod = SITEMAP_LASTMOD) {
  const urls = sitemapEntries(products, lastmod)
    .map((entry) => {
      const links = (entry.alternates || [])
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(alt.hreflang)}" href="${escapeXml(alt.href)}" />`,
        )
        .join("\n");
      return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
${links ? `${links}\n` : ""}  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}
