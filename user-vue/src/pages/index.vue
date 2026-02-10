<template>
  <div class="home-page">
    <CategoryNav />

    <!-- Hero Carousel -->
    <div class="hero">
      <a-carousel v-if="carouselImages.length > 0" autoplay class="carousel">
        <template #default>
          <div v-for="(img, index) in carouselImages" :key="`${img}-${index}`" class="carousel-item">
            <div
              class="carousel-bg"
              :style="{ backgroundImage: `url(${getImageUrl(img)})` }"
            />
            <img
              class="carousel-image"
              :src="getImageUrl(img)"
              :alt="`carousel-${index}`"
            />
          </div>
        </template>
      </a-carousel>
      <div v-else class="carousel-empty">
        <div class="carousel-content">
          <h1>{{ t('home.carouselEmptyTitle') }}</h1>
          <p>{{ t('home.carouselEmptyDesc') }}</p>
        </div>
      </div>
    </div>

    <!-- Products Section -->
    <div class="container">
      <a-spin :spinning="loading">
        <!-- Hot Products -->
        <section class="section">
          <h2 class="section-title">🔥 {{ t('home.hotProducts') }}</h2>
          <a-row :gutter="[16, 16]">
            <a-col v-for="product in hotProducts" :key="product.id" :xs="12" :sm="12" :md="6" :lg="6">
              <ProductCard :product="product" />
            </a-col>
          </a-row>
        </section>

        <!-- New Arrivals -->
        <section class="section">
          <h2 class="section-title">✨ {{ t('home.newArrivals') }}</h2>
          <a-row :gutter="[16, 16]">
            <a-col v-for="product in newProducts" :key="product.id" :xs="12" :sm="12" :md="6" :lg="6">
              <ProductCard :product="product" />
            </a-col>
          </a-row>
        </section>

        <!-- Features -->
        <section class="section">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :sm="8">
              <a-card class="feature-card">
                <div class="feature-icon">🚚</div>
                <h3>{{ t('home.freeShipping') }}</h3>
                <p>{{ t('home.freeShippingDesc') }}</p>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-card class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>{{ t('home.securePayment') }}</h3>
                <p>{{ t('home.securePaymentDesc') }}</p>
              </a-card>
            </a-col>
            <a-col :xs="24" :sm="8">
              <a-card class="feature-card">
                <div class="feature-icon">🎁</div>
                <h3>{{ t('home.bestQuality') }}</h3>
                <p>{{ t('home.bestQualityDesc') }}</p>
              </a-card>
            </a-col>
          </a-row>
        </section>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProductList, getLatestProducts } from '@/services/product'
import { getAppConfig } from '@/services/settings'
import { getImageUrl } from '@/utils/request'
import { useI18n } from '@/i18n'
import ProductCard from '@/components/ProductCard.vue'
import CategoryNav from '@/components/CategoryNav.vue'
import type { Product } from '@/models/product'

const { t } = useI18n()
const hotProducts = ref<Product[]>([])
const newProducts = ref<Product[]>([])
const loading = ref(true)
const carouselImages = ref<string[]>([])

onMounted(() => {
  loadProducts()
  loadCarousel()
})

const loadProducts = async () => {
  try {
    loading.value = true
    const response = await getProductList({ pageNum: 1, pageSize: 8 })
    const data = response.data

    // Simulate hot products (first 4)
    if (data && data.list) {
      hotProducts.value = data.list.slice(0, 4)
    }

    // Load latest products (use new API)
    const latestResponse = await getLatestProducts(4)
    newProducts.value = latestResponse.data || []
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const loadCarousel = async () => {
  try {
    const response = await getAppConfig()
    const images = response.data?.carouselImages || []
    carouselImages.value = images
  } catch (error) {
    carouselImages.value = []
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero {
  margin-bottom: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  flex-shrink: 0;
}

.carousel {
  width: 100%;
  height: 500px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-item {
  height: 500px;
  background: #f5f5f5;
  display: flex !important;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.carousel-bg {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background-size: cover;
  background-position: center;
  filter: blur(20px) brightness(0.9);
  z-index: 1;
}

.carousel-image {
  position: relative;
  z-index: 2;
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  object-position: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.carousel-empty {
  height: 400px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-content {
  text-align: center;
  color: #fff;
}

.carousel-content h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #fff;
}

.carousel-content p {
  font-size: 20px;
  margin: 0;
}


.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
}

.section {
  margin-bottom: 48px;
}

.section-title {
  margin-bottom: 32px;
  font-weight: 800;
  font-size: 28px;
  color: #333;
  position: relative;
  padding-left: 16px;
}

.section-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: #1890ff;
  border-radius: 2px;
}

.feature-card {
  text-align: center;
  border-radius: 12px;
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  border-color: #1890ff;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 24px;
  background: #f0f5ff;
  width: 88px;
  height: 88px;
  line-height: 88px;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  color: #1890ff;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-card p {
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .hero {
    margin-bottom: 0;
    margin-left: calc(-50vw + 50%);
  }

  .carousel {
    height: 300px;
    border-radius: 0;
  }

  .carousel-item {
    height: 300px;
  }

  .carousel-image {
    object-fit: contain;
  }

  .carousel-empty {
    height: 300px;
  }

  .carousel-content h1 {
    font-size: 28px;
  }

  .carousel-content p {
    font-size: 16px;
  }

  .container {
    padding: 24px 16px;
  }

  .section-title {
    font-size: 20px;
    margin-bottom: 24px;
  }

  .feature-card {
    margin-bottom: 16px;
  }
}
</style>
