<template>
  <div>
    <a-spin :spinning="loading">
      <template v-if="product">
        <a-space direction="vertical" :size="16" style="width: 100%">
          <a-card
            title="商品详情"
          >
            <template #extra>
              <a-space>
                <a-button @click="router.push('/products')">
                  <template #icon><ArrowLeftOutlined /></template>
                  返回列表
                </a-button>
                <a-button type="primary" @click="router.push(`/products/${productId}/edit`)">
                  <template #icon><EditOutlined /></template>
                  编辑商品
                </a-button>
              </a-space>
            </template>

            <a-descriptions :column="2" bordered>
              <a-descriptions-item label="商品ID">{{ product.id }}</a-descriptions-item>
              <a-descriptions-item label="商品名称">{{ product.name }}</a-descriptions-item>
              <a-descriptions-item label="商品分类">{{ product.categoryName || '-' }}</a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-tag :color="statusMap[product.status]?.color || 'default'">
                  {{ statusMap[product.status]?.text || '未知' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="售价">¥{{ (product.price || 0).toFixed(2) }}</a-descriptions-item>
              <a-descriptions-item label="原价">
                {{ product.originalPrice ? `¥${product.originalPrice.toFixed(2)}` : '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="库存">
                <a-tag :color="product.stock > 0 ? 'green' : 'red'">{{ product.stock }}</a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="销量">{{ product.sales || 0 }}</a-descriptions-item>
              <a-descriptions-item label="评分">
                {{ product.rating ? `${product.rating.toFixed(1)} 分` : '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="创建时间">{{ product.createTime || '-' }}</a-descriptions-item>
              <a-descriptions-item label="更新时间">{{ product.updateTime || '-' }}</a-descriptions-item>
              <a-descriptions-item label="商品描述" :span="2">
                {{ product.description || '-' }}
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

          <a-card v-if="product.images && product.images.length > 0" title="商品图片">
            <a-image-preview-group>
              <a-space :size="12" wrap>
                <a-image
                  v-for="(img, index) in product.images"
                  :key="index"
                  :width="150"
                  :height="150"
                  :src="normalizeImageUrl(img)"
                  fallback="/placeholder.png"
                  style="object-fit: cover"
                />
              </a-space>
            </a-image-preview-group>
          </a-card>
        </a-space>
      </template>

      <a-card v-else-if="!loading">
        <a-empty description="商品不存在" />
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons-vue'
import { getProductDetail } from '@/services/product'
import { getImageUrl } from '@/utils/request'
import { ProductStatus } from '@/models/product'
import type { Product } from '@/models/product'

const router = useRouter()
const route = useRoute()
const productId = Number(route.params.id)

const loading = ref(true)
const product = ref<Product | null>(null)

const statusMap: Record<ProductStatus, { color: string; text: string }> = {
  [ProductStatus.DRAFT]: { color: 'default', text: '草稿' },
  [ProductStatus.ACTIVE]: { color: 'green', text: '上架' },
  [ProductStatus.INACTIVE]: { color: 'red', text: '下架' },
}

const normalizeImageUrl = (url?: string | null): string => {
  if (!url) return ''
  if (typeof url !== 'string') return ''
  if (url.startsWith('http')) return url
  return getImageUrl(url)
}

const loadProduct = async () => {
  if (!productId) return
  loading.value = true
  try {
    const response = await getProductDetail(productId)
    product.value = response.data ?? null
  } catch {
    message.error('加载商品详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>
