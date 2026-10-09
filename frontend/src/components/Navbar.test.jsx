import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { SettingsProvider } from "@/context/SettingsContext";

function renderNav(path = "/") {
  return render(
    <SettingsProvider>
      <MemoryRouter initialEntries={[path]}>
        <Navbar />
      </MemoryRouter>
    </SettingsProvider>,
  );
}

describe("Navbar", () => {
  it("links the current page to English and Gujarati", () => {
    renderNav("/menu");
    expect(screen.getByRole("link", { name: "English" }).getAttribute("href")).toBe("/menu");
    expect(screen.getByRole("link", { name: "ગુજરાતી" }).getAttribute("href")).toBe("/gu/menu");
    expect(screen.queryByRole("link", { name: "हिन्दी" })).toBeNull();
    expect(screen.getByTestId("header-language").className).not.toContain("hidden");
  });

  it("opens the menu from the phone button and keeps language links tappable", async () => {
    const user = userEvent.setup();
    renderNav("/");
    await user.click(screen.getByTestId("nav-mobile-toggle"));
    const menu = screen.getByTestId("nav-mobile-menu");
    expect(menu).toBeTruthy();
    expect(screen.getByTestId("lang-switch-gu").getAttribute("href")).toBe("/gu");
    const gujarati = screen.getByTestId("lang-switch-gu-menu");
    expect(gujarati.getAttribute("href")).toBe("/gu");
    expect(gujarati.closest("[inert]")).toBeNull();
    expect(screen.getByTestId("nav-mobile-menu-link").closest("[inert]")).toBeNull();
    expect(screen.getByTestId("nav-mobile-close").closest("[inert]")).toBeNull();
    await user.click(screen.getByTestId("nav-mobile-menu-link"));
    await user.click(screen.getByTestId("lang-switch-gu"));
  });
});
