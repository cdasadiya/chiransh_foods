import { describe, expect, it } from "vitest";
import { localizedHref } from "./locale";

describe("localizedHref", () => {
  it("keeps the menu category when switching language", () => {
    const to = "/menu?category=Family%20%26%20Bulk%20Orders";
    expect(localizedHref(to, "en")).toBe(to);
    expect(localizedHref(to, "gu")).toBe(`/gu${to}`);
    expect(localizedHref(`/gu${to}`, "en")).toBe(to);
  });
});
