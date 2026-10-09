import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("renders translated recovery links", () => {
    render(
      <MemoryRouter initialEntries={["/missing"]}>
        <NotFound />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: /plate is empty/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /return to menu/i }).getAttribute("href")).toBe("/menu");
  });
});
