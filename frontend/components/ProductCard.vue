<script lang="ts" setup>
import { ref } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useNuxtApp, navigateTo } from 'nuxt/app'
import * as Button from './Button.vue'
import { useCartCount } from '../composables/useCartCount'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

const props = defineProps<{ product: Product }>()
const { authFetch } = useApi()
const { isAuthenticated } = useAuth()
const { fetchCartCount } = useCartCount()
const adding = ref(false)
const emits = defineEmits(['added', 'preview'])

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const viewDetail = () => navigateTo(`/products/${props.product.id}`)

const addToCart = async () => {
  if (adding.value) return
  if (!isAuthenticated.value) return navigateTo('/login')
  try {
    adding.value = true
    await authFetch('/cart/add', { method: 'POST', body: { productId: props.product.id, quantity: 1 } })
    emits('added')
    fetchCartCount()
  } finally {
    adding.value = false
  }
}
</script>

<template>
  <div
    class="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative group border border-transparent hover:border-primary-300 hover:scale-[1.03]"
  >
    <!-- Action Buttons (Hover Show) -->
    <div
      class="absolute top-4 right-4 z-10 flex flex-col gap-3 items-end opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto transition-all duration-300"
    >
      <button
        class="btn-circle-action bg-white/90 border-primary-200 hover:bg-primary-50 hover:border-indigo-400 text-primary-600 shadow"
        @click="$emit('preview', product)"
      >
        <i class="bx bx-show"></i>
      </button>
      <component
        :is="Button.default"
        type="primary"
        class="btn-circle-action border-primary-200 hover:bg-indigo-100 hover:border-indigo-400"
        :disabled="product.stock === 0"
        :loading="adding"
        @click.stop="addToCart"
      >
        <template #icon><i class="bx bx-cart-add"></i></template>
      </component>
    </div>

    <!-- Product Image -->
    <div class="aspect-w-1 aspect-h-1 bg-gradient-to-br from-primary-50 to-indigo-50">
      <img
        :src="product.image || '/images/placeholder.jpg'"
        :alt="product.name"
        class="w-full h-52 object-cover rounded-t-3xl shadow-sm transition-transform duration-300 group-hover:scale-105"
      />
    </div>

    <!-- Product Info -->
    <div class="p-6">
      <h3 class="text-xl font-bold mb-2 text-gray-900">{{ product.name }}</h3>
      <p class="text-gray-600 text-base mb-3 line-clamp-2">{{ product.description }}</p>

      <div class="flex justify-between items-center mb-4">
        <span class="text-xl font-extrabold text-primary-600">
          {{ formatPrice(product.price) }}
        </span>
        <span class="text-sm text-gray-500">Còn lại: {{ product.stock }}</span>
      </div>

      <component
        :is="Button.default"
        type="primary"
        class="w-full mt-2 text-base font-bold py-3 rounded-2xl shadow hover:scale-105 transition-transform"
        @click="viewDetail"
      >
        <template #icon><i class="bx bx-info-circle mr-2"></i></template>
        Chi tiết
      </component>
    </div>
  </div>
</template>



<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-circle-action {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border-width: 2px;
  font-size: 1.5rem;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(80, 56, 200, 0.1);
}

.btn-circle-action i {
  line-height: 1;
}

@media (hover: none) and (pointer: coarse) {
  .group:hover .group-hover\:opacity-100 {
    opacity: 1 !important;
  }
  .group:hover .group-hover\:translate-y-0 {
    transform: translateY(0) !important;
  }
}
</style>