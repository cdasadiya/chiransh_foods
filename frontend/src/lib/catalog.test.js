import { describe, expect, it } from "vitest";
import products from "../../../backend/data/products.json";
import { foodImageProps } from "./images";
import { BULK_CATEGORY, FALLBACK_PRODUCTS } from "./site";

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
});
