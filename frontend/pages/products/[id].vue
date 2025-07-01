<template>
  <div v-if="loading" class="text-center py-12">
    <el-loading />
  </div>
  
  <div v-else-if="!product" class="text-center py-12">
    <div class="text-gray-500">
      <i class="bx bx-error-circle text-6xl mb-4"></i>
      <p class="text-xl">Không tìm thấy sản phẩm</p>
    </div>
  </div>
  
  <div v-else class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
    <!-- Product Image -->
    <div class="flex flex-col gap-4 items-center justify-center">
      <img 
        :src="product.image || '/images/placeholder.jpg'" 
        :alt="product.name"
        class="w-full max-w-md h-96 object-cover rounded-2xl shadow-lg border"
      />
      <div class="flex gap-2 mt-2">
        <span class="inline-block bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-semibold">{{ product.category }}</span>
        <span v-if="product.stock > 0" class="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Còn hàng</span>
        <span v-else class="inline-block bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">Hết hàng</span>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="flex flex-col gap-6 justify-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
      <div class="text-2xl font-bold text-brand-600 mb-4">{{ formatPrice(product.price) }}</div>
      <div class="text-gray-600 leading-relaxed mb-4">{{ product.description }}</div>
      <div class="flex items-center gap-4 mb-4">
        <span class="text-gray-700 font-medium">Số lượng còn lại:</span>
        <span class="text-gray-900 font-bold">{{ product.stock }}</span>
      </div>
      <!-- Quantity and Add to Cart -->
      <div class="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <el-input-number 
          v-model="quantity" 
          :min="1" 
          :max="product.stock"
          :disabled="product.stock === 0"
          size="large"
          class="rounded-2xl"
        />
        <component
          :is="Button.default"
          type="primary"
          class="w-full sm:w-auto font-semibold rounded-2xl shadow hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          :disabled="product.stock === 0"
          :loading="addingToCart"
          @click="addToCart"
        >
          <template #icon><i class="bx bx-cart-add text-lg"></i></template>
          Thêm vào giỏ hàng
        </component>
      </div>
      <!-- Back to Products -->
      <NuxtLink to="/products" class="inline-flex items-center gap-2 text-brand-600 hover:underline text-sm font-medium mt-2">
        <i class="bx bx-arrow-back"></i>
        Quay lại danh sách sản phẩm
      </NuxtLink>
    </div>
    <component v-if="toast" :is="Toast.default" :key="toast.key" :message="toast.message" :type="toast.type" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../../composables/useApi'
import { useAuth } from '../../composables/useAuth'
import { navigateTo } from 'nuxt/app'
import * as Button from '../../components/Button.vue'
import * as Toast from '../../components/Toast.vue'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

const route = useRoute()
const { $fetch, authFetch } = useApi()
const { isAuthenticated } = useAuth()

const loading = ref(false)
const addingToCart = ref(false)
const product = ref<Product | null>(null)
const quantity = ref(1)
const toast = ref<{ message: string, type: 'success'|'error', key: number }|null>(null)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const fetchProduct = async () => {
  loading.value = true
  try {
    const response = await $fetch(`/products/${route.params.id}`) as { product: Product }
    product.value = response.product
  } catch (error) {
    console.error('Error fetching product:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  if (!isAuthenticated.value) {
    toast.value = { message: 'Vui lòng đăng nhập để thêm vào giỏ hàng', type: 'error', key: Date.now() }
    setTimeout(() => navigateTo('/login'), 1200)
    return
  }
  if (!product.value) return
  addingToCart.value = true
  try {
    await authFetch('/cart/add', {
      method: 'POST',
      body: {
        productId: product.value.id,
        quantity: quantity.value
      }
    })
    toast.value = { message: 'Đã thêm vào giỏ hàng', type: 'success', key: Date.now() }
  } catch (error: any) {
    toast.value = { message: error.data?.error || 'Không thể thêm vào giỏ hàng', type: 'error', key: Date.now() }
  } finally {
    addingToCart.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
</style> 