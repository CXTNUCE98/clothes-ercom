<script lang="ts" setup>
import { ref } from 'vue'
import * as Button from './Button.vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { navigateTo } from 'nuxt/app'
import { useCartCount } from '../composables/useCartCount'

const props = defineProps<{ product: any; visible: boolean }>()
const emits = defineEmits(['close', 'added'])
const adding = ref(false)

const { authFetch } = useApi()
const { isAuthenticated } = useAuth()
const { fetchCartCount } = useCartCount()

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

const addToCart = async () => {
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
  <transition name="modal">
    <div v-if="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <!-- Modal Content -->
      <div class="relative z-10 bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-scale-in">
        <!-- Close Button -->
        <button 
          class="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-gray-100 text-gray-500 hover:text-brand-600 transition-all duration-200 shadow-md"
          @click="$emit('close')"
          aria-label="Close preview"
        >
          <i class="bx bx-x text-2xl"></i>
        </button>

        <!-- Content -->
        <div class="flex flex-col md:flex-row">
          <!-- Image Section -->
          <div class="md:w-1/2 bg-gradient-to-br from-brand-50 to-indigo-50 p-6 md:p-8 flex items-center justify-center">
            <div class="relative w-full h-64 md:h-full aspect-square">
              <img 
                :src="product.image || '/images/placeholder.jpg'" 
                :alt="product.name"
                class="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
              />
              <div 
                v-if="product.stock === 0"
                class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md"
              >
                Hết hàng
              </div>
            </div>
          </div>
          
          <!-- Info Section -->
          <div class="md:w-1/2 p-6 md:p-8 flex flex-col">
            <div class="flex-1">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">{{ product.name }}</h2>
              
              <div class="flex items-center gap-2 mb-4">
                <div class="text-xl md:text-2xl font-extrabold text-brand-600">
                  {{ formatPrice(product.price) }}
                </div>
                <div 
                  v-if="product.stock > 0"
                  class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full"
                >
                  Còn {{ product.stock }} sản phẩm
                </div>
              </div>
              
              <div class="prose max-w-none text-gray-600 mb-6">
                <p class="whitespace-pre-line">{{ product.description }}</p>
              </div>
            </div>
            
            <Button 
              type="primary" 
              :disabled="product.stock === 0" 
              :loading="adding"
              class="w-full py-3 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              @click="addToCart"
            >
              <template #icon><i class="bx bx-cart-add text-xl mr-2"></i></template>
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .animate-scale-in,
.modal-leave-to .animate-scale-in {
  transform: scale(0.95);
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .prose {
    max-height: 150px;
    overflow-y: auto;
  }
}
</style>