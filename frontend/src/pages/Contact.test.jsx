import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import Contact from "./Contact";
import { SettingsProvider } from "@/context/SettingsContext";

vi.mock("@/lib/api", async () => {
  const { FALLBACK_PRODUCTS } = await import("@/lib/site");
  return {
    fetchProducts: vi.fn(async () => FALLBACK_PRODUCTS),
    fetchSettings: vi.fn(async () => ({})),
    submitEnquiry: vi.fn(async () => ({ ok: true })),
  };
});

afterEach(async () => {
  await i18n.changeLanguage("en");
});

function renderContact(path = "/contact") {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <SettingsProvider>
        <MemoryRouter initialEntries={[path]}>
          <Contact />
        </MemoryRouter>
      </SettingsProvider>
    </QueryClientProvider>,
  );
}

describe("Contact form", () => {
  it("shows a name error and does not submit an empty form", async () => {
    const user = userEvent.setup();
    renderContact();
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeTruthy();
  });

  it("prefills the selected dish and order details in both languages", async () => {
    const { unmount } = renderContact(
      "/contact?product=baroda-style-sev-usal&qty=2&addons=extra-sev,extra-garlic-red-chutney",
    );
    await waitFor(() => {
      expect(screen.getByTestId("contact-product-select").value).toBe("Baroda-Style Sev Usal");
    });
    const message = screen.getByTestId("contact-message-input").value;
    expect(message).toContain("Baroda-Style Sev Usal — ₹ 100");
    expect(message).toContain("Extra sev — ₹ 15");
    expect(message).toContain("Extra garlic red chutney — ₹ 15");
    expect(message).toContain("Quantity: 2");
    expect(message).toContain("Total: ₹ 260");
    expect(message).not.toMatch(/[૦-૯]/);
    expect(screen.getByTestId("contact-name-input").value).toBe("");
    unmount();

    await i18n.changeLanguage("gu");
    renderContact("/gu/contact?product=tuvar-totha&qty=1&addons=extra-garlic-red-chutney,not-allowed");
    await waitFor(() => {
      expect(screen.getByTestId("contact-product-select").value).toBe("Tuvar Totha");
    });
    const gujarati = screen.getByTestId("contact-message-input").value;
    expect(gujarati).toContain("તુવેર ટોઠા — ₹ 120");
    expect(gujarati).toContain("વધારાની લસણવાળી લાલ ચટણી — ₹ 15");
    expect(gujarati).not.toContain("વધારાની સેવ");
    expect(gujarati).toContain("સંખ્યા: 1");
    expect(gujarati).toContain("કુલ: ₹ 135");
    expect(gujarati).not.toMatch(/[૦-૯]/);
  });
});
