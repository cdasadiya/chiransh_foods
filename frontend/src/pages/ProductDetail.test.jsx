import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import i18n from "@/i18n";

vi.mock("@/lib/api", async () => {
  const { FALLBACK_PRODUCTS } = await import("@/lib/site");
  return {
    fetchProducts: vi.fn(async () => FALLBACK_PRODUCTS),
    fetchProduct: vi.fn(async (slug) => {
      const item = FALLBACK_PRODUCTS.find((product) => product.slug === slug);
      if (!item) {
        const error = new Error("missing");
        error.response = { status: 404 };
        throw error;
      }
      return item;
    }),
  };
});

import ProductDetail from "./ProductDetail";

function renderDish(slug) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/menu/${slug}`]}>
        <Routes>
          <Route path="/menu/:slug" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Product detail instructions", () => {
  it("shows the shared instructions on a bulk dish and not on a regular dish", async () => {
    const { unmount } = renderDish("bhaji-pav");
    expect(await screen.findByRole("heading", { name: "Bhaji Pav" })).toBeTruthy();
    expect(screen.getByText("ભાજી પાવ")).toBeTruthy();
    expect(screen.getAllByTestId("order-instructions")).toHaveLength(1);
    expect(screen.queryByTestId("product-serving-info")).toBeNull();
    const whatsapp = screen.getByTestId("product-detail-whatsapp-btn");
    expect(whatsapp.getAttribute("href")).toContain("wa.me/919106354619");
    expect(decodeURIComponent(whatsapp.getAttribute("href"))).toContain("Bhaji Pav");
    unmount();

    renderDish("baroda-style-sev-usal");
    expect(await screen.findByTestId("product-serving-info")).toBeTruthy();
    expect(screen.queryByTestId("order-instructions")).toBeNull();
  });

  it("shows the same instructions on an existing family pack", async () => {
    renderDish("sev-usal-family-party-pack");
    expect(await screen.findByTestId("order-instructions")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Sev Usal Family and Party Pack" })).toBeTruthy();
  });

  it("uses the Gujarati dish name on a bulk page", async () => {
    await i18n.changeLanguage("gu");
    renderDish("kutchi-dabeli");
    expect(await screen.findByRole("heading", { name: "કચ્છી દાબેલી" })).toBeTruthy();
    expect(screen.getByText("Kutchi Dabeli")).toBeTruthy();
    expect(screen.getByText("ફક્ત અગાઉથી ઓર્ડર")).toBeTruthy();
  });
});