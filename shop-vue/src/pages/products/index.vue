<template>
  <div>
    <!-- Search Form -->
    <a-card :bordered="false" style="margin-bottom: 16px">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="商品名称">
          <a-input
            v-model:value="searchForm.keyword"
            placeholder="请输入商品名称"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择状态"
            allow-clear
            style="width: 150px"
          >
            <a-select-option :value="ProductStatus.DRAFT">草稿</a-select-option>
            <a-select-option :value="ProductStatus.ACTIVE">上架</a-select-option>
            <a-select-option :value="ProductStatus.INACTIVE">下架</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit">搜索</a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Table -->
    <a-card :bordered="false">
      <div style="margin-bottom: 16px">
        <a-button type="primary" @click="router.push('/products/create')">
          <template #icon><PlusOutlined /></template>
          新建商品
        </a-button>
      </div>

      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1300 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'mainImage'">
            <a-image
              :width="60"
              :height="60"
              :src="getProductImage(record)"
              fallback="/placeholder.png"
              :preview="false"
              style="object-fit: cover"
            />
          </template>
          <template v-else-if="column.dataIndex === 'name'">
            <span class="text-ellipsis">{{ record.name }}</span>
          </template>
          <template v-else-if="column.dataIndex === 'price'">
            ¥{{ (record.price || 0).toFixed(2) }}
          </template>
          <template v-else-if="column.dataIndex === 'originalPrice'">
            {{ record.originalPrice ? `¥${record.originalPrice.toFixed(2)}` : '-' }}
          </template>
          <template v-else-if="column.dataIndex === 'stock'">
            <a-tag :color="record.stock > 0 ? 'green' : 'red'">{{ record.stock }}</a-tag>
          </template>
          <template v-else-if="column.dataIndex === 'status'">
            <a-tag :color="statusMap[record.status as ProductStatus]?.color || 'default'">
              {{ statusMap[record.status as ProductStatus]?.text || '未知' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-dropdown>
              <a-button type="text" size="small">
                <MoreOutlined />
              </a-button>
              <template #overlay>
                <a-menu @click="({ key }: any) => handleMenuClick(key, record)">
                  <a-menu-item key="view"><EyeOutlined /> 查看</a-menu-item>
                  <a-menu-item key="edit"><EditOutlined /> 编辑</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="status">
                    {{ record.status === ProductStatus.ACTIVE ? '下架' : '上架' }}
                  </a-menu-item>
                  <a-menu-item key="delete" danger>删除</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { getProductList, deleteProduct, updateProductStatus } from '@/services/product'
import { getImageUrl } from '@/utils/request'
import { ProductStatus } from '@/models/product'
import type { Product } from '@/models/product'

const router = useRouter()
const loading = ref(false)
const dataSource = ref<Product[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = reactive({
  keyword: undefined as string | undefined,
  status: undefined as ProductStatus | undefined,
})

const statusMap: Record<ProductStatus, { color: string; text: string }> = {
  [ProductStatus.DRAFT]: { color: 'default', text: '草稿' },
  [ProductStatus.ACTIVE]: { color: 'green', text: '上架' },
  [ProductStatus.INACTIVE]: { color: 'red', text: '下架' },
}

const columns = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '商品图片', dataIndex: 'mainImage', width: 80 },
  { title: '商品名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '分类', dataIndex: 'categoryName', width: 120 },
  { title: '价格', dataIndex: 'price', width: 100 },
  { title: '原价', dataIndex: 'originalPrice', width: 100 },
  { title: '库存', dataIndex: 'stock', width: 80 },
  { title: '销量', dataIndex: 'sales', width: 80 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (t: number) => `共 ${t} 条`,
}))

const normalizeImageUrl = (url?: string | null): string => {
  if (!url) return ''
  if (typeof url !== 'string') return ''
  if (url.startsWith('http')) return url
  return getImageUrl(url)
}

const getProductImage = (record: Product): string => {
  const imgPath = record.mainImage || (record.images && record.images.length > 0 ? record.images[0] : null)
  if (!imgPath) return '/placeholder.png'
  return normalizeImageUrl(imgPath)
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await getProductList({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.keyword,
      status: searchForm.status,
    })
    const data = response.data
    dataSource.value = data?.list || []
    total.value = data?.total || 0
  } catch {
    message.error('加载商品列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = undefined
  searchForm.status = undefined
  currentPage.value = 1
  fetchData()
}

const handleTableChange = (pag: any) => {
  currentPage.value = pag.current
  pageSize.value = pag.pageSize
  fetchData()
}

const handleMenuClick = (key: string, record: Product) => {
  switch (key) {
    case 'view':
      router.push(`/products/${record.id}`)
      break
    case 'edit':
      router.push(`/products/${record.id}/edit`)
      break
    case 'status':
      handleStatusChange(
        record.id,
        record.status === ProductStatus.ACTIVE ? ProductStatus.INACTIVE : ProductStatus.ACTIVE,
      )
      break
    case 'delete':
      handleDelete(record.id)
      break
  }
}

const handleStatusChange = async (id: number, status: ProductStatus) => {
  try {
    await updateProductStatus(id, status)
    message.success('状态更新成功')
    fetchData()
  } catch {
    message.error('状态更新失败')
  }
}

const handleDelete = (id: number) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个商品吗？此操作不可恢复。',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteProduct(id)
        message.success('删除成功')
        fetchData()
      } catch {
        message.error('删除失败')
      }
    },
  })
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.text-ellipsis {
  max-width: 200px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
</style>
