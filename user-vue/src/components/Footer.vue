<template>
  <a-layout-footer class="footer">
    <div class="container">
      <a-row :gutter="[32, 32]">
        <!-- About Us Section -->
        <a-col :xs="24" :sm="12" :md="6">
          <h3>{{ t('footer.aboutUs') }}</h3>
          <p>{{ t('footer.aboutDesc') }}</p>
        </a-col>

        <!-- Customer Service Section -->
        <a-col :xs="24" :sm="12" :md="6">
          <h3>{{ t('footer.customerService') }}</h3>
          <ul class="links">
            <li><a href="/help">{{ t('footer.helpCenter') }}</a></li>
            <li><a href="/shipping">{{ t('footer.shipping') }}</a></li>
            <li><a href="/returns">{{ t('footer.returns') }}</a></li>
            <li><a href="/contact">{{ t('footer.contact') }}</a></li>
          </ul>
        </a-col>

        <!-- Quick Links Section -->
        <a-col :xs="24" :sm="12" :md="6">
          <h3>{{ t('footer.quickLinks') }}</h3>
          <ul class="links">
            <li><a href="/products">{{ t('footer.allProducts') }}</a></li>
            <li><a href="/about">{{ t('footer.about') }}</a></li>
            <li><a href="/privacy">{{ t('footer.privacy') }}</a></li>
            <li><a href="/terms">{{ t('footer.terms') }}</a></li>
          </ul>
        </a-col>

        <!-- Follow Us Section -->
        <a-col :xs="24" :sm="12" :md="6">
          <h3>{{ t('footer.followUs') }}</h3>
          <a-space size="large">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <GithubOutlined class="socialIcon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <TwitterOutlined class="socialIcon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookOutlined class="socialIcon" />
            </a>
          </a-space>
        </a-col>
      </a-row>

      <!-- Copyright Section -->
      <div class="copyright">
        <p>&copy; {{ currentYear }} CrossBorder Shop. {{ t('footer.allRightsReserved') }}.</p>
      </div>
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GithubOutlined, TwitterOutlined, FacebookOutlined } from '@ant-design/icons-vue'
import { useI18n } from '@/i18n'

const { t } = useI18n()

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: #001529;
  color: #fff;
  padding: 48px 0 24px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer h3 {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.footer p {
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links li {
  margin-bottom: 8px;
}

.links a {
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: color 0.3s;
}

.links a:hover {
  color: #1890ff;
}

.socialIcon {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.65);
  transition: color 0.3s;
  cursor: pointer;
}

.socialIcon:hover {
  color: #1890ff;
}

.copyright {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

@media (max-width: 768px) {
  .footer {
    padding: 32px 0 16px;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
