import { addonsForSlug, priceLabel } from "./site";

export function orderTotal(unitPrice, addonPrices, quantity) {
  if (unitPrice == null || unitPrice === "") return null;
  const unit = Number(unitPrice);
  if (!Number.isFinite(unit)) return null;
  const extras = addonPrices.reduce((sum, price) => sum + Number(price), 0);
  return (unit + extras) * quantity;
}

export function enquirySearch({ slug, quantity, addonIds }) {
  const params = new URLSearchParams();
  params.set("product", slug);
  params.set("qty", String(quantity));
  if (addonIds.length) params.set("addons", addonIds.join(","));
  return params.toString();
}

export function parseEnquirySearch(params) {
  const slug = params.get("product") || "";
  const qtyRaw = Number.parseInt(params.get("qty") || "1", 10);
  const quantity = Number.isFinite(qtyRaw) ? Math.min(99, Math.max(1, qtyRaw)) : 1;
  const allowed = new Set(addonsForSlug(slug).map((addon) => addon.id));
  const addonIds = (params.get("addons") || "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => allowed.has(id));
  return { slug, quantity, addonIds };
}

/** Order text shared by WhatsApp and the enquiry form. Digits stay in priceLabel. */
export function orderDetailsText(t, { productName, unitPrice, quantity, addons }) {
  const unit =
    unitPrice == null || unitPrice === "" ? t("menu.price_contact") : priceLabel(unitPrice);
  const lines = [
    t("order.summary_intro"),
    t("order.summary_line", { name: productName, price: unit }),
  ];
  for (const addon of addons) {
    lines.push(t("order.summary_line", { name: addon.name, price: priceLabel(addon.price) }));
  }
  lines.push(t("order.summary_quantity", { count: String(quantity) }));
  const total = orderTotal(
    unitPrice,
    addons.map((addon) => addon.price),
    quantity,
  );
  if (total != null) {
    lines.push(t("order.summary_total", { total: priceLabel(total) }));
  }
  return lines.join("\n");
}
