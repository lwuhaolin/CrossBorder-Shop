<template>
  <a-layout class="layout">
    <Header />

    <a-layout-content class="main">
      <router-view />
    </a-layout-content>

  </a-layout>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
}
</style>
