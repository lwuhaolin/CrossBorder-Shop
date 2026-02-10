<template>
  <a-select
    :value="i18n.language"
    :options="languageOptions"
    :class="className || 'switcher'"
    style="width: 120px"
    @change="handleLanguageChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import type { SelectProps } from 'ant-design-vue'

interface Props {
  className?: string
}

const props = defineProps<Props>()
const { i18n } = useI18n()

const languageOptions = computed<SelectProps['options']>(() => [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
])

const handleLanguageChange = (value: string) => {
  // Save language preference to localStorage
  localStorage.setItem('selectedLanguage', value)
  // Change language
  i18n.changeLanguage(value)
}
</script>

<style scoped>
.switcher {
  width: 120px;
}
</style>
