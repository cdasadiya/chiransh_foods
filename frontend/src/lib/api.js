import axios from "axios";
import { API, FALLBACK_PRODUCTS } from "./site";

export const api = axios.create({ baseURL: API, timeout: 10000 });

// Offline resilience (local copy): if the API can't be reached at all (no
// response, proxy 5xx because the backend is stopped), serve the built-in
// FALLBACK_PRODUCTS so /menu and the dish pages still work. A real answer from
// a running API, including a 404 for an unknown slug, is passed through unchanged.
const unreachable = (err) =>
  !err?.response || (err.response.status >= 500 && err.response.status <= 504);

export const fetchProducts = async () => {
  try {
    return (await api.get("/products")).data;
  } catch (err) {
    if (unreachable(err)) return FALLBACK_PRODUCTS;
    throw err;
  }
};

export const fetchProduct = async (slug) => {
  try {
    return (await api.get(`/products/${slug}`)).data;
  } catch (err) {
    const local = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    if (unreachable(err) && local) return local;
    throw err;
  }
};

export const fetchSettings = async () => (await api.get("/settings")).data;
export const submitEnquiry = async (data) =>
  (await api.post("/enquiries", data)).data;
