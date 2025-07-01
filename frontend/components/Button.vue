<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-bold transition focus:outline-none',
      'rounded-2xl px-7 py-3 shadow-lg',
      {
        'bg-gradient-to-r from-brand-600 to-indigo-500 text-white hover:from-brand-700 hover:to-indigo-600': type === 'primary' && !disabled,
        'bg-gray-100 text-gray-700 hover:bg-gray-200': type === 'secondary' && !disabled,
        'bg-red-500 text-white hover:bg-red-600': type === 'danger' && !disabled,
        'opacity-60 cursor-not-allowed': disabled,
        'w-full': fullWidth
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2 animate-spin text-xl">
      <i class="bx bx-loader-alt"></i>
    </span>
    <slot name="icon" />
    <span><slot /></span>
  </button>
</template>

<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue'

withDefaults(defineProps<{
  type?: 'primary' | 'secondary' | 'danger',
  loading?: boolean,
  disabled?: boolean,
  fullWidth?: boolean
}>(), {
  type: 'primary',
  loading: false,
  disabled: false,
  fullWidth: false
})
</script> 