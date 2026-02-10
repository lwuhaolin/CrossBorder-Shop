<template>
  <div class="contact">
    <div class="banner">
      <CustomerServiceOutlined class="banner-icon" />
      <h1 class="banner-title">{{ t('contact.title') }}</h1>
      <p class="banner-desc">{{ t('contact.subtitle') }}</p>
    </div>

    <div class="container">
      <a-row :gutter="[24, 24]">
        <a-col :xs="24" :md="12">
          <a-card class="info-card">
            <h2 class="section-title">{{ t('contact.contactWay') }}</h2>

            <div class="contact-item">
              <MailOutlined class="contact-icon" />
              <div>
                <h4>{{ t('contact.email') }}</h4>
                <p>support@crossbordershop.com</p>
                <p class="note">{{ t('contact.emailNote') }}</p>
              </div>
            </div>

            <div class="contact-item">
              <PhoneOutlined class="contact-icon" />
              <div>
                <h4>{{ t('contact.phone') }}</h4>
                <p>+86-123-4567-8900</p>
                <p class="note">{{ t('contact.phoneNote') }}</p>
              </div>
            </div>

            <div class="contact-item">
              <EnvironmentOutlined class="contact-icon" />
              <div>
                <h4>{{ t('contact.address') }}</h4>
                <p>{{ t('contact.addressDetail') }}</p>
                <p class="note">{{ t('contact.addressNote') }}</p>
              </div>
            </div>

            <div class="contact-item">
              <ClockCircleOutlined class="contact-icon" />
              <div>
                <h4>{{ t('contact.workTime') }}</h4>
                <p>{{ t('contact.workTimeWeekday') }}</p>
                <p>{{ t('contact.workTimeWeekend') }}</p>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :md="12">
          <a-card class="form-card">
            <h2 class="section-title">{{ t('contact.sendMessage') }}</h2>
            <p class="form-desc">{{ t('contact.formDesc') }}</p>

            <a-form ref="formRef" :model="formData" layout="vertical" @finish="handleSubmit">
              <a-form-item
                name="name"
                :label="t('contact.name')"
                :rules="[{ required: true, message: t('common.required') }]"
              >
                <a-input v-model:value="formData.name" :placeholder="t('contact.namePlaceholder')" />
              </a-form-item>

              <a-form-item
                name="email"
                :label="t('contact.email')"
                :rules="[
                  { required: true, message: t('common.required') },
                  { type: 'email', message: t('contact.emailInvalid') },
                ]"
              >
                <a-input v-model:value="formData.email" placeholder="your@email.com" />
              </a-form-item>

              <a-form-item
                name="subject"
                :label="t('contact.subject')"
                :rules="[{ required: true, message: t('common.required') }]"
              >
                <a-input v-model:value="formData.subject" :placeholder="t('contact.subjectPlaceholder')" />
              </a-form-item>

              <a-form-item
                name="message"
                :label="t('contact.message')"
                :rules="[{ required: true, message: t('common.required') }]"
              >
                <a-textarea
                  v-model:value="formData.message"
                  :rows="6"
                  :placeholder="t('contact.messagePlaceholder')"
                />
              </a-form-item>

              <a-form-item>
                <a-button type="primary" html-type="submit" block size="large" :loading="loading">
                  {{ t('contact.submit') }}
                </a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/i18n'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  CustomerServiceOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const handleSubmit = async () => {
  try {
    loading.value = true
    console.log('Contact form submitted:', formData.value)
    message.success(t('contact.submitSuccess'))
    formRef.value?.resetFields()
  } catch (error) {
    console.error('Failed to submit contact form:', error)
    message.error(t('common.error'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact {
  background: #f5f5f5;
}

.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 24px;
  text-align: center;
}

.banner-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.banner-title {
  font-size: 42px;
  font-weight: bold;
  margin: 0;
}

.banner-desc {
  font-size: 18px;
  margin-top: 12px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}

.info-card,
.form-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 24px;
}

.contact-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-icon {
  font-size: 24px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 4px;
}

.contact-item h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 4px;
}

.contact-item p {
  color: #666;
  margin: 0 0 4px;
  font-size: 14px;
}

.contact-item p:last-child {
  margin-bottom: 0;
}

.note {
  color: #999;
  font-size: 12px !important;
}

.form-desc {
  color: #666;
  margin-bottom: 24px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .banner {
    padding: 48px 16px;
  }

  .banner-title {
    font-size: 28px;
  }

  .banner-desc {
    font-size: 14px;
  }

  .container {
    padding: 24px 16px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>
