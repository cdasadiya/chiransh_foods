import { productCopy } from "./productCopy.js";

export const CANONICAL_ORIGIN = "https://chiransh-foods.onrender.com";

const SITE_NAME = "Chiransh Foods";
const DEFAULT_OG_IMAGE = "/images/og-image.jpg";

export const LOCALES = [
  { code: "en", prefix: "", htmlLang: "en", ogLocale: "en_IN", label: "English", short: "EN" },
  { code: "gu", prefix: "/gu", htmlLang: "gu", ogLocale: "gu_IN", label: "ગુજરાતી", short: "GU" },
  { code: "hi", prefix: "/hi", htmlLang: "hi", ogLocale: "hi_IN", label: "हिन्दी", short: "HI" },
];

const PREFIXED = LOCALES.filter((locale) => locale.prefix).sort((a, b) => b.prefix.length - a.prefix.length);

export const PUBLIC_PATHS = ["/", "/menu", "/about", "/gallery", "/contact", "/faq", "/privacy", "/terms", "/refund"];

export function localeMeta(lang) {
  return LOCALES.find((locale) => locale.code === lang) || LOCALES[0];
}

export function normalizePath(pathname) {
  const raw = String(pathname || "/").split("?")[0].split("#")[0];
  if (raw === "" || raw === "/") return "/";
  return raw.replace(/\/+$/, "");
}

export function resolveCanonicalOrigin(settings) {
  const raw = typeof settings?.domain?.canonical_base === "string"
    ? settings.domain.canonical_base.trim().replace(/\/+$/, "")
    : "";
  if (/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(raw)) return raw;
  return CANONICAL_ORIGIN;
}

export function canonicalUrl(pathname, origin = CANONICAL_ORIGIN) {
  return `${origin}${normalizePath(pathname)}`;
}

export function splitLocale(pathname) {
  const path = normalizePath(pathname);
  for (const locale of PREFIXED) {
    if (path === locale.prefix) return { lang: locale.code, path: "/" };
    if (path.startsWith(`${locale.prefix}/`)) {
      return { lang: locale.code, path: normalizePath(path.slice(locale.prefix.length)) || "/" };
    }
  }
  return { lang: "en", path };
}

export function localePath(pathname, lang) {
  const bare = splitLocale(pathname).path;
  const locale = localeMeta(lang);
  if (!locale.prefix) return bare;
  return bare === "/" ? locale.prefix : `${locale.prefix}${bare}`;
}

export function hreflangAlternates(pathname, origin = CANONICAL_ORIGIN) {
  const { path } = splitLocale(pathname);
  return [
    ...LOCALES.map((locale) => ({
      hreflang: locale.htmlLang,
      href: canonicalUrl(localePath(path, locale.code), origin),
    })),
    { hreflang: "x-default", href: canonicalUrl(localePath(path, "en"), origin) },
  ];
}

export function isKnownPath(pathname, products = []) {
  const { path } = splitLocale(pathname);
  if (PUBLIC_PATHS.includes(path)) return true;
  if (!path.startsWith("/menu/")) return false;
  const slug = decodeURIComponent(path.slice("/menu/".length));
  if (!slug || slug.includes("/")) return false;
  return products.some((item) => item && item.slug === slug);
}

