<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
    
    <div v-if="loading" class="text-center py-12">
      <el-loading />
    </div>
    
    <div v-else-if="!isAuthenticated" class="text-center py-12">
      <div class="text-gray-500">
        <i class="bx bx-lock text-6xl mb-4"></i>
        <p class="text-xl mb-4">Vui lòng đăng nhập để xem giỏ hàng</p>
        <NuxtLink to="/login">
          <el-button type="primary" size="large">Đăng nhập</el-button>
        </NuxtLink>
      </div>
    </div>
    
    <div v-else-if="cartItems.length === 0" class="text-center py-12">
      <div class="text-gray-500">
        <i class="bx bx-cart text-6xl mb-4"></i>
        <p class="text-xl mb-4">Giỏ hàng trống</p>
        <NuxtLink to="/products">
          <el-button type="primary" size="large">Mua sắm ngay</el-button>
        </NuxtLink>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 flex flex-col gap-6">
        <div v-for="item in cartItems" :key="item.id" class="flex flex-col sm:flex-row items-center gap-6 bg-white rounded-2xl shadow p-6 hover:shadow-lg transition">
          <img :src="item.image || '/images/placeholder.jpg'" :alt="item.name" class="w-28 h-28 object-cover rounded-xl border shadow" />
          <div class="flex-1 flex flex-col gap-2">
            <h3 class="font-semibold text-lg text-gray-900">{{ item.name }}</h3>
            <div class="text-primary-600 font-bold text-lg">{{ formatPrice(item.price) }}</div>
            <div class="flex items-center gap-2">
              <el-input-number 
                v-model="item.quantity" 
                :min="1" 
                :max="item.stock"
                size="small"
                @change="updateQuantity(item.id, $event)"
                class="rounded-lg"
              />
              <span class="text-gray-500 text-sm">x {{ item.quantity }}</span>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <div class="font-semibold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</div>
            <el-button type="danger" size="small" circle @click="removeItem(item.id)">
              <i class="bx bx-trash"></i>
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl shadow-xl p-8 sticky top-8 flex flex-col gap-6 animate-fade-in">
          <h2 class="text-xl font-bold mb-4">Tổng đơn hàng</h2>
          <div class="flex justify-between text-gray-600">
            <span>Tạm tính:</span>
            <span class="font-semibold">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span class="font-semibold">{{ formatPrice(shipping) }}</span>
          </div>
          <div class="border-t pt-4 flex justify-between text-lg font-bold">
            <span>Tổng cộng:</span>
            <span class="text-primary-600">{{ formatPrice(total) }}</span>
          </div>
          <el-button 
            type="primary" 
            size="large" 
            class="w-full font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-200"
            @click="proceedToCheckout"
          >
            Tiến hành thanh toán
          </el-button>
          <el-button 
            type="danger" 
            size="large" 
            class="w-full font-semibold rounded-lg"
            @click="clearCart"
          >
            Xóa giỏ hàng
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useNuxtApp, navigateTo } from '#app'
import { useCartCount } from '../composables/useCartCount'

interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  image: string
  stock: number
  quantity: number
}

const { authFetch } = useApi()
const { isAuthenticated } = useAuth()
const { fetchCartCount } = useCartCount()

const loading = ref(false)
const cartItems = ref<CartItem[]>([])
const subtotal = ref(0)
const shipping = ref(30000) // Fixed shipping cost

const total = computed(() => subtotal.value + shipping.value)

const fetchCart = async () => {
  if (!isAuthenticated.value) return
  
  loading.value = true
  try {
    const response = await authFetch('/cart')
    cartItems.value = response.items
    subtotal.value = response.total
  } catch (error) {
    console.error('Error fetching cart:', error)
  } finally {
    loading.value = false
  }
}

const updateQuantity = async (itemId: number, quantity: number) => {
  try {
    await authFetch(`/cart/update/${itemId}`, {
      method: 'PUT',
      body: { quantity }
    })
    await fetchCart()
    fetchCartCount()
  } catch (error: any) {
    const { $ElMessage } = useNuxtApp()
    $ElMessage.error(error.data?.error || 'Không thể cập nhật số lượng')
  }
}

const removeItem = async (itemId: number) => {
  try {
    await authFetch(`/cart/remove/${itemId}`, {
      method: 'DELETE'
    })
    await fetchCart()
    fetchCartCount()
    const { $ElMessage } = useNuxtApp()
    $ElMessage.success('Đã xóa sản phẩm khỏi giỏ hàng')
  } catch (error: any) {
    const { $ElMessage } = useNuxtApp()
    $ElMessage.error(error.data?.error || 'Không thể xóa sản phẩm')
  }
}

const clearCart = async () => {
  try {
    await authFetch('/cart/clear', {
      method: 'DELETE'
    })
    await fetchCart()
    fetchCartCount()
    const { $ElMessage } = useNuxtApp()
    $ElMessage.success('Đã xóa toàn bộ giỏ hàng')
  } catch (error: any) {
    const { $ElMessage } = useNuxtApp()
    $ElMessage.error(error.data?.error || 'Không thể xóa giỏ hàng')
  }
}

const proceedToCheckout = () => {
  navigateTo('/checkout')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

onMounted(() => {
  fetchCart()
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