export const SITE_NAME = "Chiransh Foods";
export const SITE_TAGLINE = "Authentic Gujarati Vegetarian Food";
export const SITE_DESCRIPTION =
  "Chiransh Foods is a 100% vegetarian Gujarati food brand from Gujarat, India — serving authentic street-food favourites like Baroda-style Sev Usal (સેવ ઉસળ) and Tuvar Totha.";

// Vite: VITE_BACKEND_URL is optional; empty => same-origin "/api" (proxied to the mock backend in dev).
export const API = `${import.meta.env.VITE_BACKEND_URL || ""}/api`;

export const DEFAULT_OG_IMAGE = "/images/og-image.jpg"; // optimized JPEG copy of the Sev Usal hero (social crawlers prefer JPEG)

/** Resolve a site-relative path (e.g. "/images/x.webp") to an absolute URL —
 *  og:image, twitter:image and JSON-LD "image" must be absolute. */
export function absUrl(u) {
  if (!u) return u;
  try {
    return new URL(u, window.location.origin).href;
  } catch {
    return u;
  }
}

export const MENU_CATEGORIES = ["Gujarati Street Food", "Fast Food", "Indian"];

export const CATEGORY_NOTES = {
  "Gujarati Street Food":
    "Our signature street-food dishes, made the Gujarati way.",
  "Fast Food": "Crowd-pleasing favourites are on the way.",
  Indian: "Classic Indian preparations are on the way.",
};

export const FALLBACK_SETTINGS = {
  key: "site",
  contact: { phone: null, whatsapp: null, email: null },
  location: {
    state: "Gujarat, India",
    city: null,
    locality: null,
    service_area: "Gujarat, India",
    address_public: null,
    maps_url: null,
    pickup_available: null,
    delivery_available: null,
    delivery_partners: [],
  },
  business_hours: {
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
    note: "Business hours will be announced soon. Please contact us for current availability.",
  },
  ordering: {
    mode: "contact",
    whatsapp_message_template:
      "Hello Chiransh Foods, I would like to order {product}.",
    online_ordering_url: null,
    zomato_url: null,
    swiggy_url: null,
  },
  social: { instagram: null, facebook: null, youtube: null, google_business: null },
  reviews: { enabled: false, note: "Customer reviews coming soon." },
  analytics: {
    google_analytics_id: null,
    google_search_console: null,
    meta_pixel_id: null,
  },
  domain: { canonical_base: null },
};

const IMG =
  "/images";

export const FALLBACK_PRODUCTS = [
  {
    name: "Baroda-style Sev Usal",
    gujarati_name: "સેવ ઉસળ",
    slug: "baroda-style-sev-usal",
    category: "Gujarati Street Food",
    short_description:
      "Vadodara's beloved street-food legend — slow-simmered spiced usal crowned with a generous heap of crunchy sev.",
    description:
      "A true taste of Vadodara's streets. Our Baroda-style Sev Usal is built on a hearty, slow-simmered spiced pea curry, ladled steaming hot and finished the Baroda way — a generous crown of crunchy sev, sharp onion, fresh coriander and a squeeze of lemon. Warming, filling and full of character, it is the dish Chiransh Foods is proud to be known for.",
    image: `${IMG}/d3b76fd97342f13594358947b448a9c10a2319e38042a72df4c09224ad05bb14.webp`,
    price: null,
    availability: "available",
    vegetarian: true,
    featured: true,
    badge: "Signature",
    ingredients: [],
    serving_info: "",
  },
  {
    name: "Tuvar Totha",
    gujarati_name: "તુવર તોથા",
    slug: "tuvar-totha",
    category: "Gujarati Street Food",
    short_description:
      "A rustic, heartwarming Gujarati street-style tuvar preparation — bold flavour, homestyle comfort.",
    description:
      "Tuvar Totha is a much-loved Gujarati street-food favourite — a rustic, curry-style preparation of tuvar (pigeon peas) cooked with warming Gujarati flavours and plenty of patience. Comforting, hearty and full of soul, it is homestyle Gujarat served hot.",
    image: `${IMG}/a16bc408c30ead3a4c7c8c653f1ea3bab08f7e28bf4de8cd1454704edd1a3b56.webp`,
    price: null,
    availability: "available",
    vegetarian: true,
    featured: true,
    badge: "Signature",
    ingredients: [],
    serving_info: "",
  },
];

export function priceLabel(price) {
  if (price === null || price === undefined || price === "") {
    return "Contact for current price";
  }
  return `₹ ${price}`;
}

export function whatsappUrl(settings, productName) {
  const number = settings?.contact?.whatsapp;
  if (!number) return null;
  if (productName) {
    const template =
      settings?.ordering?.whatsapp_message_template ||
      "Hello Chiransh Foods, I would like to order {product}.";
    const message = template.replace("{product}", productName).trim();
    return `https://wa.me/${String(number).replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${String(number).replace(/\D/g, "")}?text=${encodeURIComponent(
    "Hello Chiransh Foods, I would like to place an order.",
  )}`;
}
