import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
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

function renderDish(slug, lang = "en") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const entry = lang === "gu" ? `/gu/menu/${slug}` : `/menu/${slug}`;
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/menu/:slug" element={<ProductDetail />} />
          <Route path="/gu/menu/:slug" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("Product detail instructions", () => {
  it("shows the shared instructions on a bulk dish and not on a regular dish", async () => {
    const { unmount } = renderDish("bhaji-pav");
    expect(await screen.findByRole("heading", { name: "Bhaji Pav" })).toBeTruthy();
    expect(screen.getByText("ભાજી પાવ")).toBeTruthy();
    expect(screen.getAllByTestId("order-instructions")).toHaveLength(1);
    expect(screen.queryByTestId("product-serving-info")).toBeNull();
    const whatsapp = screen.getByTestId("product-detail-whatsapp-btn");
    expect(whatsapp.getAttribute("href")).toContain("wa.me/919106354619");
    const message = decodeURIComponent(whatsapp.getAttribute("href"));
    expect(message).toContain("Bhaji Pav");
    expect(message).toContain("₹120");
    expect(message).toContain("Quantity: 1");
    expect(message).toContain("Total: ₹120");
    expect(screen.queryByTestId("product-addons")).toBeNull();
    expect(screen.queryByTestId("product-detail-call-btn")).toBeNull();
    expect(screen.getByTestId("product-detail-enquiry-btn").getAttribute("href")).toContain(
      "/contact?product=bhaji-pav&qty=1",
    );
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

  it("shows optional add-ons only for sev usal and tuvar totha", async () => {
    const user = userEvent.setup();
    const { unmount } = renderDish("baroda-style-sev-usal");
    expect(await screen.findByTestId("addon-extra-sev")).toBeTruthy();
    expect(screen.getByTestId("addon-extra-garlic-red-chutney")).toBeTruthy();
    expect(screen.getByTestId("product-detail-price").textContent).toBe("₹100");
    await user.click(screen.getByTestId("addon-extra-sev"));
    await user.click(screen.getByTestId("quantity-increase"));
    expect(screen.getByTestId("product-quantity").textContent).toBe("2");
    expect(screen.getByTestId("product-detail-total").textContent).toBe("₹230");
    const order = decodeURIComponent(screen.getByTestId("product-detail-whatsapp-btn").getAttribute("href"));
    expect(order).toContain("Baroda-Style Sev Usal — ₹100");
    expect(order).toContain("Extra sev — ₹15");
    expect(order).toContain("Quantity: 2");
    expect(order).toContain("Total: ₹230");
    expect(order).not.toMatch(/[૦-૯]/);
    const enquiry = screen.getByTestId("product-detail-enquiry-btn").getAttribute("href");
    expect(enquiry).toContain("product=baroda-style-sev-usal");
    expect(enquiry).toContain("qty=2");
    expect(enquiry).toContain("addons=extra-sev");
    unmount();

    const tuvar = renderDish("tuvar-totha");
    expect(await screen.findByTestId("product-addons")).toBeTruthy();
    expect(screen.getByTestId("product-detail-price").textContent).toBe("₹120");
    tuvar.unmount();

    renderDish("jain-sev-usal");
    expect(await screen.findByRole("heading", { name: "Jain Sev Usal" })).toBeTruthy();
    expect(screen.queryByTestId("product-addons")).toBeNull();
    expect(screen.getByTestId("product-detail-price").textContent).toBe("₹120");
  });

  it("keeps English digits in the Gujarati order message", async () => {
    await i18n.changeLanguage("gu");
    renderDish("baroda-style-sev-usal", "gu");
    expect(await screen.findByRole("heading", { name: "બરોડા સ્ટાઇલ સેવ ઉસળ" })).toBeTruthy();
    expect(screen.getByTestId("product-detail-price").textContent).toBe("₹100");
    const order = decodeURIComponent(screen.getByTestId("product-detail-whatsapp-btn").getAttribute("href"));
    expect(order).toContain("બરોડા સ્ટાઇલ સેવ ઉસળ — ₹100");
    expect(order).toContain("સંખ્યા: 1");
    expect(order).toContain("કુલ: ₹100");
    expect(order).not.toMatch(/[૦-૯]/);
    expect(screen.getByTestId("product-detail-enquiry-btn").getAttribute("href")).toContain(
      "/gu/contact?product=baroda-style-sev-usal&qty=1",
    );
  });

  it("uses the Gujarati dish name on a bulk page", async () => {
    await i18n.changeLanguage("gu");
    renderDish("kutchi-dabeli");
    expect(await screen.findByRole("heading", { name: "કચ્છી દાબેલી" })).toBeTruthy();
    expect(screen.getByText("Kutchi Dabeli")).toBeTruthy();
    expect(screen.getByText("ફક્ત અગાઉથી ઓર્ડર")).toBeTruthy();
  });
});