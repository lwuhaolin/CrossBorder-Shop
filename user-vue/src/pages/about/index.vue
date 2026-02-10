<template>
  <div class="about">
    <div class="banner">
      <RocketOutlined class="banner-icon" />
      <h1 class="banner-title">{{ t('about.title') }}</h1>
      <p class="banner-desc">{{ t('about.subtitle') }}</p>
    </div>

    <div class="container">
      <a-card class="card">
        <h2 class="section-title">{{ t('about.introduction') }}</h2>
        <p class="paragraph">{{ t('about.intro1') }}</p>
        <p class="paragraph">{{ t('about.intro2') }}</p>
      </a-card>

      <a-row :gutter="[24, 24]" class="values-row">
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="value-card">
            <GlobalOutlined class="value-icon" />
            <h3>{{ t('about.globalVision') }}</h3>
            <p>{{ t('about.globalVisionDesc') }}</p>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="value-card">
            <HeartOutlined class="value-icon" />
            <h3>{{ t('about.userFirst') }}</h3>
            <p>{{ t('about.userFirstDesc') }}</p>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="value-card">
            <TrophyOutlined class="value-icon" />
            <h3>{{ t('about.quality') }}</h3>
            <p>{{ t('about.qualityDesc') }}</p>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card class="value-card">
            <TeamOutlined class="value-icon" />
            <h3>{{ t('about.teamwork') }}</h3>
            <p>{{ t('about.teamworkDesc') }}</p>
          </a-card>
        </a-col>
      </a-row>

      <a-card class="card">
        <h2 class="section-title">{{ t('about.milestone') }}</h2>
        <a-timeline :items="timelineItems" mode="left" class="timeline" />
      </a-card>

      <a-card class="card">
        <h2 class="section-title">{{ t('about.advantages') }}</h2>
        <a-row :gutter="[24, 24]">
          <a-col :xs="24" :md="12">
            <div class="advantage">
              <h4>🌐 {{ t('about.globalSupply') }}</h4>
              <p>{{ t('about.globalSupplyDesc') }}</p>
            </div>
          </a-col>
          <a-col :xs="24" :md="12">
            <div class="advantage">
              <h4>🚀 {{ t('about.efficientLogistics') }}</h4>
              <p>{{ t('about.efficientLogisticsDesc') }}</p>
            </div>
          </a-col>
          <a-col :xs="24" :md="12">
            <div class="advantage">
              <h4>💎 {{ t('about.qualityAssurance') }}</h4>
              <p>{{ t('about.qualityAssuranceDesc') }}</p>
            </div>
          </a-col>
          <a-col :xs="24" :md="12">
            <div class="advantage">
              <h4>🎯 {{ t('about.smartRecommend') }}</h4>
              <p>{{ t('about.smartRecommendDesc') }}</p>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/i18n'
import {
  RocketOutlined,
  GlobalOutlined,
  HeartOutlined,
  TrophyOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'

const { t } = useI18n()

const milestones = [
  {
    year: '2020',
    title: t('about.milestone2020Title'),
    description: t('about.milestone2020Desc'),
  },
  {
    year: '2021',
    title: t('about.milestone2021Title'),
    description: t('about.milestone2021Desc'),
  },
  {
    year: '2022',
    title: t('about.milestone2022Title'),
    description: t('about.milestone2022Desc'),
  },
  {
    year: '2023',
    title: t('about.milestone2023Title'),
    description: t('about.milestone2023Desc'),
  },
  {
    year: '2024',
    title: t('about.milestone2024Title'),
    description: t('about.milestone2024Desc'),
  },
  {
    year: '2025',
    title: t('about.milestone2025Title'),
    description: t('about.milestone2025Desc'),
  },
]

const timelineItems = milestones.map((m) => ({
  label: m.year,
  children: [
    {
      title: m.title,
      description: m.description,
    },
  ],
}))
</script>

<style scoped>
.about {
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

.card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  margin-top: 0;
}

.paragraph {
  color: #666;
  line-height: 1.8;
  margin-bottom: 12px;
}

.values-row {
  margin-bottom: 24px;
}

.value-card {
  text-align: center;
  height: 100%;
}

.value-icon {
  font-size: 32px;
  color: #667eea;
  margin-bottom: 12px;
  display: block;
}

.value-card h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 12px 0 8px;
}

.value-card p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.timeline {
  padding: 20px 0;
}

.advantage {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.advantage h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px;
}

.advantage p {
  color: #666;
  margin: 0;
  line-height: 1.6;
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
    font-size: 18px;
  }
}
</style>
