import { describe, expect, it } from "vitest";
import i18n from "@/i18n";

describe("value translations", () => {
  it("reads nested value keys in every language", async () => {
    for (const lang of ["en", "gu"]) {
      await i18n.changeLanguage(lang);
      const title = i18n.t("values.vegetarian.title");
      expect(title).not.toBe("values.vegetarian.title");
      expect(title.length).toBeGreaterThan(3);
    }
  });
});