export function absoluteAsset(pathname, origin = CANONICAL_ORIGIN) {
  if (!pathname) return `${origin}${DEFAULT_OG_IMAGE}`;
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${path}`;
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

function breadcrumb(items, origin = CANONICAL_ORIGIN) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: canonicalUrl(item.path, origin) } : {}),
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
  origin = CANONICAL_ORIGIN,
}) {
  const locale = localeMeta(lang);
  return {
    title,
    description,
    canonical: canonicalUrl(canonicalPath || path, origin),
    image: absoluteAsset(image, origin),
    type,
    jsonLd,
    noindex,
    lang: locale.htmlLang,
    ogLocale: locale.ogLocale,
    alternates: alternates ?? (noindex ? [] : hreflangAlternates(path, origin)),
  };
}

const SEO = {
  en: {
    homeTitle: "Chiransh Foods | Authentic Gujarati Vegetarian Food in Ahmedabad",
    siteDescription:
      "Chiransh Foods serves authentic 100% vegetarian Gujarati food in Ahmedabad, including Baroda-style Sev Usal and Tuvar Totha for pickup.",
    menuTitle: "Menu — Chiransh Foods | Gujarati Street Food in Ahmedabad",
    menuDescription:
      "Explore the Chiransh Foods menu in Ahmedabad — 100% vegetarian Gujarati food: Sev Usal, Tuvar Totha, combos, Jain and Swaminarayan dishes, family packs, and drinks.",
    menuList: "Chiransh Foods menu",
    homeName: "Home",
    menuName: "Menu",
    brand: "Chiransh Foods",
    notFoundTitle: "Page not found — Chiransh Foods",
    notFoundDescription: "Looks like this plate is empty. Return to the Chiransh Foods menu.",
    productTitle: "{name} — Chiransh Foods",
    productDescription: "{short} {name} is a 100% vegetarian {category} dish from Chiransh Foods in Ahmedabad.",
    aboutTitle: "About Us — Chiransh Foods | Gujarati Food in Ahmedabad",
    aboutDescription:
      "Chiransh Foods is a home-grown, 100% vegetarian Gujarati food brand in Ahmedabad — bringing Gujarat's street-food flavours to your table.",
    galleryTitle: "Gallery — Chiransh Foods | Gujarati Food, Spices & Kitchen",
    galleryDescription:
      "A look inside Chiransh Foods in Ahmedabad — signature Gujarati dishes, fresh ingredients, hand-ground spices and the care behind every plate.",
    contactTitle: "Contact & Order — Chiransh Foods | Ahmedabad",
    contactDescription:
      "Order Chiransh Foods in Ahmedabad. Pickup is by phone call, daily 10:00 AM to 11:00 PM IST. Call or WhatsApp +91 91063 54619.",
    faqTitle: "FAQ — Chiransh Foods | Gujarati Vegetarian Food in Ahmedabad",
    faqDescription:
      "Questions about Chiransh Foods in Ahmedabad — vegetarian Gujarati dishes, Baroda-style Sev Usal, Tuvar Totha, pickup and ordering.",
    privacyTitle: "Privacy Policy — Chiransh Foods",
    privacyDescription: "How Chiransh Foods collects, uses and protects the information you share through our enquiry form.",
    termsTitle: "Terms & Conditions — Chiransh Foods",
    termsDescription: "The terms that apply when you use the Chiransh Foods website and place order enquiries with us.",
    refundTitle: "Refund / Cancellation Policy — Chiransh Foods",
    refundDescription: "How order changes, cancellations and refunds are handled at Chiransh Foods.",
  },
  gu: {
    homeTitle: "ચિરાંશ ફૂડ્સ | અમદાવાદમાં અસલ ગુજરાતી શાકાહારી ભોજન",
    siteDescription:
      "ચિરાંશ ફૂડ્સ અમદાવાદમાં ૧૦૦% શાકાહારી ગુજરાતી ભોજન પીરસે છે — બરોડા સ્ટાઇલ સેવ ઉસળ અને તુવેર ટોઠા, પિકઅપ માટે.",
    menuTitle: "મેનૂ — ચિરાંશ ફૂડ્સ | અમદાવાદની ગુજરાતી સ્ટ્રીટ ફૂડ",
    menuDescription:
      "અમદાવાદમાં ચિરાંશ ફૂડ્સનું મેનૂ જુઓ — સેવ ઉસળ, તુવેર ટોઠા, કોમ્બો, જૈન અને સ્વામિનારાયણ વાનગીઓ, ફેમિલી પેક અને પીણાં.",
    menuList: "ચિરાંશ ફૂડ્સ મેનૂ",
    homeName: "હોમ",
    menuName: "મેનુ",
    brand: "ચિરાંશ ફૂડ્સ",
    notFoundTitle: "પાનું મળ્યું નથી — ચિરાંશ ફૂડ્સ",
    notFoundDescription: "આ પાનું મેનૂમાં નથી. ચિરાંશ ફૂડ્સના મેનૂ પર પાછા જાઓ.",
    productTitle: "{name} — ચિરાંશ ફૂડ્સ",
    productDescription: "{short} {name} ચિરાંશ ફૂડ્સની અમદાવાદની ૧૦૦% શાકાહારી વાનગી છે.",
    aboutTitle: "અમારા વિશે — ચિરાંશ ફૂડ્સ | અમદાવાદ",
    aboutDescription:
      "ચિરાંશ ફૂડ્સ અમદાવાદની ઘરગથ્થુ ૧૦૦% શાકાહારી ગુજરાતી ફૂડ બ્રાન્ડ છે — ગુજરાતની સ્ટ્રીટ-ફૂડનો સ્વાદ તમારા ટેબલ સુધી લાવે છે.",
    galleryTitle: "ગેલેરી — ચિરાંશ ફૂડ્સ | ગુજરાતી ભોજન અને રસોડું",
    galleryDescription: "અમદાવાદની ચિરાંશ ફૂડ્સની અંદર એક નજર — ખાસ વાનગીઓ, તાજી સામગ્રી અને દરેક થાળી પાછળની કાળજી.",
    contactTitle: "સંપર્ક અને ઓર્ડર — ચિરાંશ ફૂડ્સ | અમદાવાદ",
    contactDescription:
      "અમદાવાદમાં ચિરાંશ ફૂડ્સનો ઓર્ડર કરો. પિકઅપ ફક્ત ફોન કોલથી, દરરોજ સવારે ૧૦ થી રાત્રે ૧૧. કોલ અથવા WhatsApp +91 91063 54619.",
    faqTitle: "પ્રશ્નો — ચિરાંશ ફૂડ્સ | અમદાવાદ",
    faqDescription: "અમદાવાદની ચિરાંશ ફૂડ્સ વિશે પ્રશ્નો — શાકાહારી ગુજરાતી વાનગીઓ, સેવ ઉસળ, તુવેર ટોઠા અને ઓર્ડર.",
    privacyTitle: "ગોપનીયતા નીતિ — ચિરાંશ ફૂડ્સ",
    privacyDescription: "ચિરાંશ ફૂડ્સ પૂછપરછ ફોર્મ દ્વારા મળેલી માહિતી કેવી રીતે એકત્ર કરે છે, વાપરે છે અને સુરક્ષિત રાખે છે.",
    termsTitle: "સેવાની શરતો — ચિરાંશ ફૂડ્સ",
    termsDescription: "ચિરાંશ ફૂડ્સની વેબસાઇટ વાપરતી વખતે અને ઓર્ડરની પૂછપરછ કરતી વખતે લાગુ પડતી શરતો.",
    refundTitle: "રિફંડ / રદ નીતિ — ચિરાંશ ફૂડ્સ",
    refundDescription: "ચિરાંશ ફૂડ્સમાં ઓર્ડરમાં ફેરફાર, રદ અને રિફંડ કેવી રીતે સંભાળવામાં આવે છે.",
  },
  hi: {
    homeTitle: "चिरांश फूड्स | अहमदाबाद में असली गुजराती शाकाहारी खाना",
    siteDescription:
      "चिरांश फूड्स अहमदाबाद में 100% शाकाहारी गुजराती खाना परोसता है — बड़ौदा स्टाइल सेव उसल और तूवर टोठा, पिकअप के लिए।",
    menuTitle: "मेनू — चिरांश फूड्स | अहमदाबाद का गुजराती स्ट्रीट फूड",
    menuDescription:
      "अहमदाबाद में चिरांश फूड्स का मेनू देखें — सेव उसल, तूवर टोठा, कॉम्बो, जैन और स्वामीनारायण व्यंजन, फैमिली पैक और पेय।",
    menuList: "चिरांश फूड्स मेनू",
    homeName: "होम",
    menuName: "मेनू",
    brand: "चिरांश फूड्स",
    notFoundTitle: "पेज नहीं मिला — चिरांश फूड्स",
    notFoundDescription: "यह पेज मेनू में नहीं है। चिरांश फूड्स के मेनू पर वापस जाएँ।",
    productTitle: "{name} — चिरांश फूड्स",
    productDescription: "{short} {name} चिरांश फूड्स की अहमदाबाद की 100% शाकाहारी डिश है।",
    aboutTitle: "हमारे बारे में — चिरांश फूड्स | अहमदाबाद",
    aboutDescription:
      "चिरांश फूड्स अहमदाबाद का घरेलू 100% शाकाहारी गुजराती फूड ब्रांड है — गुजरात के स्ट्रीट फूड का स्वाद आपकी थाली तक लाता है।",
    galleryTitle: "गैलरी — चिरांश फूड्स | गुजराती खाना और रसोई",
    galleryDescription: "अहमदाबाद के चिरांश फूड्स के अंदर एक नज़र — खास व्यंजन, ताज़ी सामग्री और हर थाली के पीछे की देखभाल।",
    contactTitle: "संपर्क और ऑर्डर — चिरांश फूड्स | अहमदाबाद",
    contactDescription:
      "अहमदाबाद में चिरांश फूड्स का ऑर्डर करें। पिकअप सिर्फ फोन कॉल से, रोज़ सुबह 10 से रात 11 बजे तक। कॉल या WhatsApp +91 91063 54619।",
    faqTitle: "सवाल — चिरांश फूड्स | अहमदाबाद",
    faqDescription: "अहमदाबाद के चिरांश फूड्स के बारे में सवाल — शाकाहारी गुजराती व्यंजन, सेव उसल, तूवर टोठा और ऑर्डर।",
    privacyTitle: "गोपनीयता नीति — चिरांश फूड्स",
    privacyDescription: "चिरांश फूड्स पूछताछ फॉर्म से मिली जानकारी कैसे इकट्ठा करता है, इस्तेमाल करता है और सुरक्षित रखता है।",
    termsTitle: "नियम और शर्तें — चिरांश फूड्स",
    termsDescription: "चिरांश फूड्स की वेबसाइट इस्तेमाल करते समय और ऑर्डर की पूछताछ करते समय लागू होने वाले नियम।",
    refundTitle: "रिफंड / रद्द नीति — चिरांश फूड्स",
    refundDescription: "चिरांश फूड्स में ऑर्डर में बदलाव, रद्दीकरण और रिफंड कैसे संभाले जाते हैं।",
  },
};

function text(lang, key) {
  return SEO[lang]?.[key] || SEO.en[key];
}

function fill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
}

function faqsFor(lang, data) {
  const preferred = lang === "gu" ? data?.faqsGu : lang === "hi" ? data?.faqsHi : data?.faqs;
  if (Array.isArray(preferred) && preferred.length) return preferred;
  return Array.isArray(data?.faqs) ? data.faqs : [];
}

export function getPageSeo(pathname, data) {
  const { lang, path } = splitLocale(pathname);
  const localized = (bare) => localePath(bare, lang);
  const products = Array.isArray(data?.products) ? data.products : [];
  const settings = data?.settings || {};
  const origin = resolveCanonicalOrigin(settings);
  const faqItems = faqsFor(lang, data);
  const area = settings?.location?.service_area || settings?.location?.state || "Ahmedabad, Gujarat, India";

  if (path === "/") {
    const description = text(lang, "siteDescription");
    const business = localBusinessFields(settings);
    return page({
      origin,
      lang,
      title: text(lang, "homeTitle"),
      description,
      path: localized("/"),
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FoodEstablishment",
        name: text(lang, "brand"),
        description,
        url: canonicalUrl(localized("/"), origin),
        image: absoluteAsset(DEFAULT_OG_IMAGE, origin),
        servesCuisine: ["Gujarati", "Indian", "Street Food"],
        inLanguage: lang,
        hasMenu: canonicalUrl(localized("/menu"), origin),
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
      origin,
      lang,
      title: text(lang, "menuTitle"),
      description: text(lang, "menuDescription"),
      path: localized("/menu"),
      jsonLd: graph([
        {
          "@type": "ItemList",
          name: text(lang, "menuList"),
          itemListElement: sorted.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: productCopy(product, lang).name,
            url: canonicalUrl(localized(`/menu/${product.slug}`), origin),
          })),
        },
        breadcrumb([
          { name: text(lang, "homeName"), path: localized("/") },
          { name: text(lang, "menuName"), path: localized("/menu") },
        ], origin),
      ]),
    });
  }

  if (path.startsWith("/menu/")) {
    const slug = decodeURIComponent(path.slice("/menu/".length));
    const product = products.find((item) => item.slug === slug);
    const here = localized(path);
    if (!product || slug.includes("/")) {
      return page({
        origin,
        lang,
        title: text(lang, "notFoundTitle"),
        description: text(lang, "notFoundDescription"),
        path: here,
        noindex: true,
      });
    }
    const copy = productCopy(product, lang);
    const guName = productCopy(product, "gu").name;
    const titleName = lang === "en" && guName && guName !== copy.name ? `${copy.name} (${guName})` : copy.name;
    const category = String(product.category || "Gujarati").toLowerCase();
    return page({
      origin,
      lang,
      title: fill(text(lang, "productTitle"), { name: titleName }),
      description: fill(text(lang, "productDescription"), {
        short: copy.short_description,
        name: copy.name,
        category,
      }),
      path: localized(`/menu/${product.slug}`),
      image: product.image,
      type: "product",
      jsonLd: graph([
        {
          "@type": "Product",
          name: copy.name,
          image: [absoluteAsset(product.image, origin)],
          description: copy.description || copy.short_description,
          category: product.category,
          inLanguage: lang,
          brand: { "@type": "Organization", name: text(lang, "brand") },
        },
        breadcrumb([
          { name: text(lang, "homeName"), path: localized("/") },
          { name: text(lang, "menuName"), path: localized("/menu") },
          { name: copy.name, path: localized(`/menu/${product.slug}`) },
        ], origin),
      ]),
    });
  }

  const staticPages = {
    "/about": ["aboutTitle", "aboutDescription"],
    "/gallery": ["galleryTitle", "galleryDescription"],
    "/contact": ["contactTitle", "contactDescription"],
    "/faq": ["faqTitle", "faqDescription"],
    "/privacy": ["privacyTitle", "privacyDescription"],
    "/terms": ["termsTitle", "termsDescription"],
    "/refund": ["refundTitle", "refundDescription"],
  };

  const found = staticPages[path];
  if (found) {
    const here = localized(path);
    const jsonLd = path === "/faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: lang,
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : undefined;
    return page({
      origin,
      lang,
      title: text(lang, found[0]),
      description: text(lang, found[1]),
      path: here,
      jsonLd,
    });
  }

  return page({
    origin,
    lang,
    title: text(lang, "notFoundTitle"),
    description: text(lang, "notFoundDescription"),
    path: localized(path),
    noindex: true,
  });
}

export function escapeHtml(value) {
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

export function renderSeoTags(seo, nonce) {
  const nonceAttr = nonce ? ` nonce="${escapeHtml(nonce)}"` : "";
  const json = seo.jsonLd
    ? `<script type="application/ld+json"${nonceAttr}>${JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c")}</script>`
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

export function applySeoToHtml(html, pathname, data, options = {}) {
  const seo = getPageSeo(pathname, data);
  const locale = localeMeta(seo.lang);
  let next = html.replace(/<html lang="[^"]*">/i, `<html lang="${locale.htmlLang}">`);
  next = next.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  next = next.replace(
    /<meta\s+name="description"[\s\S]*?>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  return next.replace("</head>", `    ${renderSeoTags(seo, options.nonce)}\n  </head>`);
}

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

export function sitemapEntries(products, lastmod = SITEMAP_LASTMOD, settings) {
  const origin = resolveCanonicalOrigin(settings);
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
    const alternates = hreflangAlternates(entry.path, origin);
    return LOCALES.map((locale) => ({
      loc: canonicalUrl(localePath(entry.path, locale.code), origin),
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

export function renderRobots(settings) {
  const origin = resolveCanonicalOrigin(settings);
  return `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
}

export function renderSitemap(products, lastmod = SITEMAP_LASTMOD, settings) {
  const urls = sitemapEntries(products, lastmod, settings)
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
