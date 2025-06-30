<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="['fixed z-50 left-1/2 -translate-x-1/2 top-8 min-w-[280px] max-w-xs px-6 py-4 rounded-2xl shadow-lg flex items-center gap-3',
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white']">
      <i :class="type === 'success' ? 'bx bx-check-circle text-2xl' : 'bx bx-error text-2xl'"></i>
      <span class="font-semibold">{{ message }}</span>
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