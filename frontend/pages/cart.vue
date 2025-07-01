<template>
  <div>
    <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Giỏ hàng</h1>
    <div v-if="loading" class="text-center py-16">
      <el-loading />
    </div>
    <div v-else-if="!isAuthenticated" class="text-center py-16">
      <div class="text-gray-500">
        <i class="bx bx-lock text-6xl mb-4"></i>
        <p class="text-xl mb-4">Vui lòng đăng nhập để xem giỏ hàng</p>
        <NuxtLink to="/login">
          <el-button type="primary" size="large">Đăng nhập</el-button>
        </NuxtLink>
      </div>
    </div>
    <div v-else-if="cartItems.length === 0" class="text-center py-16">
      <div class="text-gray-500">
        <i class="bx bx-cart text-6xl mb-4"></i>
        <p class="text-xl mb-4">Giỏ hàng trống</p>
        <NuxtLink to="/products">
          <el-button type="primary" size="large">Mua sắm ngay</el-button>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <!-- Cart Items -->
      <div class="lg:col-span-2 flex flex-col gap-7">
        <transition-group name="fade-list" tag="div">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="group flex flex-col sm:flex-row items-center gap-6 bg-white rounded-3xl shadow-soft-lg p-6 hover:shadow-soft-xl transition-all duration-300 relative overflow-hidden"
          >
            <img
              :src="item.image || '/images/placeholder.jpg'"
              :alt="item.name"
              class="w-28 h-28 object-cover rounded-2xl shadow-md border border-gray-100 bg-gray-50"
              loading="lazy"
            />
            <div class="flex-1 flex flex-col gap-2 min-w-0">
              <h3 class="font-semibold text-lg md:text-xl text-gray-900 truncate">{{ item.name }}</h3>
              <div class="text-brand-600 font-bold text-lg md:text-xl">{{ formatPrice(item.price) }}</div>
              <div class="flex items-center gap-2 mt-1">
                <el-input-number
                  v-model="item.quantity"
                  :min="1"
                  :max="item.stock"
                  size="small"
                  @change="updateQuantity(item.id, $event)"
                  class="rounded-lg"
                />
                <span class="text-gray-400 text-xs">x {{ item.quantity }}</span>
                <span v-if="item.stock > 0" class="ml-2 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">Còn hàng</span>
                <span v-else class="ml-2 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">Hết hàng</span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2 min-w-[100px]">
              <div class="font-extrabold text-gray-900 text-lg">{{ formatPrice(item.price * item.quantity) }}</div>
              <Button
                type="danger"
                size="small"
                class="rounded-full shadow hover:scale-110 transition-transform duration-200"
                @click="removeItem(item.id)"
              >
                <template #icon><i class="bx bx-trash"></i></template>
              </Button>
            </div>
            <div class="absolute right-0 top-0 h-full w-2 bg-gradient-to-b from-brand-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </transition-group>
      </div>
      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-3xl shadow-soft-xl p-8 sticky top-8 flex flex-col gap-7 animate-fade-in border border-gray-50">
          <h2 class="text-2xl font-bold mb-2 text-gray-900 tracking-tight">Tổng đơn hàng</h2>
          <div class="flex justify-between text-gray-500 text-base">
            <span>Tạm tính:</span>
            <span class="font-semibold text-gray-900">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-500 text-base">
            <span>Phí vận chuyển:</span>
            <span class="font-semibold text-gray-900">{{ formatPrice(shipping) }}</span>
          </div>
          <div class="border-t pt-4 flex justify-between text-xl font-extrabold">
            <span>Tổng cộng:</span>
            <span class="text-brand-600">{{ formatPrice(total) }}</span>
          </div>
          <Button
            type="primary"
            fullWidth
            class="rounded-xl py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-brand-600 to-indigo-500 hover:from-brand-700 hover:to-indigo-600"
            @click="proceedToCheckout"
          >
            <template #icon><i class="bx bx-credit-card text-xl mr-2"></i></template>
            Tiến hành thanh toán
          </Button>
          <Button
            type="danger"
            fullWidth
            class="rounded-xl py-3 font-semibold"
            @click="clearCart"
          >
            <template #icon><i class="bx bx-trash text-lg mr-2"></i></template>
            Xóa giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useRouter, useNuxtApp } from 'nuxt/app'
import { useCartCount } from '../composables/useCartCount'
import Button from '../components/Button.vue'

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
const router = useRouter()

const loading = ref(false)
const cartItems = ref<CartItem[]>([])
const subtotal = ref(0)
const shipping = ref(30000) // Fixed shipping cost

const total = computed(() => subtotal.value + shipping.value)

const fetchCart = async () => {
  if (!isAuthenticated.value) return
  loading.value = true
  try {
    const response = await authFetch('/cart') as any
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
    const { $ElMessage } = useNuxtApp() as any
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
    const { $ElMessage } = useNuxtApp() as any
    $ElMessage.success('Đã xóa sản phẩm khỏi giỏ hàng')
  } catch (error: any) {
    const { $ElMessage } = useNuxtApp() as any
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
    const { $ElMessage } = useNuxtApp() as any
    $ElMessage.success('Đã xóa toàn bộ giỏ hàng')
  } catch (error: any) {
    const { $ElMessage } = useNuxtApp() as any
    $ElMessage.error(error.data?.error || 'Không thể xóa giỏ hàng')
  }
}

const proceedToCheckout = () => {
  router.push('/checkout')
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
.fade-list-enter-active, .fade-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}
.fade-list-enter-from, .fade-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style> 