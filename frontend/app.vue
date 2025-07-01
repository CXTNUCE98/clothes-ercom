<template>
  <div id="app" class="min-h-screen bg-main-gradient font-sans">
    <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
      <span class="text-brand-600 text-2xl font-bold animate-pulse">Đang xác thực đăng nhập...</span>
    </div>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAuth } from './composables/useAuth'

const { checkAuth } = useAuth()
const loading = ref(true)

onMounted(async () => {
  await checkAuth()
  loading.value = false
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background: none;
}

#app {
  min-height: 100vh;
}
</style> 