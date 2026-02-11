<template>
  <div>
    <!-- System Stats -->
    <a-card v-if="stats" title="系统统计" :bordered="false" style="margin-bottom: 24px">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="总用户数" :value="stats.totalUsers" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="活跃用户" :value="stats.activeUsers" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="今日新用户" :value="stats.newUsersToday" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="商品总数" :value="stats.totalProducts" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="活跃商品" :value="stats.activeProducts" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="订单总数" :value="stats.totalOrders" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="待处理订单" :value="stats.pendingOrders" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="总营收" :value="stats.totalRevenue" prefix="$" :precision="2" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="今日营收" :value="stats.revenueToday" prefix="$" :precision="2" />
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic
            title="最后更新"
            :value="stats.lastUpdateTime ? dayjs(stats.lastUpdateTime).format('HH:mm') : '-'"
          />
        </a-col>
      </a-row>
    </a-card>

    <!-- App Config -->
    <a-card title="应用配置" :bordered="false">
      <a-form
        ref="formRef"
        :model="formData"
        layout="vertical"
      >
        <a-divider>基本信息</a-divider>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="应用名称" name="appName">
              <a-input v-model:value="formData.appName" placeholder="应用名称" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="应用版本" name="appVersion">
              <a-input v-model:value="formData.appVersion" placeholder="应用版本" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="应用描述" name="appDescription">
          <a-textarea v-model:value="formData.appDescription" placeholder="应用描述" :rows="3" />
        </a-form-item>

        <a-divider>联系方式</a-divider>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="客服邮箱" name="supportEmail">
              <a-input v-model:value="formData.supportEmail" type="email" placeholder="support@example.com" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="客服电话" name="supportPhone">
              <a-input v-model:value="formData.supportPhone" placeholder="+86-123-4567-8900" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>交易设置</a-divider>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="默认币种" name="defaultCurrency">
              <a-select
                v-model:value="formData.defaultCurrency"
                placeholder="选择默认币种"
                :options="currencyOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="包邮门槛" name="freeshippingThreshold">
              <a-input-number
                v-model:value="formData.freeshippingThreshold"
                placeholder="0"
                :min="0"
                :step="1"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="运费" name="shippingFee">
              <a-input-number
                v-model:value="formData.shippingFee"
                placeholder="0"
                :min="0"
                :step="0.01"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="最大上传大小(MB)" name="maxUploadSize">
              <a-input-number
                v-model:value="formData.maxUploadSize"
                placeholder="10"
                :min="1"
                :step="1"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>功能开关</a-divider>

        <a-row :gutter="16">
          <a-col :xs="24" :md="12">
            <a-form-item label="允许用户注册" name="enableUserRegistration">
              <a-switch v-model:checked="formData.enableUserRegistration" />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-form-item label="允许卖家注册" name="enableSellerRegistration">
              <a-switch v-model:checked="formData.enableSellerRegistration" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>首页轮播图</a-divider>

        <a-form-item label="轮播图片">
          <a-upload
            list-type="picture-card"
            :file-list="carouselFiles"
            :custom-request="handleUpload"
            @preview="handlePreview"
            @remove="handleRemove"
          >
            <div v-if="carouselFiles.length < 8">
              <PlusOutlined />
              <div style="margin-top: 8px">上传</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" :loading="saving" @click="handleSave">
              保存配置
            </a-button>
            <a-button @click="loadSettings">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- Preview Modal -->
    <a-modal
      v-model:open="previewVisible"
      :footer="null"
      title="图片预览"
    >
      <img :src="previewImage" alt="preview" style="width: 100%" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { getAppConfig, updateAppConfig, getSystemStats } from '@/services/settings'
import { getCurrencies } from '@/services/rate'
import request from '@/utils/request'
import type { SystemStats, AppConfig } from '@/models/settings'
import type { Currency } from '@/models/rate'
import type { UploadFile, UploadProps } from 'ant-design-vue'

