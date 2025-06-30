<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button class="absolute top-4 right-4 text-gray-400 hover:text-primary-600 text-2xl" @click="$emit('close')">
          <i class="bx bx-x"></i>
        </button>
        <div class="flex flex-col md:flex-row gap-8 items-center">
          <img :src="product.image || '/images/placeholder.jpg'" :alt="product.name" class="w-40 h-40 object-cover rounded-2xl shadow" />
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ product.name }}</h2>
            <p class="text-gray-600 mb-3 line-clamp-3">{{ product.description }}</p>
            <div class="text-xl font-bold text-primary-600 mb-4">{{ formatPrice(product.price) }}</div>
            <Button type="primary" :disabled="product.stock === 0" :loading="adding" class="w-full" @click="addToCart">
              <template #icon><i class="bx bx-cart-add mr-1"></i></template>
              Thêm vào giỏ hàng
            </Button>
            <div v-if="product.stock === 0" class="text-red-500 mt-2">Hết hàng</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import * as Button from './Button.vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useNuxtApp, navigateTo } from 'nuxt/app'
import { useCartCount } from '../composables/useCartCount'

const props = defineProps<{ product: any, visible: boolean }>()
const emits = defineEmits(['close', 'added'])
const adding = ref(false)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const { authFetch } = useApi()
const { isAuthenticated } = useAuth()
const { fetchCartCount } = useCartCount()

const addToCart = async () => {
  if (!isAuthenticated.value) {
    navigateTo('/login')
    return
  }
  try {
    adding.value = true
    await authFetch('/cart/add', {
      method: 'POST',
      body: {
        productId: props.product.id,
        quantity: 1
      }
    })
    emits('added')
    fetchCartCount()
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 