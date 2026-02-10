import i18next from 'i18next'
import I18nextVue from 'i18next-vue'
import zhCN from '@/locales/zh-CN'
import enUS from '@/locales/en-US'

const resources = {
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
}

// Get saved language from localStorage or use browser language
const getSavedLanguage = () => {
  const saved = localStorage.getItem('selectedLanguage')
  if (saved) return saved

  const browserLang = navigator.language
  if (browserLang.startsWith('zh')) return 'zh-CN'
  return 'en-US'
}

i18next.init({
  resources,
  lng: getSavedLanguage(),
  fallbackLng: 'en-US',
  interpolation: {
    escapeValue: false,
  },
})

export const i18n = i18next

// Custom hook to use i18n
export function useI18n() {
  return {
    t: (key: string) => i18next.t(key),
    i18n: i18next,
  }
}

export default {
  install(app: any) {
    app.use(I18nextVue, { i18next })
    // Provide useI18n globally
    app.config.globalProperties.$t = (key: string) => i18next.t(key)
  },
}
