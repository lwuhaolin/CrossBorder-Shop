<template>
  <a-select
    :value="currentLanguage"
    :options="languageOptions"
    :class="className || 'switcher'"
    style="width: 120px"
    @change="handleLanguageChange"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from '@/i18n'
import type { SelectProps } from 'ant-design-vue'

interface Props {
  className?: string
}

const props = defineProps<Props>()
const { i18n } = useI18n()
const currentLanguage = ref<string>('zh-CN')

onMounted(() => {
  currentLanguage.value = localStorage.getItem('selectedLanguage') || 'zh-CN'
})

const languageOptions = computed<SelectProps['options']>(() => [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
])

const handleLanguageChange = (value: string) => {
  // Save language preference to localStorage
  localStorage.setItem('selectedLanguage', value)
  // Change language
  currentLanguage.value = value
  i18n.changeLanguage(value)
  // Trigger page reload to update all content
  window.location.reload()
}
</script>

<style scoped>
.switcher {
  width: 120px;
}
</style>
