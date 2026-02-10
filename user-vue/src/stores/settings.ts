import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAppConfig } from '@/services/settings'
import { getCurrencyList } from '@/services/exchange'
import type { AppConfig } from '@/models/settings'
import type { Currency } from '@/models/exchange'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const appConfig = ref<AppConfig | null>(null)
  const currencies = ref<Currency[]>([])
  const selectedCurrency = ref<string>('USD')
  const loading = ref(false)

  // Getters
  const shippingFee = () => appConfig.value?.shippingFee || 10
  const freeShippingThreshold = () => appConfig.value?.freeshippingThreshold || 99
  const defaultCurrency = () => appConfig.value?.defaultCurrency || 'USD'

  // Actions
  const loadConfig = async () => {
    try {
      loading.value = true
      const response = await getAppConfig()

      if (response.data) {
        appConfig.value = response.data
        // Use default currency from config
        if (response.data.defaultCurrency) {
          selectedCurrency.value = response.data.defaultCurrency
        }
      }
    } catch (error) {
      console.error('Failed to load app config:', error)
    } finally {
      loading.value = false
    }
  }

  const loadCurrencies = async () => {
    try {
      const response = await getCurrencyList()

      if (response.data) {
        currencies.value = response.data

        // Set default to base currency (isBase: 1) or first currency
        const baseCurrency = response.data.find((c: Currency) => c.isBase === 1)
        if (baseCurrency) {
          selectedCurrency.value = baseCurrency.currencyCode
        } else if (response.data.length > 0) {
          const firstCurrency = response.data[0]
          if (firstCurrency) {
            selectedCurrency.value = firstCurrency.currencyCode
          }
        }
      }
    } catch (error) {
      console.error('Failed to load currencies:', error)
    }
  }

  const setCurrency = (currencyCode: string) => {
    selectedCurrency.value = currencyCode
    localStorage.setItem('selectedCurrency', currencyCode)
  }

  const getCurrencySymbol = (currencyCode?: string): string => {
    const code = currencyCode || selectedCurrency.value
    const currency = currencies.value.find(c => c.currencyCode === code)
    return currency?.symbol || '$'
  }

  const initializeSettings = async () => {
    await Promise.all([loadConfig(), loadCurrencies()])

    // Restore selected currency from localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency) {
      selectedCurrency.value = savedCurrency
    }
  }

  return {
    // State
    appConfig,
    currencies,
    selectedCurrency,
    loading,

    // Getters
    shippingFee,
    freeShippingThreshold,
    defaultCurrency,

    // Actions
    loadConfig,
    loadCurrencies,
    setCurrency,
    getCurrencySymbol,
    initializeSettings,
  }
})
