<template>
  <div class="category-nav">
    <div class="container">
      <div class="menu-wrapper" :class="{ expanded }">
        <a-menu
          mode="horizontal"
          :items="items"
          :selectedKeys="[]"
          class="menu"
        />
      </div>
      <button v-if="hasOverflow" class="expand-btn" @click="expanded = !expanded">
        {{ expanded ? '收起' : '更多' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, h, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import { getCategoryList } from '@/services/category'
import { useI18n } from '@/i18n'
import type { Category } from '@/models/category'

const router = useRouter()
const { t, i18n } = useI18n()
const categories = ref<Category[]>([])
const expanded = ref(false)
const hasOverflow = ref(false)
const menuWrapper = ref<HTMLElement>()

onMounted(() => {
  loadCategories()
})

const loadCategories = async () => {
  try {
    const response = await getCategoryList()
    categories.value = response.data || []

    // 检查是否溢出
    await nextTick()
    checkOverflow()
    window.addEventListener('resize', checkOverflow)
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

const checkOverflow = () => {
  const el = menuWrapper.value
  if (el) {
    const scrollHeight = el.scrollHeight
    const clientHeight = el.clientHeight
    hasOverflow.value = scrollHeight > clientHeight + 5
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
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-sizing: border-box;
  position: relative;
}

.menu-wrapper {
  flex: 1;
  overflow: hidden;
  max-height: 55px;
  transition: max-height 0.3s ease;
}

.menu-wrapper.expanded {
  max-height: none;
  overflow: visible;
}

.menu {
  border: none !important;
}

.expand-btn {
  padding: 6px 12px;
  margin-left: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.3s;
}

.expand-btn:hover {
  background: #0050b3;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .expand-btn {
    padding: 4px 8px;
    font-size: 12px;
    margin-left: 8px;
  }
}
</style>

