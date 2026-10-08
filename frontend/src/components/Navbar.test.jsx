import { render, screen } from "@testing-library/react";
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
  it("links the current page to English, Gujarati, and Hindi", () => {
    renderNav("/menu");
    expect(screen.getByRole("link", { name: "English" }).getAttribute("href")).toBe("/menu");
    expect(screen.getByRole("link", { name: "ગુજરાતી" }).getAttribute("href")).toBe("/gu/menu");
    expect(screen.getByRole("link", { name: "हिन्दी" }).getAttribute("href")).toBe("/hi/menu");
  });
});
