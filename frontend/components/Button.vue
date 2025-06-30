<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-semibold transition focus:outline-none',
      'rounded-2xl px-6 py-2 shadow-md',
      {
        'bg-primary-600 text-white hover:bg-primary-700': type === 'primary' && !disabled,
        'bg-gray-100 text-gray-700 hover:bg-gray-200': type === 'secondary' && !disabled,
        'bg-red-500 text-white hover:bg-red-600': type === 'danger' && !disabled,
        'opacity-60 cursor-not-allowed': disabled,
        'w-full': fullWidth
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="mr-2 animate-spin">
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