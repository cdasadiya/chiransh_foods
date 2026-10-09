import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FAQ from "./FAQ";

describe("FAQ", () => {
  it("keeps answer panels addressable and toggles them", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>,
    );
    const first = screen.getByTestId("faq-toggle-0");
    const second = screen.getByTestId("faq-toggle-1");
    expect(document.getElementById("faq-panel-0").hidden).toBe(false);
    expect(document.getElementById("faq-panel-1").hidden).toBe(true);
    await user.click(second);
    expect(first.getAttribute("aria-expanded")).toBe("false");
    expect(second.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("faq-panel-1").hidden).toBe(false);
  });
});
