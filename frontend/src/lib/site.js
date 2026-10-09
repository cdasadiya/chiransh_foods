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

export const BULK_CATEGORY = "Family & Bulk Orders";

export const MENU_CATEGORIES = [
  "Sev Usal (Regular)",
  "Tuvar Totha (Regular)",
  "Combos (Regular)",
  "Jain & Swaminarayan",
  "Family & Party Packs (Regular)",
  BULK_CATEGORY,
  "Extras (Regular)",
  "Beverages"
];

export const INSTRUCTION_CATEGORIES = [
  "Family & Party Packs (Regular)",
  BULK_CATEGORY,
];

export function showsBulkInstructions(category) {
  return INSTRUCTION_CATEGORIES.includes(category);
}

export const CATEGORY_NOTES = {
  "Sev Usal (Regular)": "Our signature Baroda-style street food legend.",
  "Tuvar Totha (Regular)": "A rustic, heartwarming Gujarati tuvar preparation.",
  "Combos (Regular)": "The best of both worlds on a single plate.",
  "Jain & Swaminarayan": "Separate recipes made with strict adherence to Jain and Swaminarayan rules (no onion, no garlic, no root veg).",
  "Family & Party Packs (Regular)": "Larger packs for home and gatherings.",
  [BULK_CATEGORY]: "Advance orders for 5 to 200 persons. Book by call or WhatsApp.",
  "Extras (Regular)": "Add-ons and sides to complete your meal.",
  "Beverages": "Refreshing drinks to pair with spicy flavors."
};

