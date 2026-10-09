import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";

vi.mock("@/lib/api", async () => {
  const { FALLBACK_PRODUCTS } = await import("@/lib/site");
  return {
    fetchProducts: vi.fn(async () => FALLBACK_PRODUCTS),
  };
});

import Menu from "./Menu";

function renderMenu(path = "/menu") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Menu />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Menu catalog", () => {
  it("opens the bulk category from the query and shows the shared instructions once", async () => {
    renderMenu("/menu?category=Family%20%26%20Bulk%20Orders");
    const tab = await screen.findByRole("tab", { name: /family & bulk orders/i });
    expect(tab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getAllByTestId("order-instructions")).toHaveLength(1);
    expect(screen.getByText("5 to 200 persons")).toBeTruthy();
    expect(screen.getByRole("link", { name: "+91 91063 54619" }).getAttribute("href")).toBe("tel:+919106354619");
    expect(await screen.findAllByTestId("product-card-bhaji-pav")).toHaveLength(1);
    expect(screen.queryByTestId("product-card-baroda-style-sev-usal")).toBeNull();
    expect(screen.getAllByText("Bhaji Pav")).toHaveLength(1);
  });

  it("finds a bulk dish from either language", async () => {
    const user = userEvent.setup();
    renderMenu("/menu");
    const search = await screen.findByTestId("menu-search-input");
    await user.type(search, "ભાજી પાવ");
    expect(await screen.findByTestId("product-card-bhaji-pav")).toBeTruthy();
    expect(screen.queryByTestId("product-card-pulav")).toBeNull();
  });

  it("shows the Gujarati instruction copy", async () => {
    await i18n.changeLanguage("gu");
    renderMenu("/gu/menu");
    expect(await screen.findByRole("heading", { name: "ફક્ત અગાઉથી ઓર્ડર" })).toBeTruthy();
    expect(screen.getByText("૫ થી ૨૦૦ વ્યક્તિઓ")).toBeTruthy();
    expect(screen.getByText("તાજા મગફળીના તેલથી તૈયાર")).toBeTruthy();
  });
});
