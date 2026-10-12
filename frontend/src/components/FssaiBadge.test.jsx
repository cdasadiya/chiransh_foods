import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/i18n";
import { SettingsProvider } from "@/context/SettingsContext";
import Footer from "./Footer";
import FssaiBadge from "./FssaiBadge";

describe("FSSAI badge", () => {
  it("shows the licence on the site footer in the page language", async () => {
    const { unmount } = render(
      <SettingsProvider>
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      </SettingsProvider>,
    );
    expect(screen.getByTestId("fssai-badge")).toBeTruthy();
    expect(screen.getByText("FSSAI Registered Food Provider")).toBeTruthy();
    expect(screen.getByTestId("fssai-license").textContent).toBe("20726038003778");
    unmount();

    await i18n.changeLanguage("gu");
    render(<FssaiBadge />);
    expect(screen.getByText("FSSAI નોંધાયેલ ખાદ્ય પ્રદાતા")).toBeTruthy();
    expect(screen.getByText("લાઇસન્સ નં.")).toBeTruthy();
  });
});
