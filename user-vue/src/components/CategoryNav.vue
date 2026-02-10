<template>
  <div class="category-nav">
    <a-menu
      mode="horizontal"
      :items="items"
      :selectedKeys="[]"
      class="menu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import { getCategoryList } from '@/services/category'
import { useI18n } from '@/i18n'
import type { Category } from '@/models/category'

const router = useRouter()
const { t, i18n } = useI18n()
const categories = ref<Category[]>([])

onMounted(() => {
  loadCategories()
})

const loadCategories = async () => {
  try {
    const response = await getCategoryList()
    categories.value = response.data || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const handleCategoryClick = (categoryId: number) => {
  router.push(`/products?category=${categoryId}`)
}

const getCategoryLabel = (category: Category) => {
  return i18n.language === 'zh-CN' ? category.categoryName : category.categoryCode
}

const items = computed(() => [
  {
    key: 'all',
    icon: () => h(AppstoreOutlined),
    label: t('product.allProducts'),
    onClick: () => router.push('/products'),
  },
  ...categories.value.map((category: Category) => ({
    key: category.id.toString(),
    label: getCategoryLabel(category),
    onClick: () => handleCategoryClick(category.id),
  })),
])
</script>

<style scoped>
.category-nav {
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  padding: 0;
}

.menu {
  border: none !important;
}
</style>

