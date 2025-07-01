<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>
    
    <div v-if="loading" class="text-center py-12">
      <el-loading />
    </div>
    
    <div v-else-if="!isAuthenticated" class="text-center py-12">
      <div class="text-gray-500">
        <i class="bx bx-lock text-6xl mb-4"></i>
        <p class="text-xl mb-4">Vui lòng đăng nhập để thanh toán</p>
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
    
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Checkout Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <h2 class="text-xl font-bold mb-6">Thông tin đặt hàng</h2>
        
        <el-form 
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          class="flex flex-col gap-4"
        >
          <el-form-item label="Họ và tên" prop="name">
            <el-input v-model="form.name" size="large" class="rounded-lg" />
          </el-form-item>
          
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email" type="email" size="large" class="rounded-lg" />
          </el-form-item>
          
          <el-form-item label="Số điện thoại" prop="phone">
            <el-input v-model="form.phone" size="large" class="rounded-lg" />
          </el-form-item>
          
          <el-form-item label="Địa chỉ" prop="address">
            <el-input v-model="form.address" type="textarea" :rows="3" size="large" class="rounded-lg" />
          </el-form-item>
          
          <el-form-item label="Ghi chú">
            <el-input v-model="form.note" type="textarea" :rows="2" size="large" class="rounded-lg" />
          </el-form-item>
        </el-form>
      </div>
      
      <!-- Order Summary -->
      <div class="bg-white rounded-2xl shadow-xl p-8 animate-fade-in h-fit">
        <h2 class="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
        
        <!-- Order Items -->
        <div class="flex flex-col gap-4 mb-6">
          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="flex items-center gap-4"
          >
            <img 
              :src="item.image || '/images/placeholder.jpg'" 
              :alt="item.name"
              class="w-16 h-16 object-cover rounded shadow"
            />
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
              <p class="text-gray-600 text-sm">Số lượng: {{ item.quantity }}</p>
            </div>
            <div class="text-right font-semibold">{{ formatPrice(item.price * item.quantity) }}</div>
          </div>
        </div>
        
        <!-- Order Total -->
        <div class="border-t pt-4 flex flex-col gap-2">
          <div class="flex justify-between text-gray-600">
            <span>Tạm tính:</span>
            <span class="font-semibold">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span class="font-semibold">{{ formatPrice(shipping) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold mt-2">
            <span>Tổng cộng:</span>
            <span class="text-brand-600">{{ formatPrice(total) }}</span>
          </div>
        </div>
        
        <!-- Place Order Button -->
        <el-button 
          type="primary" 
          size="large" 
          class="w-full font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-200 mt-6"
          :loading="placingOrder"
          @click="placeOrder"
        >
          Đặt hàng
        </el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useNuxtApp, navigateTo } from '#app'

interface CartItem {
  id: number
  productId: number
  name: string
  price: number
  image: string
  stock: number
  quantity: number
}

interface CheckoutForm {
  name: string
  email: string
  phone: string
  address: string
  note: string
}

const { authFetch } = useApi()
const { isAuthenticated, user } = useAuth()

const loading = ref(false)
const placingOrder = ref(false)
const cartItems = ref<CartItem[]>([])
const subtotal = ref(0)
const shipping = ref(30000)
const formRef = ref()

const total = computed(() => subtotal.value + shipping.value)

const form = ref<CheckoutForm>({
  name: '',
  email: '',
  phone: '',
  address: '',
  note: ''
})

const rules = {
  name: [
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur' }
  ]
}

const fetchCart = async () => {
  loading.value = true
  try {
    const response = await authFetch('/cart')
    cartItems.value = response.items
    subtotal.value = response.total
    
    // Pre-fill form with user data
    if (user.value) {
      form.value.name = user.value.name
      form.value.email = user.value.email
    }
  } catch (error) {
    console.error('Error fetching cart:', error)
  } finally {
    loading.value = false
  }
}

const placeOrder = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    placingOrder.value = true
    
    const orderData = {
      items: cartItems.value.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: total.value,
      shippingInfo: {
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone,
        address: form.value.address,
        note: form.value.note
      }
    }
    
    const response = await authFetch('/orders', {
      method: 'POST',
      body: orderData
    })
    
    const { $ElMessage } = useNuxtApp()
    $ElMessage.success('Đặt hàng thành công!')
    navigateTo(`/orders/${response.orderId}`)
  } catch (error: any) {
    $ElMessage.error(error.data?.error || 'Không thể đặt hàng')
  } finally {
    placingOrder.value = false
  }
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