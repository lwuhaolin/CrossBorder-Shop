<template>
  <a-card title="创建商品" :bordered="false">
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
          <a-button type="primary" :loading="submitting" @click="handleSubmit">创建</a-button>
          <a-button @click="router.push('/products')">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import type { FormInstance, UploadFile, UploadProps } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { createProduct, uploadProductImages } from '@/services/product'
import { getCategoryList } from '@/services/category'
import { getCurrencies, getExchangeRateByPair } from '@/services/rate'
import type { ProductCreateDTO } from '@/models/product'
import type { Category } from '@/models/category'

interface CurrencyItem {
  currencyCode: string
  currencyName: string
  symbol?: string
  isBase?: number
}

const router = useRouter()
const formRef = ref<FormInstance>()
const fileList = ref<UploadFile[]>([])
const submitting = ref(false)
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
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称' },
    { max: 100, message: '商品名称不能超过100个字符' },
  ],
  price: [{ required: true, message: '请输入售价' }],
  currency: [{ required: true, message: '请选择币种' }],
  stock: [{ required: true, message: '请输入库存数量' }],
  categoryId: [{ required: true, message: '请选择商品分类' }],
}

const loadCurrencies = async () => {
  try {
    const response = await getCurrencies()
    currencies.value = response.data || []
    if (currencies.value.length > 0) {
      const baseCurrency = currencies.value.find(c => c.isBase === 1)
      const defaultCode = baseCurrency?.currencyCode || currencies.value[0].currencyCode
      formState.currency = defaultCode
      lastCurrency.value = defaultCode
      currencySymbol.value = currencies.value.find(c => c.currencyCode === defaultCode)?.symbol || '¥'
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

  const imageUrls = fileList.value
    .map(file => file.response || file.url)
    .filter(Boolean) as string[]

  if (imageUrls.length === 0) {
    message.error('请至少上传一张商品图片')
    return
  }

  submitting.value = true
  try {
    const data: ProductCreateDTO = {
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

    await createProduct(data)
    message.success('商品创建成功')
    router.push('/products')
  } catch {
    message.error('商品创建失败')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadCurrencies()
  loadCategories()
})
</script>
