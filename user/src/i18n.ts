import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "@/locales/zh-CN";
import enUS from "@/locales/en-US";

const resources = {
  "zh-CN": {
    translation: zhCN,
  },
  "en-US": {
    translation: enUS,
  },
};

// Get saved language from localStorage or use browser language
const getSavedLanguage = () => {
  const saved = localStorage.getItem("selectedLanguage");
  if (saved) return saved;

  const browserLang = navigator.language;
  if (browserLang.startsWith("zh")) return "zh-CN";
  return "en-US";
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
