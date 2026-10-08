import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en/translation.json";
import guTranslations from "./locales/gu/translation.json";
import hiTranslations from "./locales/hi/translation.json";

function initialLanguage() {
  if (typeof window === "undefined") return "en";
  const match = window.location.pathname.match(/^\/(gu|hi)(\/|$)/);
  return match ? match[1] : "en";
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      gu: {
        translation: guTranslations
      },
      hi: {
        translation: hiTranslations
      }
    },
    lng: initialLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
