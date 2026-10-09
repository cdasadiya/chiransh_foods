import { describe, expect, it } from "vitest";
import products from "../../../backend/data/products.json";
import { FALLBACK_PRODUCTS } from "./site";

describe("menu catalog", () => {
  it("keeps the offline menu aligned with the published menu", () => {
    const live = products.map((item) => item.slug).sort();
    const fallback = FALLBACK_PRODUCTS.map((item) => item.slug).sort();
    expect(fallback).toEqual(live);
    for (const item of products) {
      expect(item.gujarati_name || item.name).toBeTruthy();
      expect(item.image).not.toMatch(/\.png$/);
    }
  });
});
