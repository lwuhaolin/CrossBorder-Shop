<template>
  <div>
    <a-spin :spinning="pageLoading">
      <template v-if="product">
        <a-card title="编辑商品" :bordered="false">
          <a-form
            ref="formRef"
            :model="formState"
            :rules="rules"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-item label="商品名称" name="name">
              <a-input
                v-model:value="formState.name"
                placeholder="请输入商品名称"
                :maxlength="100"
              />
            </a-form-item>

            <a-form-item label="商品描述" name="description">
              <a-textarea
                v-model:value="formState.description"
                placeholder="请输入商品描述"
                :rows="4"
                :maxlength="500"
                show-count
              />
            </a-form-item>

            <a-form-item label="售价" name="price">
              <a-input-number
                v-model:value="formState.price"
                placeholder="请输入售价"
                :min="0"
                :precision="2"
                :prefix="currencySymbol"
                style="width: 200px"
              />
            </a-form-item>

            <a-form-item label="原价" name="originalPrice">
              <a-input-number
                v-model:value="formState.originalPrice"
                placeholder="请输入原价"
                :min="0"
                :precision="2"
                :prefix="currencySymbol"
                style="width: 200px"
              />
            </a-form-item>

            <a-form-item label="币种" name="currency">
              <a-select
                v-model:value="formState.currency"
                placeholder="请选择币种"
                style="width: 300px"
                @change="handleCurrencyChange"
              >
                <a-select-option
                  v-for="c in currencies"
                  :key="c.currencyCode"
                  :value="c.currencyCode"
                >
                  {{ c.currencyName }} ({{ c.currencyCode }})
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="库存" name="stock">
              <a-input-number
                v-model:value="formState.stock"
                placeholder="请输入库存数量"
                :min="0"
                :precision="0"
                style="width: 200px"
              />
            </a-form-item>

            <a-form-item label="商品分类" name="categoryId">
              <a-select
                v-model:value="formState.categoryId"
                placeholder="请选择商品分类"
                style="width: 300px"
              >
                <a-select-option
                  v-for="cat in categories"
                  :key="cat.id"
                  :value="cat.id"
                >
                  {{ cat.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="商品状态" name="status">
              <a-radio-group v-model:value="formState.status">
                <a-radio :value="ProductStatus.DRAFT">草稿</a-radio>
                <a-radio :value="ProductStatus.ACTIVE">上架</a-radio>
                <a-radio :value="ProductStatus.INACTIVE">下架</a-radio>
              </a-radio-group>
            </a-form-item>

            <a-form-item label="商品图片" name="images">
              <a-upload
                v-model:file-list="fileList"
                list-type="picture-card"
                :custom-request="handleUpload"
                accept="image/*"
              >
                <div v-if="fileList.length < 5">
                  <PlusOutlined />
                  <div style="margin-top: 8px">上传</div>
                </div>
              </a-upload>
              <div style="color: #999; font-size: 12px">最多上传5张图片，第一张为主图（必填）</div>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 4, span: 16 }">
              <a-space>
                <a-button type="primary" :loading="submitting" @click="handleSubmit">保存</a-button>
                <a-button @click="router.push(`/products/${productId}`)">取消</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </template>

      <a-card v-else-if="!pageLoading">
        <a-empty description="商品不存在" />
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import type { FormInstance, UploadFile, UploadProps } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { getProductDetail, updateProduct, uploadProductImages } from '@/services/product'
import { getCategoryList } from '@/services/category'
import { getCurrencies, getExchangeRateByPair } from '@/services/rate'
import { getImageUrl } from '@/utils/request'
import { ProductStatus } from '@/models/product'
import type { Product, ProductUpdateDTO } from '@/models/product'
import type { Category } from '@/models/category'

interface CurrencyItem {
  currencyCode: string
  currencyName: string
  symbol?: string
  isBase?: number
}

const router = useRouter()
const route = useRoute()
const productId = Number(route.params.id)

const formRef = ref<FormInstance>()
const fileList = ref<UploadFile[]>([])
const submitting = ref(false)
const pageLoading = ref(true)
const product = ref<Product | null>(null)
const currencies = ref<CurrencyItem[]>([])
const categories = ref<Category[]>([])
const currencySymbol = ref('¥')
const lastCurrency = ref<string | undefined>(undefined)

const formState = reactive({
  name: '',
  description: '',
  price: undefined as number | undefined,
  originalPrice: undefined as number | undefined,
  currency: undefined as string | undefined,
  stock: undefined as number | undefined,
  categoryId: undefined as number | undefined,
  status: ProductStatus.DRAFT as ProductStatus,
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称' },
    { max: 100, message: '商品名称不能超过100个字符' },
  ],
  price: [{ required: true, message: '请输入售价' }],
  stock: [{ required: true, message: '请输入库存数量' }],
  categoryId: [{ required: true, message: '请选择商品分类' }],
}

const normalizeImageUrl = (url?: string | null): string => {
  if (!url) return ''
  if (typeof url !== 'string') return ''
  if (url.startsWith('http')) return url
  return getImageUrl(url)
}

const normalizeImageForSave = (url?: string | null): string | undefined => {
  if (!url) return undefined
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  if (url.startsWith(baseUrl)) {
    return url.slice(baseUrl.length)
  }
  return url
}

const loadProduct = async () => {
  if (!productId) return
  pageLoading.value = true
  try {
    const response = await getProductDetail(productId)
    product.value = response.data ?? null

    if (product.value) {
      const p = product.value
      formState.name = p.name || p.productName || ''
      formState.description = p.description || ''
      formState.price = p.price
      formState.originalPrice = p.originalPrice
      formState.currency = p.currency
      formState.stock = p.stock
      formState.categoryId = p.categoryId
      formState.status = p.status

      if (p.currency) {
        lastCurrency.value = p.currency
      }

      // Convert existing images to fileList
      if (p.images && p.images.length > 0) {
        fileList.value = p.images.map((imgPath: any, index: number) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done' as const,
          url: normalizeImageUrl(imgPath),
          response: typeof imgPath === 'string' ? imgPath : undefined,
        }))
      }
    }
  } catch {
    message.error('加载商品详情失败')
  } finally {
    pageLoading.value = false
  }
}

