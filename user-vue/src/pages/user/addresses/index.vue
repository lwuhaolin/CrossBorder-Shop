<template>
  <div class="addresses-page">
    <div class="container">
      <div class="header">
        <h1 class="title">{{ t('address.myAddresses') }}</h1>
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ t('address.addAddress') }}
        </a-button>
      </div>

      <a-card class="card">
        <a-table
          :columns="columns"
          :data-source="addresses"
          :loading="loading"
          :pagination="false"
          row-key="id"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'address'">
              {{ record.detailAddress }}, {{ record.city }}, {{ record.province }}, {{ record.country }}
            </template>
            <template v-else-if="column.key === 'isDefault'">
              {{ record.isDefault ? t('common.yes') : t('common.no') }}
            </template>
            <template v-else-if="column.key === 'action'">
              <a-space>
                <a-button type="link" @click="handleEdit(record)">
                  <template #icon>
                    <EditOutlined />
                  </template>
                  {{ t('address.edit') }}
                </a-button>
                <a-button type="link" danger @click="handleDelete(record.id)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                  {{ t('address.delete') }}
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-card>

      <a-modal
        :title="editingAddress ? t('address.editAddress') : t('address.addAddress')"
        :open="modalVisible"
        :width="600"
        @ok="handleSubmit"
        @cancel="modalVisible = false"
      >
        <a-form ref="formRef" :model="formData" layout="vertical">
          <a-form-item
            name="receiverName"
            :label="t('address.receiverName')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input v-model:value="formData.receiverName" />
          </a-form-item>

          <a-form-item
            name="receiverPhone"
            :label="t('address.receiverPhone')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input v-model:value="formData.receiverPhone" />
          </a-form-item>

          <a-form-item
            name="country"
            :label="t('address.country')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input v-model:value="formData.country" />
          </a-form-item>

          <a-form-item
            name="province"
            :label="t('address.province')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input v-model:value="formData.province" />
          </a-form-item>

          <a-form-item
            name="city"
            :label="t('address.city')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input v-model:value="formData.city" />
          </a-form-item>

          <a-form-item
            name="district"
            :label="t('address.district')"
          >
            <a-input v-model:value="formData.district" />
          </a-form-item>

          <a-form-item
            name="detailAddress"
            :label="t('address.detailAddress')"
            :rules="[{ required: true, message: t('common.required') }]"
          >
            <a-input v-model:value="formData.detailAddress" />
          </a-form-item>

          <a-form-item
            name="isDefault"
            :label="t('address.setDefault')"
            :value-prop-name="'checked'"
          >
            <a-checkbox v-model:checked="formData.isDefault" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import { message } from 'ant-design-vue'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import type { Address, AddressCreateDTO, AddressUpdateDTO } from '@/models/address'
import { getAddressList, createAddress, updateAddress, deleteAddress } from '@/services/address'

const { t } = useI18n()
const formRef = ref<FormInstance>()

const addresses = ref<Address[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const editingAddress = ref<Address | null>(null)

const formData = ref<AddressUpdateDTO>({
  receiverName: '',
  receiverPhone: '',
  country: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: false,
  id: undefined,
})

const columns = [
  {
    title: t('address.receiverName'),
    dataIndex: 'receiverName',
    key: 'receiverName',
  },
  {
    title: t('address.phone'),
    dataIndex: 'receiverPhone',
    key: 'receiverPhone',
  },
  {
    title: t('address.detailAddress'),
    key: 'address',
  },
  {
    title: t('address.default'),
    dataIndex: 'isDefault',
    key: 'isDefault',
  },
  {
    title: t('common.edit'),
    key: 'action',
  },
]

onMounted(() => {
  loadAddresses()
})

const loadAddresses = async () => {
  try {
    loading.value = true
    const response = await getAddressList()
    addresses.value = response.data || []
  } catch (error) {
    console.error('Failed to load addresses:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  editingAddress.value = null
  formData.value = {
    receiverName: '',
    receiverPhone: '',
    country: '',
    province: '',
    city: '',
    district: '',
    detailAddress: '',
    isDefault: false,
  }
  modalVisible.value = true
}

const handleEdit = (address: Address) => {
  editingAddress.value = address
  formData.value = {
    receiverName: address.receiverName,
    receiverPhone: address.receiverPhone,
    country: address.country,
    province: address.province,
    city: address.city,
    district: address.district || '',
    detailAddress: address.detailAddress,
    isDefault: address.isDefault || false,
  }
  modalVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await deleteAddress(id)
    message.success(t('address.deleted'))
    await loadAddresses()
  } catch (error) {
    console.error('Failed to delete address:', error)
    message.error(t('common.error'))
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validateFields()

    if (editingAddress.value) {
      await updateAddress(editingAddress.value.id, formData.value)
      message.success(t('address.updated'))
    } else {
      await createAddress(formData.value)
      message.success(t('address.created'))
    }

    modalVisible.value = false
    await loadAddresses()
  } catch (error) {
    console.error('Failed to save address:', error)
  }
}
</script>

<style scoped>
.addresses-page {
  min-height: calc(100vh - 64px - 200px);
  background: #f5f5f5;
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}

.card {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .title {
    font-size: 22px;
  }
}
</style>
