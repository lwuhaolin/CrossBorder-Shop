<template>
  <div class="product-detail-page">
    <div class="container">
      <a-spin :spinning="loading">
        <a-empty v-if="!product && !loading" :description="t('product.noProducts')" />

        <a-card v-else-if="product" class="card">
          <a-row :gutter="[32, 32]">
            <!-- Product Image -->
            <a-col :xs="24" :md="12">
              <div class="image-wrapper">
                <img :src="getImageUrl(product.mainImage)" :alt="product.name" class="image" />
              </div>
            </a-col>

            <!-- Product Info -->
            <a-col :xs="24" :md="12">
              <div class="product-info">
                <h1 class="product-name">{{ product.name }}</h1>

                <div class="price">
                  <span class="price-label">{{ t('product.price') }}:</span>
                  <span class="price-value">${{ product.price.toFixed(2) }}</span>
                </div>

                <div class="stock">
                  <span class="stock-label">{{ t('product.stock') }}:</span>
                  <span class="stock-value">
                    {{ product.stock > 0 ? `${product.stock} ${t('product.available')}` : t('product.outOfStock') }}
                  </span>
                </div>

                <div class="description">
                  <h3>{{ t('product.description') }}</h3>
                  <p>{{ product.description || t('product.noDescription') }}</p>
                </div>

                <div class="quantity">
                  <span class="quantity-label">{{ t('product.quantity') }}:</span>
                  <a-input-number
                    v-model:value="quantity"
                    :min="1"
                    :max="product.stock"
                    :disabled="product.stock === 0"
                  />
                </div>

                <div class="actions">
                  <a-button
                    type="primary"
                    size="large"
                    block
                    :loading="addingToCart"
                    :disabled="product.stock === 0"
                    @click="handleAddToCart"
                  >
                    <template #icon><ShoppingCartOutlined /></template>
                    {{ t('product.addToCart') }}
                  </a-button>
                  <a-button
                    size="large"
                    block
                    :disabled="product.stock === 0"
                    style="margin-top: 16px"
                    @click="handleBuyNow"
                  >
                    {{ t('product.buyNow') }}
                  </a-button>
                  <a-button
                    size="large"
                    block
                    style="margin-top: 16px"
                    @click="handleAddToFavorites"
                  >
                    <template #icon><HeartOutlined /></template>
                    {{ t('product.addToFavorite') }}
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>

          <!-- Tabs -->
          <div class="tabs">
            <a-tabs>
              <a-tab-pane key="description" :tab="t('product.description')">
                <div class="tab-content">
                  <p>{{ product.description || t('product.noDescription') }}</p>
                </div>
              </a-tab-pane>
              <a-tab-pane key="specifications" :tab="t('product.specifications')">
                <div class="tab-content">
                  <a-descriptions :column="1" bordered>
                    <a-descriptions-item :label="t('product.productId')">
                      {{ product.id }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="t('product.category')">
                      {{ i18n.language === 'zh-CN' ? product.categoryName : product.categoryCode }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="t('product.stock')">
                      {{ product.stock }}
                    </a-descriptions-item>
                    <a-descriptions-item :label="t('product.price')">
                      ${{ product.price.toFixed(2) }}
                    </a-descriptions-item>
                  </a-descriptions>
                </div>
              </a-tab-pane>
              <a-tab-pane key="reviews" :tab="t('product.reviews')">
                <div class="tab-content">
                  <a-empty :description="t('product.noReviews')" />
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons-vue'
import { getProductDetail } from '@/services/product'
import { addToCart } from '@/services/cart'
import { getImageUrl, getToken } from '@/utils/request'
import { useI18n } from '@/i18n'
import type { Product } from '@/models/product'

const router = useRouter()
const route = useRoute()
const { t, i18n } = useI18n()

const product = ref<Product | null>(null)
const loading = ref(true)
const addingToCart = ref(false)
const quantity = ref<number>(1)

onMounted(() => {
  const id = route.params.id
  if (id) {
    loadProduct()
  }
})

const loadProduct = async () => {
  try {
    loading.value = true
    const id = Number(route.params.id)
    const response = await getProductDetail(id)
    if (response?.data) {
      product.value = response.data
      quantity.value = 1
    }
  } catch (error) {
    console.error('Failed to load product:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async () => {
  if (!product.value) return

  if (product.value.stock === 0) {
    message.warning(t('product.outOfStock'))
    return
  }

  if (quantity.value > product.value.stock) {
    message.warning(`${t('product.available')} ${product.value.stock}`)
    return
  }

  try {
    addingToCart.value = true

    // Check if user is logged in
    const token = getToken()
    if (!token) {
      message.warning(t('checkout.loginRequired'))
      router.push('/user/login')
      return
    }

    // Call backend API
    await addToCart({
      productId: product.value.id,
      quantity: quantity.value,
    })

    // Also update local cart for offline support
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(
      (item: any) => item.productId === product.value!.id,
    )

    if (existingItem) {
      existingItem.quantity += quantity.value
    } else {
      cart.push({
        productId: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.mainImage,
        quantity: quantity.value,
      })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    message.success(t('common.addedToCart'))
    window.dispatchEvent(new Event('storage'))
  } catch (error: any) {
    message.error(error?.message || t('common.error'))
  } finally {
    addingToCart.value = false
  }
}

const handleBuyNow = async () => {
  await handleAddToCart()
  if (!addingToCart.value) {
    router.push('/cart')
  }
}

const handleAddToFavorites = () => {
  if (!product.value) return

  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
  const exists = favorites.find((item: any) => item.id === product.value!.id)

  if (exists) {
    message.info('Already in favorites')
    return
  }

  favorites.push({
    id: product.value.id,
    name: product.value.name,
    price: product.value.price,
    imageUrl: product.value.mainImage,
  })

  localStorage.setItem('favorites', JSON.stringify(favorites))
  message.success(t('product.addToFavorite'))
}
</script>

<style scoped>
.product-detail-page {
  width: 100%;
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.card {
  border-radius: 8px;
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f5f5f5;
}

.product-info {
  padding: 0;
}

.product-name {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 16px 0;
}

.price {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.price-label {
  margin-right: 8px;
  font-weight: 600;
}

.price-value {
  font-size: 24px;
  color: #ff4d4f;
  font-weight: bold;
}

.stock {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.stock-label {
  margin-right: 8px;
  font-weight: 600;
}

.stock-value {
  color: #52c41a;
}

.description {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.description h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.description p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.quantity {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.quantity-label {
  margin-right: 8px;
  font-weight: 600;
  margin-right: 16px;
}

.actions {
  margin-bottom: 24px;
}

.tabs {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.tab-content {
  padding: 24px 0;
}
</style>
