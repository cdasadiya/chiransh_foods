import { describe, expect, it } from "vitest";
import products from "../../../backend/data/products.json";
import { foodImageProps } from "./images";
import { ADDONS, BULK_CATEGORY, FALLBACK_PRODUCTS, addonsForSlug, priceLabel } from "./site";

const PRICES = {
  "baroda-style-sev-usal": 100,
  "sev-usal-with-pav": 100,
  "sev-usal-take-home-pack": 100,
  "tuvar-totha": 120,
  "tuvar-totha-with-pav": 140,
  "sev-usal-tuvar-totha-combo-plate": 220,
  "jain-sev-usal": 120,
  "jain-tuvar-totha": 140,
  "swaminarayan-sev-usal": 120,
  "swaminarayan-tuvar-totha": 140,
  "pav-2-pcs": 20,
  "masala-chaas": 20,
  "packaged-drinking-water": 20,
  "bhaji-pav": 120,
  "khada-pav-bhaji": 130,
  "masala-pav": 60,
  "pulav": 100,
  "kutchi-dabeli": 30,
  "ragda-pattice": 75,
};

const UNPRICED = [
  "sev-usal-family-party-pack",
  "tuvar-totha-family-party-pack",
  "butter-pav-2-pcs",
];

const BULK_SLUGS = [
  "bhaji-pav",
  "khada-pav-bhaji",
  "masala-pav",
  "pulav",
  "kutchi-dabeli",
  "ragda-pattice",
];

describe("menu catalog", () => {
  it("keeps the offline menu aligned with the published menu", () => {
    const live = products.map((item) => item.slug).sort();
    const fallback = FALLBACK_PRODUCTS.map((item) => item.slug).sort();
    expect(fallback).toEqual(live);
    expect(new Set(live).size).toBe(live.length);
    for (const item of products) {
      expect(item.gujarati_name || item.name).toBeTruthy();
      expect(item.image).not.toMatch(/\.png$/);
      const offline = FALLBACK_PRODUCTS.find((entry) => entry.slug === item.slug);
      expect(offline.category).toBe(item.category);
      expect(offline.name).toBe(item.name);
      expect(offline.gujarati_name).toBe(item.gujarati_name);
      expect(offline.price).toBe(item.price);
    }
  });

  it("adds each new bulk dish once, with its own photo", () => {
    expect(products.filter((item) => item.slug === "baroda-style-sev-usal")).toHaveLength(1);
    expect(products.filter((item) => item.slug === "tuvar-totha")).toHaveLength(1);
    for (const slug of BULK_SLUGS) {
      const item = products.find((entry) => entry.slug === slug);
      expect(item.category).toBe(BULK_CATEGORY);
      expect(item.serving_info).toBe("");
      expect(item.badge).toBe("Advance order");
      expect(foodImageProps(item.image).srcSet).toContain("-480.webp");
      expect(foodImageProps(item.image).srcSet).toContain("-768.webp");
    }
  });

  it("serves the family-pack spread as a responsive 4:3 webp", () => {
    const image = foodImageProps(
      "/images/f60e06ce5df687c2b2b455940b778d6a054b268564dceae3fc75de82cc31877d.webp",
    );
    expect(image.src).toBe(
      "/images/f60e06ce5df687c2b2b455940b778d6a054b268564dceae3fc75de82cc31877d.webp",
    );
    expect(image.srcSet).toContain("-480.webp 480w");
    expect(image.srcSet).toContain("-768.webp 768w");
    expect(image.srcSet).toContain(".webp 1152w");
  });

  it("publishes rupee prices with English digits", () => {
    for (const [slug, price] of Object.entries(PRICES)) {
      expect(products.find((item) => item.slug === slug).price).toBe(price);
    }
    for (const slug of UNPRICED) {
      expect(products.find((item) => item.slug === slug).price).toBeNull();
    }
    expect(priceLabel(100)).toBe("₹ 100");
    expect(priceLabel(1000)).toBe("₹ 1,000");
    expect(priceLabel(100)).not.toMatch(/[૦-૯]/);
    expect(addonsForSlug("baroda-style-sev-usal").map((addon) => addon.id)).toEqual(
      ADDONS.map((addon) => addon.id),
    );
    expect(addonsForSlug("tuvar-totha")).toHaveLength(2);
    expect(addonsForSlug("jain-sev-usal")).toEqual([]);
    expect(addonsForSlug("bhaji-pav")).toEqual([]);
  });
});
