<template>
  <div class="help-center">
    <div class="banner">
      <QuestionCircleOutlined class="banner-icon" />
      <h1 class="banner-title">{{ t('help.title') }}</h1>
      <p class="banner-desc">{{ t('help.subtitle') }}</p>
    </div>

    <div class="container">
      <a-card class="card">
        <h2 class="section-title">{{ t('help.faq') }}</h2>
        <a-collapse class="collapse">
          <a-collapse-panel v-for="(faq, index) in faqs" :key="index" :header="faq.question">
            {{ faq.answer }}
          </a-collapse-panel>
        </a-collapse>
      </a-card>

      <a-card class="card">
        <h2 class="section-title">{{ t('help.needHelp') }}</h2>
        <a-space direction="vertical" size="large" style="width: 100%">
          <div>
            <h4>{{ t('help.contactService') }}</h4>
            <p>{{ t('help.contactServiceDesc') }}</p>
            <ul>
              <li>{{ t('help.email') }}: support@crossbordershop.com</li>
              <li>{{ t('help.phone') }}: +86-123-4567-8900</li>
              <li>{{ t('help.workTime') }}: {{ t('help.workTimeRange') }}</li>
            </ul>
          </div>
        </a-space>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()

const faqs = [
  {
    question: t('help.q1'),
    answer: t('help.a1'),
  },
  {
    question: t('help.q2'),
    answer: t('help.a2'),
  },
  {
    question: t('help.q3'),
    answer: t('help.a3'),
  },
  {
    question: t('help.q4'),
    answer: t('help.a4'),
  },
  {
    question: t('help.q5'),
    answer: t('help.a5'),
  },
  {
    question: t('help.q6'),
    answer: t('help.a6'),
  },
  {
    question: t('help.q7'),
    answer: t('help.a7'),
  },
  {
    question: t('help.q8'),
    answer: t('help.a8'),
  },
]
</script>

<style scoped>
.help-center {
  background: #f5f5f5;
}

.banner {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
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

.card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 24px;
}

.collapse {
  border: none;
}

.card h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 12px;
}

.card p {
  color: #666;
  margin: 0 0 12px;
  line-height: 1.6;
}

.card ul {
  margin: 12px 0;
  padding-left: 20px;
  color: #666;
}

.card li {
  margin-bottom: 8px;
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
    font-size: 18px;
  }
}
</style>
