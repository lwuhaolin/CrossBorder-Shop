<template>
  <div class="privacy">
    <div class="banner">
      <h1 class="banner-title">{{ t('privacy.title') }}</h1>
    </div>

    <div class="container">
      <a-card class="card">
        <h2 class="section-title">{{ t('privacy.introduction') }}</h2>
        <p class="paragraph">{{ t('privacy.intro') }}</p>

        <h3 class="subsection-title">{{ t('privacy.infoCollection') }}</h3>
        <p class="paragraph">{{ t('privacy.infoCollectionDesc') }}</p>

        <h3 class="subsection-title">{{ t('privacy.infoUsage') }}</h3>
        <p class="paragraph">{{ t('privacy.infoUsageDesc') }}</p>

        <h3 class="subsection-title">{{ t('privacy.infoProtection') }}</h3>
        <p class="paragraph">{{ t('privacy.infoProtectionDesc') }}</p>

        <h3 class="subsection-title">{{ t('privacy.thirdParty') }}</h3>
        <p class="paragraph">{{ t('privacy.thirdPartyDesc') }}</p>

        <h3 class="subsection-title">{{ t('privacy.userRights') }}</h3>
        <p class="paragraph">{{ t('privacy.userRightsDesc') }}</p>

        <h3 class="subsection-title">{{ t('privacy.policyUpdate') }}</h3>
        <p class="paragraph">{{ t('privacy.policyUpdateDesc') }}</p>

        <h3 class="subsection-title">{{ t('privacy.contact') }}</h3>
        <p class="paragraph">{{ t('privacy.contactDesc') }}</p>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<style scoped>
.privacy {
  background: #f5f5f5;
}

.banner {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
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