const saving = ref(false)
const stats = ref<SystemStats | null>(null)
const currencies = ref<Currency[]>([])
const carouselFiles = ref<UploadFile[]>([])

const previewVisible = ref(false)
const previewImage = ref('')

const formRef = ref()

const formData = reactive<AppConfig>({
  appName: '',
  appVersion: '',
  appDescription: '',
  supportEmail: '',
  supportPhone: '',
  defaultCurrency: undefined,
  freeshippingThreshold: undefined,
  shippingFee: undefined,
  maxUploadSize: undefined,
  enableUserRegistration: false,
  enableSellerRegistration: false,
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const normalizeImageUrl = (url?: string): string => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

const normalizeImageForSave = (url?: string): string => {
  if (!url) return ''
  if (url.startsWith(API_BASE_URL)) {
    const rest = url.slice(API_BASE_URL.length)
    return rest.startsWith('/') ? rest : `/${rest}`
  }
  return url
}

const currencyOptions = computed(() =>
  currencies.value.map((c) => ({
    label: `${c.currencyName} (${c.currencyCode})`,
    value: c.currencyCode,
  }))
)

const loadSettings = async () => {
  try {
    const response = await getAppConfig()
    const config = response.data
    if (config) {
      formData.appName = config.appName || ''
      formData.appVersion = config.appVersion || ''
      formData.appDescription = config.appDescription || ''
      formData.supportEmail = config.supportEmail || ''
      formData.supportPhone = config.supportPhone || ''
      formData.defaultCurrency = config.defaultCurrency
      formData.freeshippingThreshold = config.freeshippingThreshold
      formData.shippingFee = config.shippingFee
      formData.maxUploadSize = config.maxUploadSize
      formData.enableUserRegistration = config.enableUserRegistration || false
      formData.enableSellerRegistration = config.enableSellerRegistration || false

      const images = config.carouselImages || []
      carouselFiles.value = images.map((url, index) => ({
        uid: `${index}`,
        name: `carousel-${index}`,
        status: 'done' as const,
        url: normalizeImageUrl(url),
      }))
    }
  } catch {
    message.error('加载配置失败')
  }
}

const loadStats = async () => {
  try {
    const response = await getSystemStats()
    stats.value = response.data || null
  } catch {
    console.error('Failed to load stats')
  }
}

const loadCurrencies = async () => {
  try {
    const response = await getCurrencies()
    currencies.value = response.data || []
  } catch {
    console.error('Failed to load currencies')
  }
}

const handleUpload: UploadProps['customRequest'] = async (options) => {
  const { file, onSuccess, onError } = options
  try {
    const fd = new FormData()
    fd.append('file', file as File)
    const response: any = await request({
      url: '/file/upload',
      method: 'POST',
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const relativePath = response.data
    const newFile: UploadFile = {
      uid: `upload-${Date.now()}`,
      name: (file as File).name,
      status: 'done',
      url: normalizeImageUrl(relativePath),
      response: { data: relativePath },
    }
    carouselFiles.value = [...carouselFiles.value, newFile]
    onSuccess?.(response)
  } catch (error) {
    onError?.(error as Error)
    message.error('上传失败')
  }
}

const handlePreview = (file: UploadFile) => {
  previewImage.value = file.url || ''
  previewVisible.value = true
}

const handleRemove = (file: UploadFile) => {
  carouselFiles.value = carouselFiles.value.filter((f) => f.uid !== file.uid)
  return true
}

const handleSave = async () => {
  saving.value = true
  try {
    const carouselImages = carouselFiles.value
      .map((file) => file.response?.data || file.url)
      .map((url) => normalizeImageForSave(url))
      .filter(Boolean) as string[]

    await updateAppConfig({
      ...formData,
      carouselImages,
    })
    message.success('配置已保存')
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSettings()
  loadStats()
  loadCurrencies()
})
</script>
