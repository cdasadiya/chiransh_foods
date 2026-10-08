import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Contact from "./Contact";
import { SettingsProvider } from "@/context/SettingsContext";

describe("Contact form", () => {
  it("shows a name error and does not submit an empty form", async () => {
    const user = userEvent.setup();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <SettingsProvider>
          <MemoryRouter>
            <Contact />
          </MemoryRouter>
        </SettingsProvider>
      </QueryClientProvider>,
    );
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/please enter your name/i)).toBeTruthy();
  });
});
