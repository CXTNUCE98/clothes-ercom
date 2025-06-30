<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="['fixed z-50 left-1/2 -translate-x-1/2 top-8 min-w-[300px] max-w-xs px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border-2',
      type === 'success' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white border-green-300' : 'bg-gradient-to-r from-red-400 to-red-600 text-white border-red-300']">
      <i :class="type === 'success' ? 'bx bx-check-circle text-3xl' : 'bx bx-error text-3xl'"></i>
      <span class="font-bold text-lg">{{ message }}</span>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const props = defineProps<{ message: string, type?: 'success' | 'error', duration?: number }>()
const visible = ref(true)

watch(() => props.message, () => {
  visible.value = true
  setTimeout(() => visible.value = false, props.duration || 2500)
}, { immediate: true })
</script>

<style scoped>
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style> 