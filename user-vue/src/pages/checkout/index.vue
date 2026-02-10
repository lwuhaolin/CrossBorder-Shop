<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="title">{{ t('checkout.title') }}</h1>

      <div class="content">
        <div class="main">
          <a-card class="card">
            <a-steps :current="currentStep">
              <a-step v-for="(step, index) in steps" :key="index" :title="step.title" />
            </a-steps>

            <a-divider />

            <div class="steps-content">
              <!-- Step 1: Address Selection -->
              <div v-if="currentStep === 0" class="step-content">
                <h3>{{ t('checkout.selectDeliveryAddress') }}</h3>
                <div v-if="addresses.length > 0" class="address-list">
                  <a-radio-group v-model:value="selectedAddress" class="w-full">
                    <a-radio v-for="address in addresses" :key="address.id" :value="address.id" class="address-item">
                      <div>
                        <strong>{{ address.receiverName }}</strong> - {{ address.receiverPhone }}
                        <br />
                        {{ address.detailAddress }}, {{ address.city }}, {{ address.province }}
                        <span v-if="address.isDefault" class="default-badge">
                          {{ t('address.default') }}
                        </span>
                      </div>
                    </a-radio>
                  </a-radio-group>
                </div>
                <div v-else class="no-address">
                  <p>{{ t('checkout.noAddress') }}</p>
                  <a-button type="primary" @click="() => router.push('/user/addresses')">
                    {{ t('checkout.addAddress') }}
                  </a-button>
                </div>
              </div>

              <!-- Step 2: Payment Method Selection -->
              <div v-if="currentStep === 1" class="step-content">
                <h3>{{ t('checkout.selectPaymentMethod') }}</h3>
                <a-radio-group v-model:value="paymentMethod" class="payment-list w-full">
                  <a-radio value="credit_card" class="payment-item">
                    {{ t('checkout.creditCard') }}
                  </a-radio>
                  <a-radio value="debit_card" class="payment-item">
                    {{ t('checkout.debitCard') }}
                  </a-radio>
                  <a-radio value="paypal" class="payment-item">
                    {{ t('checkout.paypal') }}
                  </a-radio>
                  <a-radio value="cash_on_delivery" class="payment-item">
                    {{ t('checkout.cashOnDelivery') }}
                  </a-radio>
                </a-radio-group>
              </div>

              <!-- Step 3: Order Summary -->
              <div v-if="currentStep === 2" class="step-content">
                <h3>{{ t('checkout.orderSummary') }}</h3>
                <a-list :data-source="cartItems" :pagination="false">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <template #default>
                        <a-list-item-meta>
                          <template #avatar>
                            <img :src="getImageUrl(item.productImage)" :alt="item.productName" class="list-avatar" />
                          </template>
                          <template #title>{{ item.productName }}</template>
                          <template #description>
                            {{ t('checkout.quantity') }}: {{ item.quantity }}
                          </template>
                        </a-list-item-meta>
                        <div>${{ (item.price * item.quantity).toFixed(2) }}</div>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
              </div>
            </div>

            <div class="steps-action">
              <a-button v-if="currentStep > 0" style="margin: 0 8px" @click="goToPreviousStep">
                {{ t('checkout.previous') }}
              </a-button>
              <a-button v-if="currentStep < steps.length - 1" type="primary" @click="goToNextStep">
                {{ t('checkout.next') }}
              </a-button>
              <a-button v-if="currentStep === steps.length - 1" type="primary" :loading="loading" @click="handlePlaceOrder">
                {{ t('checkout.placeOrder') }}
              </a-button>
            </div>
          </a-card>
        </div>

        <div class="sidebar">
          <a-card class="summary-card">
            <h3>{{ t('checkout.orderSummary') }}</h3>

            <div class="currency-selector">
              <span>{{ t('checkout.currency') }}:</span>
              <a-select
                ref="currencySelect"
                v-model:value="selectedCurrency"
                style="width: 150px"
                @change="handleCurrencyChange"
              >
                <a-select-option v-for="curr in currencies" :key="curr.currencyCode" :value="curr.currencyCode">
                  {{ curr.currencyCode }} ({{ curr.symbol }})
                </a-select-option>
              </a-select>
            </div>

            <a-divider />

            <div class="summary-row">
              <span>{{ t('cart.subtotal') }}:</span>
              <span>
                {{ getCurrencySymbol() }}{{ calculateSubtotal().toFixed(2) }}
              </span>
            </div>
            <div class="summary-row">
              <span>{{ t('cart.shipping') }}:</span>
              <span>
                {{ getCurrencySymbol() }}{{ calculateShipping().toFixed(2) }}
              </span>
            </div>

            <a-divider />

            <div class="summary-row total">
              <span>{{ t('cart.total') }}:</span>
              <span>
                {{ getCurrencySymbol() }}{{ calculateTotal().toFixed(2) }}
              </span>
            </div>

            <a-divider style="margin: 12px 0" />

            <p class="estimated-note">{{ t('checkout.estimatedAmount') }}</p>
          </a-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useI18n } from '@/i18n'
