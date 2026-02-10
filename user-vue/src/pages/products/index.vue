<template>
  <div class="product-list-page">
    <div class="container">
      <!-- Filters -->
      <div class="filters">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="12" :md="8">
            <a-input-search
              :placeholder="t('product.search')"
              allow-clear
              :value="searchText"
              @search="handleSearch"
              @change="(e: any) => setSearchText(e.target.value)"
            />
          </a-col>
          <a-col :xs="12" :sm="6" :md="4">
            <a-select
              :placeholder="t('product.category')"
              allow-clear
              style="width: 100%"
              :value="categoryId"
              @change="handleCategoryChange"
            >
              <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
                {{ getCategoryLabel(category) }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :xs="12" :sm="6" :md="4">
            <a-select
              :placeholder="t('product.sort')"
              allow-clear
              style="width: 100%"
              :value="sortBy"
              @change="handleSortChange"
            >
              <a-select-option value="price-asc">{{ t('product.priceLowToHigh') }}</a-select-option>
              <a-select-option value="price-desc">{{ t('product.priceHighToLow') }}</a-select-option>
              <a-select-option value="name-asc">{{ t('product.nameAtoZ') }}</a-select-option>
              <a-select-option value="name-desc">{{ t('product.nameZtoA') }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>

      <!-- Product Grid -->
      <a-spin :spinning="loading">
        <a-empty v-if="products.length === 0" :description="t('product.noProducts')" style="margin: 64px 0" />
        <div v-else>
          <a-row :gutter="[16, 16]" class="product-grid">
            <a-col v-for="product in products" :key="product.id" :xs="12" :sm="12" :md="8" :lg="6">
              <ProductCard :product="product" />
            </a-col>
          </a-row>

          <!-- Pagination -->
          <div class="pagination">
            <a-pagination
              :current="page"
              :page-size="pageSize"
              :total="total"
              @change="(p: number) => setPage(p)"
              :show-less-items="false"
              :show-size-changer="false"
              show-total
            />
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductList } from '@/services/product'
import { getCategoryList } from '@/services/category'
import ProductCard from '@/components/ProductCard.vue'
import { useI18n } from '@/i18n'
import type { Product, ProductListParams } from '@/models/product'
import type { Category } from '@/models/category'

const router = useRouter()
const route = useRoute()
const { t, i18n } = useI18n()

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const loading = ref(false)
const page = ref(1)
const pageSize = ref(12)
const categoryId = ref<number | undefined>()
const searchText = ref('')
const sortBy = ref<string>('')

onMounted(() => {
  loadCategories()
  // Parse query params
  const category = route.query.category
  const search = route.query.search

  if (category) {
    categoryId.value = Number(category)
  }
  if (search) {
    searchText.value = String(search)
  }

  loadProducts()
})

// Watch for changes to reload products
watch(() => [page.value, categoryId.value, searchText.value, sortBy.value], () => {
  loadProducts()
})

const loadCategories = async () => {
  try {
    const response = await getCategoryList()
    categories.value = response.data || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const loadProducts = async () => {
  try {
    loading.value = true
    const params: ProductListParams = {
      pageNum: page.value,
      pageSize: pageSize.value,
    }

    if (categoryId.value) {
      params.categoryId = categoryId.value
    }

    if (searchText.value) {
      params.keyword = searchText.value
    }

    if (sortBy.value) {
      const [field, order] = sortBy.value.split('-')
      params.sortBy = field
      params.sortOrder = order as 'asc' | 'desc'
    }

    const response = await getProductList(params)
    const data = response.data

    if (data) {
      products.value = data.list || []
      total.value = data.total || 0
    }
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

const handleCategoryChange = (value: number | null) => {
  categoryId.value = value || undefined
  setPage(1)
  updateQueryParams()
}

const handleSearch = (value: string) => {
  searchText.value = value
  setPage(1)
  updateQueryParams()
}

const handleSortChange = (value: string | null) => {
  sortBy.value = value || ''
  setPage(1)
}

const getCategoryLabel = (category: Category) => {
  return i18n.language === 'zh-CN' ? category.categoryName : category.categoryCode
}

const setPage = (p: number) => {
  page.value = p
}

const setSearchText = (text: string) => {
  searchText.value = text
}

const updateQueryParams = () => {
  const params: any = {}
  if (categoryId.value) {
    params.category = categoryId.value
  }
  if (searchText.value) {
    params.search = searchText.value
  }
  router.push({ query: params })
}
</script>

<style scoped>
.product-list-page {
  width: 100%;
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.filters {
  margin-bottom: 32px;
}

.product-grid {
  margin-bottom: 32px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 24px 0;
}
</style>
