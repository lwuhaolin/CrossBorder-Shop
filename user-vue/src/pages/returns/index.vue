<template>
  <div class="returns">
    <div class="banner">
      <h1 class="banner-title">{{ t('returns.title') }}</h1>
    </div>

    <div class="container">
      <a-card class="card">
        <h2 class="section-title">{{ t('returns.policy') }}</h2>
        <p class="paragraph">{{ t('returns.policyIntro') }}</p>

        <h3 class="subsection-title">{{ t('returns.condition') }}</h3>
        <p class="paragraph">{{ t('returns.conditionDesc') }}</p>

        <h3 class="subsection-title">{{ t('returns.procedure') }}</h3>
        <p class="paragraph">{{ t('returns.procedureDesc') }}</p>

        <h3 class="subsection-title">{{ t('returns.inspection') }}</h3>
        <p class="paragraph">{{ t('returns.inspectionDesc') }}</p>

        <h3 class="subsection-title">{{ t('returns.refund') }}</h3>
        <p class="paragraph">{{ t('returns.refundDesc') }}</p>

        <h3 class="subsection-title">{{ t('returns.nonReturnable') }}</h3>
        <p class="paragraph">{{ t('returns.nonReturnableDesc') }}</p>

        <h3 class="subsection-title">{{ t('returns.contact') }}</h3>
        <p class="paragraph">{{ t('returns.contactDesc') }}</p>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<style scoped>
.returns {
  background: #f5f5f5;
}

.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 24px;
  text-align: center;
}

.banner-title {
  font-size: 42px;
  font-weight: bold;
  margin: 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 48px 24px;
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 24px;
}

.subsection-title {
  font-size: 16px;
  font-weight: bold;
  margin: 24px 0 12px;
}

.paragraph {
  color: #666;
  line-height: 1.8;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .banner {
    padding: 40px 16px;
  }

  .banner-title {
    font-size: 28px;
  }

  .container {
    padding: 24px 16px;
  }

  .section-title {
    font-size: 18px;
  }

  .subsection-title {
    font-size: 14px;
  }
}
</style>
