import products from "../../../backend/data/products.json";
import settings from "../../../backend/data/settings.json";
import en from "../locales/en/translation.json";
import gu from "../locales/gu/translation.json";
import hi from "../locales/hi/translation.json";
import { getPageSeo } from "./seo";

const data = {
  products,
  settings,
  faqs: en?.faq?.items || [],
  faqsGu: gu?.faq?.items || [],
  faqsHi: hi?.faq?.items || [],
};

export function getRouteSeo(pathname) {
  return getPageSeo(pathname, data);
}
