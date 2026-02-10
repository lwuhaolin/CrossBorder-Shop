<template>
  <div class="favorites-page">
    <div v-if="favorites.length === 0" class="container">
      <a-card>
        <a-empty :description="t('favorite.empty')" :image="Empty.PRESENTED_IMAGE_SIMPLE">
          <a-button type="primary" @click="browseProducts">
            {{ t('favorite.browseProducts') }}
          </a-button>
        </a-empty>
      </a-card>
    </div>
    <div v-else class="container">
      <h1 class="title">{{ t('favorite.myFavorites') }}</h1>

      <a-row :gutter="[16, 16]">
        <a-col v-for="item in favorites" :key="item.id" :xs="12" :sm="12" :md="8" :lg="6">
          <a-card hoverable class="product-card">
            <template #cover>
              <img
                :alt="item.name"
                :src="getImageUrl(item.imageUrl)"
                class="image"
                @click="goToProduct(item.id)"
              />
            </template>

            <template #actions>
              <a-button type="text" @click="handleAddToCart(item)">
                <template #icon>
                  <ShoppingCartOutlined />
                </template>
                {{ t('favorite.addToCart') }}
              </a-button>
              <a-button type="text" danger @click="handleRemove(item.id)">
                <template #icon>
                  <DeleteOutlined />
                </template>
                {{ t('favorite.remove') }}
              </a-button>
            </template>

            <a-card-meta :title="item.name" :description="`$${item.price.toFixed(2)}`" />
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { useRouter } from 'vue-router'
import { message, Empty } from 'ant-design-vue'
import { ShoppingCartOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { getImageUrl } from '@/utils/request'

interface FavoriteItem {
  id: number
  name: string
  price: number
  imageUrl: string
}

const { t } = useI18n()
const router = useRouter()

const favorites = ref<FavoriteItem[]>([])

onMounted(() => {
  loadFavorites()
})

const loadFavorites = () => {
  const data = JSON.parse(localStorage.getItem('favorites') || '[]')
  favorites.value = data
}

const handleRemove = (id: number) => {
  const updated = favorites.value.filter((item) => item.id !== id)
  favorites.value = updated
  localStorage.setItem('favorites', JSON.stringify(updated))
  message.success(t('favorite.removed'))
}

const handleAddToCart = (item: FavoriteItem) => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existingItem = cart.find((cartItem: any) => cartItem.productId === item.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.imageUrl,
      quantity: 1,
    })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  message.success(t('favorite.addedToCart'))
  window.dispatchEvent(new Event('storage'))
}

const browseProducts = () => {
  router.push('/products')
}

const goToProduct = (id: number) => {
  router.push(`/products/${id}`)
}
</script>

<style scoped>
.favorites-page {
  min-height: calc(100vh - 64px - 200px);
  background: #f5f5f5;
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  margin: 0 0 24px 0;
}

.product-card {
  cursor: pointer;
}

.image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .title {
    font-size: 22px;
  }

  .image {
    height: 150px;
  }
}
</style>
