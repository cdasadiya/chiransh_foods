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

export const MENU_CATEGORIES = [
  "Sev Usal (Regular)",
  "Tuvar Totha (Regular)",
  "Combos (Regular)",
  "Jain & Swaminarayan",
  "Family & Party Packs (Regular)",
  "Extras (Regular)",
  "Beverages"
];

export const CATEGORY_NOTES = {
  "Sev Usal (Regular)": "Our signature Baroda-style street food legend.",
  "Tuvar Totha (Regular)": "A rustic, heartwarming Gujarati tuvar preparation.",
  "Combos (Regular)": "The best of both worlds on a single plate.",
  "Jain & Swaminarayan": "Separate recipes made with strict adherence to Jain and Swaminarayan rules (no onion, no garlic, no root veg).",
  "Family & Party Packs (Regular)": "Larger packs for home and gatherings.",
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
    "hindi_name": "बड़ौदा स्टाइल सेव उसल",
    "hindi_description": "तीखा बड़ौदा स्टाइल उसल, ऊपर कुरकुरी सेव। अहमदाबाद की हमारी रसोई में बना। रेगुलर रेसिपी। बिना प्याज़-लहसुन के लिए जैन और स्वामीनारायण देखें।",
    "hindi_short_description": "वडोदरा का प्यारा स्ट्रीट फूड — धीमी आँच का मसालेदार उसल और ढेर सारी कुरकुरी सेव।",
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
    "hindi_name": "सेव उसल पाव के साथ",
    "hindi_description": "बड़ौदा स्टाइल सेव उसल, नरम पाव, प्याज़ और नींबू के साथ। रेगुलर रेसिपी। तीखापन अपनी पसंद का चुनें।",
    "hindi_short_description": "बड़ौदा स्टाइल सेव उसल, नरम पाव, प्याज़ और नींबू के साथ।",
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
    "hindi_name": "सेव उसल टेक-होम पैक",
    "hindi_description": "घर ले जाने का सेव उसल। सेव अलग पैक होती है ताकि कुरकुरी रहे। साथ में पाव, प्याज़-धनिया और नींबू। रेगुलर रेसिपी।",
    "hindi_short_description": "घर ले जाने का सेव उसल, सेव अलग पैक ताकि कुरकुरी रहे।",
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
    "hindi_name": "तूवर टोठा",
    "hindi_description": "गुजराती तूवर टोठा: सूखी तूवर मसालेदार ग्रेवी में। अहमदाबाद की रसोई में बना। रेगुलर रेसिपी। बिना प्याज़-लहसुन के लिए जैन और स्वामीनारायण देखें।",
    "hindi_short_description": "देहाती, सुकूनभरा गुजराती तूवर — तीखा स्वाद, घर जैसा आराम।",
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
    "hindi_name": "तूवर टोठा पाव के साथ",
    "hindi_description": "तीखा गुजराती तूवर टोठा, नरम पाव, प्याज़ और नींबू के साथ। रेगुलर रेसिपी। तीखापन चुनें।",
    "hindi_short_description": "तीखा गुजराती तूवर टोठा, नरम पाव, प्याज़ और नींबू के साथ।",
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
    "hindi_name": "सेव उसल और तूवर टोठा कॉम्बो प्लेट",
    "hindi_description": "एक प्लेट में सेव उसल और तूवर टोठा, पाव, प्याज़ और नींबू के साथ। एक व्यक्ति के लिए। रेगुलर रेसिपी।",
    "hindi_short_description": "एक प्लेट में सेव उसल और तूवर टोठा, पाव, प्याज़ और नींबू के साथ।",
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
    "hindi_name": "जैन सेव उसल",
    "hindi_description": "बड़ौदा स्टाइल सेव उसल जैन तरीके से: बिना प्याज़, लहसुन और कंदमूल। ऊपर कुरकुरी सेव, साथ में नींबू। पाव के बिना।",
    "hindi_short_description": "बड़ौदा स्टाइल सेव उसल जैन तरीके से: बिना प्याज़, लहसुन और कंदमूल।",
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
    "hindi_name": "जैन तूवर टोठा",
    "hindi_description": "गुजराती तूवर टोठा जैन तरीके से: बिना प्याज़, लहसुन और कंदमूल, मसालेदार ग्रेवी में। पाव के बिना।",
    "hindi_short_description": "गुजराती तूवर टोठा जैन तरीके से: बिना प्याज़, लहसुन और कंदमूल।",
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
    "hindi_name": "स्वामीनारायण सेव उसल",
    "hindi_description": "बड़ौदा स्टाइल सेव उसल स्वामीनारायण तरीके से: बिना प्याज़ और लहसुन। ऊपर कुरकुरी सेव और नींबू। पाव के बिना।",
    "hindi_short_description": "बड़ौदा स्टाइल सेव उसल स्वामीनारायण तरीके से: बिना प्याज़ और लहसुन।",
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
    "hindi_name": "स्वामीनारायण तूवर टोठा",
    "hindi_description": "गुजराती तूवर टोठा स्वामीनारायण तरीके से: बिना प्याज़ और लहसुन, मसालेदार ग्रेवी में। पाव के बिना।",
    "hindi_short_description": "गुजराती तूवर टोठा स्वामीनारायण तरीके से: बिना प्याज़ और लहसुन।",
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
    "hindi_name": "सेव उसल फ़ैमिली और पार्टी पैक",
    "hindi_description": "फ़ैमिली और पार्टी साइज़ में सेव उसल। सेव अलग पैक ताकि कुरकुरी रहे। साथ में पाव, प्याज़ और नींबू। रेगुलर रेसिपी।",
    "hindi_short_description": "फ़ैमिली और पार्टी साइज़ में सेव उसल, सेव अलग पैक ताकि कुरकुरी रहे।",
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
    "hindi_name": "तूवर टोठा फ़ैमिली और पार्टी पैक",
    "hindi_description": "फ़ैमिली और पार्टी साइज़ में गुजराती तूवर टोठा, पाव, प्याज़ और नींबू के साथ। रेगुलर रेसिपी।",
    "hindi_short_description": "फ़ैमिली और पार्टी साइज़ में गुजराती तूवर टोठा, पाव, प्याज़ और नींबू के साथ।",
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
    "hindi_name": "पाव (2 पीस)",
    "hindi_description": "सेव उसल या तूवर टोठा के साथ दो नरम पाव।",
    "hindi_short_description": "सेव उसल या तूवर टोठा के साथ दो नरम पाव।",
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
    "hindi_name": "बटर पाव (2 पीस)",
    "hindi_description": "मक्खन से टोस्ट किए दो नरम पाव।",
    "hindi_short_description": "मक्खन से टोस्ट किए दो नरम पाव।",
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
    "hindi_name": "मसाला छाछ",
    "hindi_description": "मसालेदार गुजराती छाछ, 200 मि.ली.",
    "hindi_short_description": "मसालेदार गुजराती छाछ।",
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
    "hindi_name": "पैकेज्ड पीने का पानी",
    "hindi_description": "सीलबंद पैकेज्ड पीने का पानी, 500 मि.ली. / 1 लीटर।",
    "hindi_short_description": "सीलबंद पैकेज्ड पीने का पानी।",
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
