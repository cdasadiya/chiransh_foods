import products from "../../../backend/data/products.json";
import settings from "../../../backend/data/settings.json";
import en from "../locales/en/translation.json";
import { getPageSeo } from "./seo";

const data = {
  products,
  settings,
  faqs: en?.faq?.items || [],
};

export function getRouteSeo(pathname) {
  return getPageSeo(pathname, data);
}