import { getImageUrl } from '@/utils/request'
import { getAddressList } from '@/services/address'
import { createOrder } from '@/services/order'
import { getCurrencyList } from '@/services/exchange'
import { getAppConfig } from '@/services/settings'
import { clearCart } from '@/services/cart'
import type { Address } from '@/models/address'

interface CartItem {
  productId: number
  productName: string
  price: number
  productImage: string
  quantity: number
}

const router = useRouter()
const { t } = useI18n()

const currentStep = ref(0)
const addresses = ref<Address[]>([])
const selectedAddress = ref<number>()
const paymentMethod = ref('credit_card')
const cartItems = ref<CartItem[]>([])
const loading = ref(false)
const currencies = ref<any[]>([])
const selectedCurrency = ref('USD')
const shippingFee = ref<number>(10)
const freeShippingThreshold = ref<number>(99)

// Load data on mount
const loadAddresses = async () => {
  try {
    const response = await getAddressList()
    addresses.value = response.data || []
    if (response?.data && response.data.length > 0) {
      const defaultAddress = response.data.find((addr: Address) => addr.isDefault)
      selectedAddress.value = defaultAddress?.id || response.data[0]?.id
    }
  } catch (error) {
    console.error('Failed to load addresses:', error)
  }
}

const loadCurrencies = async () => {
  try {
    const response = await getCurrencyList()

    if (response?.data && response.data.length > 0) {
      currencies.value = response.data
      // Set default to base currency (isBase: 1) or first currency
      const baseCurrency = response.data.find((c: any) => c.isBase === 1)
      if (baseCurrency) {
        selectedCurrency.value = baseCurrency.currencyCode
      } else if (response.data.length > 0) {
        selectedCurrency.value = response.data[0]?.currencyCode || 'USD'
      }
    }
  } catch (error) {
    console.error('Failed to load currencies:', error)
  }
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

const loadCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  if (cart.length === 0) {
    message.warning(t('checkout.emptyCart'))
    router.push('/cart')
    return
  }
  cartItems.value = cart
}

loadAddresses()
loadCart()
loadCurrencies()
loadConfig()

const calculateSubtotal = () => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
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

const getCurrencySymbol = () => {
  const curr = currencies.value.find((c) => c.currencyCode === selectedCurrency.value)
  return curr?.symbol || '$'
}

const handleCurrencyChange = () => {
  // 币种变更后，下拉菜单会自动关闭
  // 无需额外操作
}

const goToPreviousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1
  }
}

const goToNextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value += 1
  }
}

const handlePlaceOrder = async () => {
  if (!selectedAddress.value) {
    message.error(t('checkout.selectAddress'))
    return
  }

  try {
    loading.value = true

    const orderData = {
      addressId: selectedAddress.value,
      items: cartItems.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: calculateTotal(),
      paymentMethod: paymentMethod.value,
      targetCurrency: selectedCurrency.value,
    }

    const response = await createOrder(orderData)

    // 清空本地购物车
    localStorage.setItem('cart', JSON.stringify([]))
    window.dispatchEvent(new Event('storage'))

    // 调用后端API清空购物车
    try {
      await clearCart()
    } catch (error) {
      console.warn('Failed to clear cart on backend:', error)
      // 不影响订单创建的流程
    }

    message.success(t('checkout.orderPlaced'))
    router.push(`/user/orders/${response.data}`)
  } catch (error) {
    console.error('Failed to place order:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const steps = [
  {
    title: t('checkout.step1'),
  },
  {
    title: t('checkout.step2'),
  },
  {
    title: t('checkout.step3'),
  },
]
</script>

<style scoped>
.checkout-page {
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

.content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}

.main {
  min-width: 0;
}

.card {
  border-radius: 8px;
}

.steps-content {
  min-height: 300px;
  padding: 24px 0;
}

.step-content {
  padding: 0;
}

.step-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-item {
  width: 100%;
}

.default-badge {
  margin-left: 8px;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 2px;
  font-size: 12px;
}

.no-address {
  text-align: center;
  padding: 24px;
}

.no-address p {
  margin-bottom: 16px;
  color: #666;
}

.payment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-item {
  width: 100%;
}

.steps-action {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}

.sidebar {
  position: relative;
}

.summary-card {
  border-radius: 8px;
  position: sticky;
  top: 24px;
}

.summary-card h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.currency-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
}

.currency-selector span {
  flex-shrink: 0;
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
  margin: 0;
}

.list-avatar {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.w-full {
  width: 100%;
}
</style>