export const FALLBACK_SETTINGS = {
  key: "site",
  contact: {
    phone: "+919106354619",
    phone_display: "+91 91063 54619",
    whatsapp: "919106354619",
    email: null,
  },
  location: {
    state: "Gujarat",
    country: "India",
    city: "Ahmedabad",
    locality: null,
    service_area: "Ahmedabad, Gujarat, India",
    areas: [
      "New Ranip",
      "Ranip",
      "Nirnay Nagar",
      "Chandlodiya",
      "Chandkheda",
      "Vandemataram",
      "New Vadaj",
      "Jagat Pur",
      "Godrej Garden City",
      "Charodi",
    ],
    address_public: null,
    maps_url: null,
    pickup_available: true,
    delivery_available: null,
    delivery_partners: [],
  },
  business_hours: {
    monday: "10:00 AM – 11:00 PM",
    tuesday: "10:00 AM – 11:00 PM",
    wednesday: "10:00 AM – 11:00 PM",
    thursday: "10:00 AM – 11:00 PM",
    friday: "10:00 AM – 11:00 PM",
    saturday: "10:00 AM – 11:00 PM",
    sunday: "10:00 AM – 11:00 PM",
    opens: "10:00",
    closes: "23:00",
    timezone: "Asia/Kolkata",
    note: "Open daily, 10:00 AM to 11:00 PM IST. For any other plan, call or WhatsApp +91 91063 54619.",
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
  domain: { canonical_base: "https://chiransh-foods.onrender.com" },
};

const IMG = "/images";

export const FALLBACK_PRODUCTS = [
  {
    "name": "Baroda-Style Sev Usal",
    "gujarati_name": "બરોડા સ્ટાઇલ સેવ ઉસળ",
    "slug": "baroda-style-sev-usal",
    "category": "Sev Usal (Regular)",
    "description": "Spicy Baroda-style usal topped with crunchy sev. Made in our home kitchen in Ahmedabad. Regular recipe. For a no-onion, no-garlic version, see Jain & Swaminarayan.",
    "short_description": "Vadodara's beloved street-food legend — slow-simmered spiced usal crowned with a generous heap of crunchy sev.",
    "image": `${IMG}/sev_usal_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": true,
    "sort_order": 1,
    "badge": "Signature",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "તીખું અને ચટપટું બરોડા સ્ટાઇલ ઉસળ, સાથે ક્રન્ચી સેવ. અમદાવાદમાં અમારા રસોડામાં બનેલું. રેગ્યુલર રેસીપી. જૈન અને સ્વામિનારાયણ માટે અલગ વિકલ્પ ઉપલબ્ધ છે.",
    "gujarati_short_description": "વડોદરાનું પ્રખ્યાત સ્ટ્રીટ-ફૂડ — ધીમા તાપે પકવેલું મસાલેદાર ઉસળ અને ક્રન્ચી સેવ."
  },
  {
    "name": "Sev Usal with Pav",
    "gujarati_name": "સેવ ઉસળ પાઉં સાથે",
    "slug": "sev-usal-with-pav",
    "category": "Sev Usal (Regular)",
    "description": "Baroda-style sev usal served with soft pav, onion and lemon. Regular recipe. Pick your spice level.",
    "short_description": "Baroda-style sev usal served with soft pav, onion and lemon.",
    "image": `${IMG}/sev_usal_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": true,
    "sort_order": 2,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "બરોડા સ્ટાઇલ સેવ ઉસળ સાથે નરમ પાઉં, ડુંગળી અને લીંબુ. રેગ્યુલર રેસીપી. તમારી પસંદ મુજબ તીખાશ.",
    "gujarati_short_description": "બરોડા સ્ટાઇલ સેવ ઉસળ સાથે નરમ પાઉં, ડુંગળી અને લીંબુ."
  },
  {
    "name": "Sev Usal Take-Home Pack",
    "gujarati_name": "સેવ ઉસળ ટેક-હોમ પેક",
    "slug": "sev-usal-take-home-pack",
    "category": "Sev Usal (Regular)",
    "description": "Sev usal packed to take home, with the sev packed separately so it stays crunchy. Pav, onion-coriander and lemon on the side. Regular recipe. Pick your spice level.",
    "short_description": "Sev usal packed to take home, with the sev packed separately so it stays crunchy.",
    "image": `${IMG}/sev_usal_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 3,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "સેવ ઉસળ ટેક-હોમ પેક, જેમાં સેવ અલગથી પેક કરવામાં આવે છે જેથી તે ક્રન્ચી રહે. સાથે પાઉં, ડુંગળી-ધાણા અને લીંબુ. રેગ્યુલર રેસીપી.",
    "gujarati_short_description": "ઘરે લઈ જવા માટે સેવ ઉસળ પેક, સેવ અલગથી પેક કરવામાં આવે છે જેથી તે ક્રન્ચી રહે."
  },
  {
    "name": "Tuvar Totha",
    "gujarati_name": "તુવેર ટોઠા",
    "slug": "tuvar-totha",
    "category": "Tuvar Totha (Regular)",
    "description": "Gujarati tuvar totha: dried tuvar cooked in a spicy masala gravy. Made in our home kitchen in Ahmedabad. Regular recipe. For a no-onion, no-garlic version, see Jain & Swaminarayan.",
    "short_description": "A rustic, heartwarming Gujarati street-style tuvar preparation — bold flavour, homestyle comfort.",
    "image": `${IMG}/tuvar_totha_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": true,
    "sort_order": 4,
    "badge": "Signature",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "મહેસાણાની શિયાળાની ખાસ વાનગી. તુવેરના દાણાને લીલી ડુંગળી, લસણ અને મસાલા સાથે ધીમા તાપે રાંધવામાં આવે છે. રેગ્યુલર રેસીપી. જૈન અને સ્વામિનારાયણ માટે અલગ વિકલ્પ ઉપલબ્ધ છે.",
    "gujarati_short_description": "ઉત્તર ગુજરાતની શિયાળાની પ્રખ્યાત વાનગી — મસાલેદાર અને સ્વાદિષ્ટ તુવેર ટોઠા."
  },
  {
    "name": "Tuvar Totha with Pav",
    "gujarati_name": "તુવેર ટોઠા પાઉં સાથે",
    "slug": "tuvar-totha-with-pav",
    "category": "Tuvar Totha (Regular)",
    "description": "Spicy Gujarati tuvar totha served with soft pav, onion and lemon. Regular recipe. Pick your spice level.",
    "short_description": "Spicy Gujarati tuvar totha served with soft pav, onion and lemon.",
    "image": `${IMG}/tuvar_totha_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": true,
    "sort_order": 5,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "મસાલેદાર તુવેર ટોઠા સાથે ૨ નરમ પાઉં, લીલી ડુંગળી અને લીંબુ. રેગ્યુલર રેસીપી. તમારી પસંદ મુજબ તીખાશ.",
    "gujarati_short_description": "મસાલેદાર તુવેર ટોઠા સાથે નરમ પાઉં, ડુંગળી અને લીંબુ."
  },
  {
    "name": "Sev Usal and Tuvar Totha Combo Plate",
    "gujarati_name": "સેવ ઉસળ અને તુવેર ટોઠા કોમ્બો પ્લેટ",
    "slug": "sev-usal-tuvar-totha-combo-plate",
    "category": "Combos (Regular)",
    "description": "Sev usal and tuvar totha on one plate, with pav, onion and lemon. Serves 1. Regular recipe. Pick your spice level.",
    "short_description": "Sev usal and tuvar totha on one plate, with pav, onion and lemon.",
    "image": `${IMG}/combo_plate_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 6,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "સેવ ઉસળ અને તુવેર ટોઠા એક જ પ્લેટમાં, સાથે પાઉં, ડુંગળી અને લીંબુ. ૧ વ્યક્તિ માટે. રેગ્યુલર રેસીપી.",
    "gujarati_short_description": "સેવ ઉસળ અને તુવેર ટોઠા એક જ પ્લેટમાં, સાથે પાઉં, ડુંગળી અને લીંબુ."
  },
  {
    "name": "Jain Sev Usal",
    "gujarati_name": "જૈન સેવ ઉસળ",
    "slug": "jain-sev-usal",
    "category": "Jain & Swaminarayan",
    "description": "Baroda-style sev usal made Jain style: no onion, no garlic and no root vegetables. Topped with crunchy sev, with lemon on the side. Served without pav. Pick your spice level.",
    "short_description": "Baroda-style sev usal made Jain style: no onion, no garlic and no root vegetables.",
    "image": `${IMG}/jain_sev_usal.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 7,
    "badge": "Jain",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "બરોડા સ્ટાઇલ સેવ ઉસળ જૈન રીત મુજબ: ડુંગળી, લસણ કે કંદમૂળ વગર. ઉપરથી ક્રન્ચી સેવ અને લીંબુ. પાઉં વગર પીરસવામાં આવે છે. તમારી પસંદ મુજબ તીખાશ.",
    "gujarati_short_description": "બરોડા સ્ટાઇલ સેવ ઉસળ જૈન રીત મુજબ: ડુંગળી, લસણ કે કંદમૂળ વગર."
  },
  {
    "name": "Jain Tuvar Totha",
    "gujarati_name": "જૈન તુવેર ટોઠા",
    "slug": "jain-tuvar-totha",
    "category": "Jain & Swaminarayan",
    "description": "Gujarati tuvar totha made Jain style: no onion, no garlic and no root vegetables, in a spicy masala gravy. Served without pav. Pick your spice level.",
    "short_description": "Gujarati tuvar totha made Jain style: no onion, no garlic and no root vegetables.",
    "image": `${IMG}/jain_tuvar_totha.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 8,
    "badge": "Jain",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "મહેસાણાના તુવેર ટોઠા જૈન રીત મુજબ: ડુંગળી, લસણ કે કંદમૂળ વગર. જાડી અને સ્વાદિષ્ટ ગ્રેવી. પાઉં વગર પીરસવામાં આવે છે.",
    "gujarati_short_description": "મહેસાણાના તુવેર ટોઠા જૈન રીત મુજબ: ડુંગળી, લસણ કે કંદમૂળ વગર."
  },
  {
    "name": "Swaminarayan Sev Usal",
    "gujarati_name": "સ્વામિનારાયણ સેવ ઉસળ",
    "slug": "swaminarayan-sev-usal",
    "category": "Jain & Swaminarayan",
    "description": "Baroda-style sev usal made Swaminarayan style: no onion and no garlic. Topped with crunchy sev, with lemon on the side. Served without pav. Pick your spice level.",
    "short_description": "Baroda-style sev usal made Swaminarayan style: no onion and no garlic.",
    "image": `${IMG}/jain_sev_usal.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 9,
    "badge": "Swaminarayan",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "બરોડા સ્ટાઇલ સેવ ઉસળ સ્વામિનારાયણ રીત મુજબ: ડુંગળી અને લસણ વગર. ઉપરથી ક્રન્ચી સેવ અને લીંબુ. પાઉં વગર પીરસવામાં આવે છે.",
    "gujarati_short_description": "બરોડા સ્ટાઇલ સેવ ઉસળ સ્વામિનારાયણ રીત મુજબ: ડુંગળી અને લસણ વગર."
  },
  {
    "name": "Swaminarayan Tuvar Totha",
    "gujarati_name": "સ્વામિનારાયણ તુવેર ટોઠા",
    "slug": "swaminarayan-tuvar-totha",
    "category": "Jain & Swaminarayan",
    "description": "Gujarati tuvar totha made Swaminarayan style: no onion and no garlic, in a spicy masala gravy. Served without pav. Pick your spice level.",
    "short_description": "Gujarati tuvar totha made Swaminarayan style: no onion and no garlic.",
    "image": `${IMG}/jain_tuvar_totha.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 10,
    "badge": "Swaminarayan",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "મહેસાણાના તુવેર ટોઠા સ્વામિનારાયણ રીત મુજબ: ડુંગળી અને લસણ વગર. જાડી અને સ્વાદિષ્ટ ગ્રેવી. પાઉં વગર પીરસવામાં આવે છે.",
    "gujarati_short_description": "મહેસાણાના તુવેર ટોઠા સ્વામિનારાયણ રીત મુજબ: ડુંગળી અને લસણ વગર."
  },
  {
    "name": "Sev Usal Family and Party Pack",
    "gujarati_name": "સેવ ઉસળ ફેમિલી / પાર્ટી પેક",
    "slug": "sev-usal-family-party-pack",
    "category": "Family & Party Packs (Regular)",
    "description": "Sev usal in family and party sizes, with the sev packed separately so it stays crunchy. Pav, onion and lemon on the side. Regular recipe. Pick the size and spice level.",
    "short_description": "Sev usal in family and party sizes, with the sev packed separately so it stays crunchy.",
    "image": `${IMG}/sev_usal_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 11,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "ફેમિલી અને પાર્ટી સાઇઝમાં સેવ ઉસળ, સેવ અલગથી પેક કરવામાં આવે છે જેથી તે ક્રન્ચી રહે. સાથે પાઉં, ડુંગળી અને લીંબુ. રેગ્યુલર રેસીપી.",
    "gujarati_short_description": "ફેમિલી અને પાર્ટી સાઇઝમાં સેવ ઉસળ, સેવ અલગથી પેક કરવામાં આવે છે."
  },
  {
    "name": "Tuvar Totha Family and Party Pack",
    "gujarati_name": "તુવેર ટોઠા ફેમિલી / પાર્ટી પેક",
    "slug": "tuvar-totha-family-party-pack",
    "category": "Family & Party Packs (Regular)",
    "description": "Gujarati tuvar totha in family and party sizes, with pav, onion and lemon on the side. Regular recipe. Pick the size and spice level.",
    "short_description": "Gujarati tuvar totha in family and party sizes, with pav, onion and lemon on the side.",
    "image": `${IMG}/tuvar_totha_with_chutney.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 12,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "ફેમિલી અને પાર્ટી સાઇઝમાં તુવેર ટોઠા. સાથે પાઉં, લીલી ડુંગળી અને લીંબુ. રેગ્યુલર રેસીપી.",
    "gujarati_short_description": "ફેમિલી અને પાર્ટી સાઇઝમાં તુવેર ટોઠા, શિયાળાની પાર્ટીઓ માટે ઉત્તમ."
  },
  {
    "name": "Pav (2 Pcs)",
    "gujarati_name": "પાઉં (૨ નંગ)",
    "slug": "pav-2-pcs",
    "category": "Extras (Regular)",
    "description": "Two soft pav to go with sev usal or tuvar totha.",
    "short_description": "Two soft pav to go with sev usal or tuvar totha.",
    "image": `${IMG}/og-image.jpg`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 13,
    "badge": "",
    "ingredients": [],
    "serving_info": ""
  },
  {
    "name": "Butter Pav (2 Pcs)",
    "gujarati_name": "બટર પાઉં (૨ નંગ)",
    "slug": "butter-pav-2-pcs",
    "category": "Extras (Regular)",
    "description": "Two soft pav toasted with butter.",
    "short_description": "Two soft pav toasted with butter.",
    "image": `${IMG}/og-image.jpg`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 14,
    "badge": "",
    "ingredients": [],
    "serving_info": ""
  },
  {
    "name": "Masala Chaas",
    "gujarati_name": "મસાલા છાશ",
    "slug": "masala-chaas",
    "category": "Beverages",
    "description": "Spiced Gujarati buttermilk, [200 ml].",
    "short_description": "Spiced Gujarati buttermilk.",
    "image": `${IMG}/og-image.jpg`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 15,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "ઠંડી અને મસાલેદાર છાશ, તીખાશને સંતુલિત કરવા માટે ઉત્તમ.",
    "gujarati_short_description": "ઠંડી અને મસાલેદાર છાશ."
  },
  {
    "name": "Packaged Drinking Water",
    "gujarati_name": "પેકેજ્ડ પીવાનું પાણી",
    "slug": "packaged-drinking-water",
    "category": "Beverages",
    "description": "Sealed bottle of packaged drinking water, [500 ml / 1 L].",
    "short_description": "Sealed bottle of packaged drinking water.",
    "image": `${IMG}/og-image.jpg`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 16,
    "badge": "",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "૫૦૦ મિલી પેકેજ્ડ પીવાનું પાણી.",
    "gujarati_short_description": "૫૦૦ મિલી પેકેજ્ડ પીવાનું પાણી."
  },
  {
    "name": "Bhaji Pav",
    "gujarati_name": "ભાજી પાવ",
    "slug": "bhaji-pav",
    "category": BULK_CATEGORY,
    "description": "Soft buttered pav with a spiced vegetable bhaji, prepared fresh for advance orders.",
    "short_description": "Soft buttered pav with a spiced vegetable bhaji, prepared fresh for advance orders.",
    "image": `${IMG}/bhaji_pav.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 17,
    "badge": "Advance order",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "મસાલેદાર શાકની ભાજી સાથે બટરવાળા નરમ પાવ, અગાઉથી ઓર્ડર માટે તાજું તૈયાર.",
    "gujarati_short_description": "મસાલેદાર શાકની ભાજી સાથે બટરવાળા નરમ પાવ, અગાઉથી ઓર્ડર માટે તાજું તૈયાર."
  },
  {
    "name": "Khada Pav Bhaji",
    "gujarati_name": "ખાડા પાવ ભાજી",
    "slug": "khada-pav-bhaji",
    "category": BULK_CATEGORY,
    "description": "Chunky vegetable bhaji, kept in pieces rather than mashed, served with pav.",
    "short_description": "Chunky vegetable bhaji, kept in pieces rather than mashed, served with pav.",
    "image": `${IMG}/khada_pav_bhaji.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 18,
    "badge": "Advance order",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "કચડ્યા વગર ટુકડામાં રાંધેલી શાકની ભાજી, પાવ સાથે.",
    "gujarati_short_description": "કચડ્યા વગર ટુકડામાં રાંધેલી શાકની ભાજી, પાવ સાથે."
  },
  {
    "name": "Masala Pav",
    "gujarati_name": "મસાલા પાવ",
    "slug": "masala-pav",
    "category": BULK_CATEGORY,
    "description": "Pav tossed with a spicy masala, a street-style snack for gatherings.",
    "short_description": "Pav tossed with a spicy masala, a street-style snack for gatherings.",
    "image": `${IMG}/masala_pav.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 19,
    "badge": "Advance order",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "મસાલામાં લપેટેલા તીખા પાવ, મેળાવડા માટે સ્ટ્રીટ-સ્ટાઇલ નાસ્તો.",
    "gujarati_short_description": "મસાલામાં લપેટેલા તીખા પાવ, મેળાવડા માટે સ્ટ્રીટ-સ્ટાઇલ નાસ્તો."
  },
  {
    "name": "Pulav",
    "gujarati_name": "પુલાવ",
    "slug": "pulav",
    "category": BULK_CATEGORY,
    "description": "Fragrant vegetable pulav, cooked for family gatherings and events.",
    "short_description": "Fragrant vegetable pulav, cooked for family gatherings and events.",
    "image": `${IMG}/pulav.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 20,
    "badge": "Advance order",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "સુગંધી શાકનું પુલાવ, કુટુંબ મેળાવડા અને ઇવેન્ટ માટે.",
    "gujarati_short_description": "સુગંધી શાકનું પુલાવ, કુટુંબ મેળાવડા અને ઇવેન્ટ માટે."
  },
  {
    "name": "Kutchi Dabeli",
    "gujarati_name": "કચ્છી દાબેલી",
    "slug": "kutchi-dabeli",
    "category": BULK_CATEGORY,
    "description": "Kutchi-style dabeli with a spiced potato filling in pav.",
    "short_description": "Kutchi-style dabeli with a spiced potato filling in pav.",
    "image": `${IMG}/kutchi_dabeli.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 21,
    "badge": "Advance order",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "કચ્છી રીતનું દાબેલી, મસાલેદાર બટાકાની ભરણીવાળા પાવ.",
    "gujarati_short_description": "કચ્છી રીતનું દાબેલી, મસાલેદાર બટાકાની ભરણીવાળા પાવ."
  },
  {
    "name": "Ragda Pattice",
    "gujarati_name": "રગડા પેટીસ",
    "slug": "ragda-pattice",
    "category": BULK_CATEGORY,
    "description": "Potato patties with spiced white-pea ragda and chutney.",
    "short_description": "Potato patties with spiced white-pea ragda and chutney.",
    "image": `${IMG}/ragda_pattice.webp`,
    "price": null,
    "availability": "available",
    "vegetarian": true,
    "featured": false,
    "sort_order": 22,
    "badge": "Advance order",
    "ingredients": [],
    "serving_info": "",
    "gujarati_description": "બટાકાના પેટીસ સાથે મસાલેદાર સફેદ વટાણાનો રગડા અને ચટણી.",
    "gujarati_short_description": "બટાકાના પેટીસ સાથે મસાલેદાર સફેદ વટાણાનો રગડા અને ચટણી."
  }
];

export function priceLabel(price) {
  if (price === null || price === undefined || price === "") {
    return "Contact for current price";
  }
  return `₹ ${price}`;
}

export function whatsappUrl(settings, productName, messageOverride) {
  const number = settings?.contact?.whatsapp;
  if (!number) return null;
  const digits = String(number).replace(/\D/g, "");
  if (messageOverride) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(messageOverride)}`;
  }
  if (productName) {
    const template =
      settings?.ordering?.whatsapp_message_template ||
      "Hello Chiransh Foods, I would like to order {product}.";
    const message = template.replace("{product}", productName).trim();
    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    "Hello Chiransh Foods, I would like to place an order.",
  )}`;
}
