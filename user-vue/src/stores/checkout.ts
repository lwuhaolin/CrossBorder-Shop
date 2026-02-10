import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSettingsStore } from './settings'
import type { Address } from '@/models/address'

export const useCheckoutStore = defineStore('checkout', () => {
  const settingsStore = useSettingsStore()

  // State
  const currentStep = ref(0)
  const selectedAddressId = ref<number | undefined>()
  const addresses = ref<Address[]>([])
  const paymentMethod = ref('credit_card')
  const loading = ref(false)

  // Getters
  const selectedAddress = computed(() => {
    return addresses.value.find(addr => addr.id === selectedAddressId.value)
  })

  // Actions
  const setAddresses = (newAddresses: Address[]) => {
    addresses.value = newAddresses
    if (newAddresses.length > 0) {
      // Select default address or first address
      const defaultAddr = newAddresses.find(addr => addr.isDefault)
      if (defaultAddr && defaultAddr.id) {
        selectedAddressId.value = defaultAddr.id
      } else {
        const firstAddr = newAddresses[0]
        if (firstAddr?.id) {
          selectedAddressId.value = firstAddr.id
        }
      }
    }
  }

  const selectAddress = (addressId: number) => {
    selectedAddressId.value = addressId
  }

  const setPaymentMethod = (method: string) => {
    paymentMethod.value = method
  }

  const nextStep = () => {
    currentStep.value++
  }

  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  const goToStep = (step: number) => {
    currentStep.value = step
  }

  const resetCheckout = () => {
    currentStep.value = 0
    selectedAddressId.value = undefined
    paymentMethod.value = 'credit_card'
    loading.value = false
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  return {
    // State
    currentStep,
    selectedAddressId,
    addresses,
    paymentMethod,
    loading,

    // Getters
    selectedAddress,

    // Actions
    setAddresses,
    selectAddress,
    setPaymentMethod,
    nextStep,
    prevStep,
    goToStep,
    resetCheckout,
    setLoading,
  }
})