const loadCurrencies = async () => {
  try {
    const response = await getCurrencies()
    currencies.value = response.data || []
    // Set currency symbol for current product currency
    if (formState.currency) {
      const symbol = currencies.value.find(c => c.currencyCode === formState.currency)?.symbol
      currencySymbol.value = symbol || '¥'
    }
  } catch {
    message.error('币种加载失败')
  }
}

const loadCategories = async () => {
  try {
    const response = await getCategoryList()
    categories.value = response.data || []
  } catch {
    // ignore
  }
}

const handleCurrencyChange = async (nextCurrency: string) => {
  if (!lastCurrency.value || lastCurrency.value === nextCurrency) {
    lastCurrency.value = nextCurrency
    currencySymbol.value = currencies.value.find(c => c.currencyCode === nextCurrency)?.symbol || '¥'
    return
  }

  try {
    const response = await getExchangeRateByPair(lastCurrency.value, nextCurrency)
    const rate = Number(response.data)
    if (isNaN(rate)) {
      message.error('获取汇率失败')
      formState.currency = lastCurrency.value
      return
    }

    if (typeof formState.price === 'number') {
      formState.price = Number((formState.price * rate).toFixed(2))
    }
    if (typeof formState.originalPrice === 'number') {
      formState.originalPrice = Number((formState.originalPrice * rate).toFixed(2))
    }

    lastCurrency.value = nextCurrency
    currencySymbol.value = currencies.value.find(c => c.currencyCode === nextCurrency)?.symbol || '¥'
  } catch {
    message.error('获取汇率失败')
    formState.currency = lastCurrency.value
  }
}

const handleUpload: UploadProps['customRequest'] = async (options) => {
  const { file, onSuccess, onError } = options
  try {
    const response = await uploadProductImages(file as File)
    if (response.data) {
      onSuccess!(response.data)
    } else {
      onError!(new Error('上传失败'))
    }
  } catch (error: any) {
    onError!(error)
    message.error('图片上传失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  const imageUrls = [...new Set(
    fileList.value
      .map(file => {
        const rawUrl = file.response || file.url
        return normalizeImageForSave(rawUrl)
      })
      .filter(Boolean) as string[],
  )]

  if (imageUrls.length === 0) {
    message.error('请至少上传一张商品图片')
    return
  }

  submitting.value = true
  try {
    const data: ProductUpdateDTO = {
      id: productId,
      productName: formState.name,
      description: formState.description,
      price: formState.price!,
      originalPrice: formState.originalPrice,
      currency: formState.currency,
      stock: formState.stock!,
      categoryId: formState.categoryId,
      imageUrls,
      mainImageIndex: 0,
    }

    await updateProduct(productId, data)
    message.success('商品更新成功')
    router.push(`/products/${productId}`)
  } catch {
    message.error('商品更新失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadProduct()
  loadCurrencies()
  loadCategories()
})
</script>
