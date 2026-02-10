
<template>
  <div class="cart-page">
    <div class="container">
      <template v-if="cartItems.length === 0">
        <a-card>
          <a-empty :description="t('cart.empty')" image-simple>
            <template #default>
              <a-button type="primary" @click="() => router.push('/products')">
                {{ t('cart.startShopping') }}
              </a-button>
            </template>
          </a-empty>
        </a-card>
      </template>

      <template v-else>
        <h1 class="title">{{ t('cart.title') }}</h1>

        <a-card class="card">
          <a-table
            :data-source="cartItems"
            :columns="columns"
            :pagination="false"
            :row-key="(record: CartItem) => record.productId"
          >
            <template #bodyCell="{ column, record }">
              <!-- Checkbox Column -->
              <template v-if="column.key === 'checkbox'">
                <a-checkbox
                  :checked="selectedItems.has(record.productId)"
                  @change="() => toggleItem(record.productId)"
                />
              </template>

              <!-- Product Cell -->
              <template v-else-if="column.key === 'productName'">
                <div class="product-cell">
                  <img
                    :src="getImageUrl(record.productImage)"
                    :alt="record.productName"
                    class="product-image"
                  />
                  <span class="product-name">{{ record.productName }}</span>
                </div>
              </template>

              <!-- Price Column -->
              <template v-else-if="column.key === 'price'">
                ${{ record.price.toFixed(2) }}
              </template>

              <!-- Quantity Column -->
              <template v-else-if="column.key === 'quantity'">
                <a-input-number
                  :value="record.quantity"
                  :min="1"
                  @change="(val: any) => updateQuantity(record.productId, val || 1)"
                />
              </template>

              <!-- Subtotal Column -->
              <template v-else-if="column.key === 'subtotal'">
                ${{ (record.price * record.quantity).toFixed(2) }}
              </template>

              <!-- Action Column -->
              <template v-else-if="column.key === 'action'">
                <a-button
                  type="text"
                  danger
                  @click="removeItem(record.productId)"
                >
                  <template #icon><DeleteOutlined /></template>
                  {{ t('cart.remove') }}
                </a-button>
              </template>
            </template>

            <!-- Header with Select All Checkbox -->
            <template #headerCell="{ column }">
              <template v-if="column.key === 'checkbox'">
                <a-checkbox
                  :checked="isAllSelected"
                  :indeterminate="isIndeterminate"
                  @change="(e: any) => toggleSelectAll(e.target.checked)"
                />
              </template>
              <template v-else>
                {{ column.title }}
              </template>
            </template>
          </a-table>

          <div class="actions">
            <a-button danger @click="clearCart">
              {{ t('cart.clearCart') }}
            </a-button>
            <a-button @click="() => router.push('/products')">
              {{ t('cart.continueShopping') }}
            </a-button>
          </div>
        </a-card>

        <a-card class="summary-card">
          <h2>{{ t('cart.orderSummary') }}</h2>
          <div class="summary-row">
            <span>{{ t('cart.subtotal') }}:</span>
            <span>${{ calculateSubtotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>{{ t('cart.shipping') }}:</span>
            <span>${{ calculateShipping().toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>{{ t('cart.total') }}:</span>
            <span>${{ calculateTotal().toFixed(2) }}</span>
          </div>
          <p class="estimated-note">{{ t('cart.estimatedAmount') }}</p>
          <a-button
            type="primary"
            size="large"
            block
            :loading="checkingOut"
            :disabled="selectedItems.size === 0"
            @click="handleCheckout"
            class="checkout-button"
          >
            <template #icon><ShoppingOutlined /></template>
            {{ t('cart.proceedToCheckout') }}
          </a-button>
        </a-card>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons-vue'
import { useI18n } from '@/i18n'
import { getImageUrl, getToken, getUserInfo } from '@/utils/request'
import { getCart, updateCartItem } from '@/services/cart'
import { getAppConfig } from '@/services/settings'
import type { CartItem } from '@/models/cart'

const router = useRouter()
const { t } = useI18n()

const cartItems = ref<CartItem[]>([])
const selectedItems = ref<Set<number>>(new Set())
const shippingFee = ref<number>(10)
const freeShippingThreshold = ref<number>(99)
const checkingOut = ref(false)

const loadCart = async () => {
  try {
    const userInfo = getUserInfo()

    if (userInfo && userInfo.id) {
      // Load cart from backend
      const response = await getCart()
      if (response?.data) {
        // Handle both direct array and wrapped data
        const cartData = Array.isArray(response.data)
          ? response.data
          : response.data.items || []
        cartItems.value = cartData as CartItem[]

        // Initialize selected items from loaded data
        const initialSelected = new Set<number>()
        cartData.forEach((item: CartItem) => {
          if (item.selected) {
            initialSelected.add(item.productId)
          }
        })
        selectedItems.value = initialSelected

        // Sync with localStorage
        localStorage.setItem('cart', JSON.stringify(cartData))
        return
      }
    }
  } catch (error) {
    console.error('Failed to load cart from backend:', error)
  }

  // Fallback to localStorage if backend fails
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cartItems.value = cart
}

const loadConfig = async () => {
  try {
    const response = await getAppConfig()
    if (response?.data) {
      shippingFee.value = response.data.shippingFee || 10
      freeShippingThreshold.value = response.data.freeshippingThreshold || 99
    }
  } catch (error) {
    console.error('Failed to load config:', error)
  }
}

// Load on mount
loadCart()
loadConfig()

const toggleItem = (productId: number) => {
  const newSelected = new Set(selectedItems.value)
  if (newSelected.has(productId)) {
    newSelected.delete(productId)
  } else {
    newSelected.add(productId)
  }
  selectedItems.value = newSelected
}

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedItems.value = new Set(cartItems.value.map((item) => item.productId))
  } else {
    selectedItems.value = new Set()
  }
}

const updateQuantity = (productId: number, quantity: number) => {
  if (quantity < 1) return

  const updatedCart = cartItems.value.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  )

  cartItems.value = updatedCart
  localStorage.setItem('cart', JSON.stringify(updatedCart))
  window.dispatchEvent(new Event('storage'))
}

const removeItem = (productId: number) => {
  const updatedCart = cartItems.value.filter(
    (item) => item.productId !== productId,
  )
  cartItems.value = updatedCart

  // Remove from selected items
  const newSelected = new Set(selectedItems.value)
  newSelected.delete(productId)
  selectedItems.value = newSelected

  localStorage.setItem('cart', JSON.stringify(updatedCart))
  message.success(t('cart.removeItem'))
  window.dispatchEvent(new Event('storage'))
}

const clearCart = () => {
  cartItems.value = []
  selectedItems.value = new Set()
  localStorage.setItem('cart', JSON.stringify([]))
  message.success(t('cart.clearCart'))
  window.dispatchEvent(new Event('storage'))
}

const handleCheckout = async () => {
  if (selectedItems.value.size === 0) {
    message.warning('请先选择要购买的商品')
    return
  }

  const token = getToken()
  if (!token) {
    message.warning(t('checkout.loginRequired'))
    router.push('/user/login')
    return
  }

  // Update selected status for all items
  try {
    checkingOut.value = true
    for (const item of cartItems.value) {
      const isSelected = selectedItems.value.has(item.productId)
      if (isSelected && item.id) {
        await updateCartItem({
          id: item.id,
          quantity: item.quantity,
          selected: true,
        })
      }
    }

    router.push('/checkout')
  } catch (error) {
    console.error('Failed to update cart items:', error)
  } finally {
    checkingOut.value = false
  }
}

const calculateSubtotal = () => {
  return cartItems.value
    .filter((item) => selectedItems.value.has(item.productId))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
}

const calculateShipping = () => {
  const subtotal = calculateSubtotal()
  if (subtotal >= freeShippingThreshold.value) {
    return 0
  }
  return shippingFee.value
}

const calculateTotal = () => {
  return calculateSubtotal() + calculateShipping()
}

const isAllSelected = computed(() =>
  cartItems.value.length > 0 && selectedItems.value.size === cartItems.value.length
)

const isIndeterminate = computed(() =>
  selectedItems.value.size > 0 && selectedItems.value.size < cartItems.value.length
)

const columns = [
  {
    title: 'checkbox',
    key: 'checkbox',
    width: 50,
  },
  {
    title: t('cart.items'),
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: t('cart.price'),
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: t('cart.quantity'),
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: t('cart.subtotal'),
    key: 'subtotal',
  },
  {
    title: t('common.edit'),
    key: 'action',
  },
]
</script>

<style scoped>
.cart-page {
  width: 100%;
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
}

.card {
  margin-bottom: 24px;
  border-radius: 8px;
}

.actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.summary-card {
  border-radius: 8px;
}

.summary-card h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.summary-row.total {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 16px;
  font-weight: bold;
  color: #ff4d4f;
}

.estimated-note {
  color: #999;
  font-size: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.checkout-button {
  margin-top: 16px;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.product-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
