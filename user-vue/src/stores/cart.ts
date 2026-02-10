import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCart, updateCartItem } from '@/services/cart'
import type { CartItem, Cart } from '@/models/cart'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const selectedItemIds = ref<Set<number>>(new Set())
  const loading = ref(false)

  // Getters
  const itemCount = computed(() => items.value.length)

  const selectedItems = computed(() =>
    items.value.filter(item => selectedItemIds.value.has(item.productId))
  )

  const selectedCount = computed(() => selectedItemIds.value.size)

  const subtotal = computed(() => {
    return selectedItems.value.reduce((sum, item) => {
      return sum + (item.price * item.quantity)
    }, 0)
  })

  const totalQuantity = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  // Actions
  const loadCart = async () => {
    try {
      loading.value = true
      const response = await getCart()

      if (response.data) {
        // Handle both direct array and wrapped data
        const cartData = Array.isArray(response.data)
          ? response.data
          : response.data.items || []

        items.value = cartData as CartItem[]

        // Initialize selected items from loaded data
        const initialSelected = new Set<number>()
        cartData.forEach((item: CartItem) => {
          if (item.selected) {
            initialSelected.add(item.productId)
          }
        })
        selectedItemIds.value = initialSelected

        // Sync with localStorage
        localStorage.setItem('cart', JSON.stringify(cartData))
      }
    } catch (error) {
      console.error('Failed to load cart from backend:', error)
      // Fallback to localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      items.value = cart
    } finally {
      loading.value = false
    }
  }

  const addItem = (item: CartItem) => {
    const existingItem = items.value.find(
      i => i.productId === item.productId
    )

    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      items.value.push(item)
    }

    syncToLocalStorage()
  }

  const removeItem = (productId: number) => {
    items.value = items.value.filter(item => item.productId !== productId)
    selectedItemIds.value.delete(productId)
    syncToLocalStorage()
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return

    const item = items.value.find(i => i.productId === productId)
    if (item) {
      item.quantity = quantity
      syncToLocalStorage()
    }
  }

  const toggleItem = (productId: number) => {
    const newSelected = new Set(selectedItemIds.value)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    selectedItemIds.value = newSelected
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      selectedItemIds.value = new Set(items.value.map(item => item.productId))
    } else {
      selectedItemIds.value = new Set()
    }
  }

  const clearCart = () => {
    items.value = []
    selectedItemIds.value = new Set()
    syncToLocalStorage()
  }

  const syncToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
    window.dispatchEvent(new Event('storage'))
  }

  const syncSelectedToBackend = async () => {
    try {
      for (const item of items.value) {
        const isSelected = selectedItemIds.value.has(item.productId)
        if (item.id) {
          await updateCartItem({
            id: item.id,
            quantity: item.quantity,
            selected: isSelected,
          })
        }
      }
    } catch (error) {
      console.error('Failed to sync selected items to backend:', error)
      throw error
    }
  }

  return {
    // State
    items,
    selectedItemIds,
    loading,

    // Getters
    itemCount,
    selectedItems,
    selectedCount,
    subtotal,
    totalQuantity,

    // Actions
    loadCart,
    addItem,
    removeItem,
    updateQuantity,
    toggleItem,
    toggleSelectAll,
    clearCart,
    syncToLocalStorage,
    syncSelectedToBackend,
  }
})
