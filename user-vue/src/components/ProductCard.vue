<template>
  <a-card hoverable class="product-card">
    <template #cover>
      <div class="image-wrapper">
        <img
          :alt="product.productName || product.name"
          :src="getImageUrl(product.mainImage)"
          class="image"
        />
        <div v-if="product.stock === 0" class="out-of-stock">
          {{ t('product.outOfStock') }}
        </div>
      </div>
    </template>

    <template #actions>
      <a-button type="text" @click="handleViewDetail">
        <template #icon><EyeOutlined /></template>
        {{ t('product.view') }}
      </a-button>
      <a-button
        type="text"
        :disabled="product.stock === 0"
        @click="handleAddToCart"
      >
        <template #icon><ShoppingCartOutlined /></template>
        {{ t('product.addToCart') }}
      </a-button>
    </template>

    <div class="title" :title="product.productName || product.name">
      {{ product.productName || product.name }}
    </div>
    <div class="description">
      <div class="price">${{ product.price.toFixed(2) }}</div>
      <div class="stock">
        {{ t('product.stock') }}: {{ product.stock }}
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { getImageUrl, getToken } from '@/utils/request'
import { addToCart } from '@/services/cart'
import { useI18n } from '@/i18n'
import type { Product } from '@/models/product'

const router = useRouter()
const { t } = useI18n()

interface Props {
  product: Product
  onAddToCart?: (product: Product) => void
}

const props = withDefaults(defineProps<Props>(), {})

const handleAddToCart = async (e: Event) => {
  e.stopPropagation()

  if (props.product.stock === 0) {
    message.warning(t('product.outOfStock'))
    return
  }

  // Check if user is logged in
  const token = getToken()
  if (!token) {
    message.warning(t('checkout.loginRequired'))
    router.push('/user/login')
    return
  }

  try {
    // Call backend API to add to cart
    await addToCart({
      productId: props.product.id,
      quantity: 1,
    })

    // Also update local cart for offline support
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(
      (item: any) => item.productId === props.product.id,
    )

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        productId: props.product.id,
        name: props.product.productName || props.product.name,
        price: props.product.price,
        image: props.product.mainImage,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    message.success(t('common.addedToCart'))

    if (props.onAddToCart) {
      props.onAddToCart(props.product)
    }

    window.dispatchEvent(new Event('storage'))
  } catch (error: any) {
    message.error(error?.message || t('common.error'))
  }
}

const handleViewDetail = () => {
  router.push(`/products/${props.product.id}`)
}
</script>

<style scoped>
.product-card {
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.out-of-stock {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.title {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
}

.description {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}

.stock {
  font-size: 12px;
  color: #666;
}
</style>
