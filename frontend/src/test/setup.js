import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import i18n from "@/i18n";

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false;
    },
  });
}

afterEach(async () => {
  if (typeof window !== "undefined") cleanup();
  await i18n.changeLanguage("en");
});
