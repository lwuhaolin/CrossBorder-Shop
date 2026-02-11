<template>
  <a-modal
    :open="open"
    title="订单发货"
    :confirm-loading="submitting"
    :destroy-on-close="true"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
      style="margin-top: 16px"
    >
      <a-form-item label="物流公司" name="shippingCompanyCode">
        <a-select
          v-model:value="formState.shippingCompanyCode"
          placeholder="请选择物流公司"
          @change="handleCompanyChange"
        >
          <a-select-option
            v-for="company in logisticsCompanies"
            :key="company.companyCode"
            :value="company.companyCode"
          >
            {{ company.companyName }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="物流公司名称">
        <a-input v-model:value="formState.shippingCompany" disabled />
      </a-form-item>

      <a-form-item label="物流单号" name="trackingNo">
        <a-input
          v-model:value="formState.trackingNo"
          placeholder="选择物流公司后自动生成"
          disabled
        />
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea
          v-model:value="formState.remark"
          placeholder="请输入备注信息"
          :rows="3"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { shipOrder } from '@/services/order'
import { getLogisticsCompanies, generateTrackingNo } from '@/services/logistics'
import type { LogisticsCompany } from '@/models/logistics'
import type { OrderShipDTO } from '@/models/order'

const props = defineProps<{
  open: boolean
  orderId: number
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}>()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const logisticsCompanies = ref<LogisticsCompany[]>([])

const formState = reactive<OrderShipDTO>({
  shippingCompanyCode: undefined,
  shippingCompany: undefined,
  trackingNo: undefined,
  remark: undefined,
})

const rules = {
  shippingCompanyCode: [{ required: true, message: '请选择物流公司' }],
  trackingNo: [{ required: true, message: '请选择物流公司生成物流单号' }],
}

const loadLogisticsCompanies = async () => {
  try {
    const response = await getLogisticsCompanies()
    logisticsCompanies.value = response.data || []
  } catch {
    // ignore
  }
}

const handleCompanyChange = async (value: string) => {
  const company = logisticsCompanies.value.find(item => item.companyCode === value)
  if (company) {
    formState.shippingCompany = company.companyName
    try {
      const response = await generateTrackingNo(company.companyCode)
      formState.trackingNo = response.data || ''
    } catch {
      message.error('生成物流单号失败')
    }
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    await shipOrder(props.orderId, { ...formState })
    message.success('发货成功')
    handleClose()
    emit('success')
  } catch {
    message.error('发货失败')
  } finally {
    submitting.value = false
  }
}

const handleClose = () => {
  formState.shippingCompanyCode = undefined
  formState.shippingCompany = undefined
  formState.trackingNo = undefined
  formState.remark = undefined
  emit('update:open', false)
}

onMounted(() => {
  loadLogisticsCompanies()
})
</script>
