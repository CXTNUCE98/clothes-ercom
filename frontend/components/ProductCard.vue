<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative group">
    <div class="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
      <button class="btn-circle-action bg-white/90 border-gray-200 hover:bg-primary-50 hover:border-primary-300 text-primary-600" @click="$emit('preview', product)">
        <i class='bx bx-show'></i>
      </button>
      <component
        :is="Button.default"
        type="primary"
        class="btn-circle-action border-primary-200 hover:bg-primary-100 hover:border-primary-400"
        :disabled="product.stock === 0"
        :loading="adding"
        @click.stop="addToCart"
      >
        <template #icon><i class='bx bx-cart-add'></i></template>
      </component>
    </div>
    <div class="aspect-w-1 aspect-h-1 w-full">
      <img 
        :src="product.image || '/images/placeholder.jpg'" 
        :alt="product.name"
        class="w-full h-48 object-cover"
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2 text-gray-900">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
      <div class="flex justify-between items-center mb-3">
        <span class="text-xl font-bold text-primary-600">
          {{ formatPrice(product.price) }}
        </span>
        <span class="text-sm text-gray-500">
          Còn lại: {{ product.stock }}
        </span>
      </div>
      <component
        :is="Button.default"
        type="primary"
        class="w-full mt-2"
        @click="viewDetail"
      >
        <template #icon><i class='bx bx-info-circle'></i></template>
        Chi tiết
      </component>
    </div>
  </div>
</template>

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

interface Props {
  product: Product
}

const props = defineProps<Props>()
const { authFetch } = useApi()
const { isAuthenticated } = useAuth()
const { fetchCartCount } = useCartCount()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const viewDetail = () => {
  navigateTo(`/products/${props.product.id}`)
}

const adding = ref(false)

const emits = defineEmits(['added', 'preview'])

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
  } catch (error: any) {
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.btn-circle-action {
  width: 2.75rem; /* w-11 */
  height: 2.75rem; /* h-11 */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.08);
  border-width: 1px;
  font-size: 1.5rem; /* text-2xl */
  padding: 0;
  transition: all 0.2s;
}
.btn-circle-action i {
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 1.5rem;
}
@media (hover: none) and (pointer: coarse) {
  .group:hover .group-hover\:opacity-100 {
    opacity: 1 !important;
  }
  .group:hover .group-hover\:translate-y-0 {
    transform: translateY(0) !important;
  }
  .group-hover\:opacity-100 {
    opacity: 1;
  }
  .group-hover\:translate-y-0 {
    transform: translateY(0);
  }
}
</style> 