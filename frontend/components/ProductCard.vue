<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useApi } from '../composables/useApi'
import { useAuth } from '../composables/useAuth'
import { useNuxtApp, navigateTo } from 'nuxt/app'
import { useCartCount } from '../composables/useCartCount'

interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  stock: number
  isOnSale?: boolean
  salePercentage?: number
}

const props = defineProps<{ 
  product: Product
  showSale?: boolean
}>()

const { authFetch } = useApi()
const { isAuthenticated } = useAuth()
const { fetchCartCount } = useCartCount()
const adding = ref(false)
const isHovered = ref(false)
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

// Calculate sale percentage if not provided
const salePercentage = computed(() => {
  if (props.product.salePercentage) return props.product.salePercentage
  if (props.product.originalPrice && props.product.originalPrice > props.product.price) {
    return Math.round((1 - props.product.price / props.product.originalPrice) * 100)
  }
  return null
})

// Get stock status with color coding
const stockStatus = computed(() => {
  if (props.product.stock === 0) return { text: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-50' }
  if (props.product.stock <= 5) return { text: `Chỉ còn ${props.product.stock}`, color: 'text-orange-600', bg: 'bg-orange-50' }
  if (props.product.stock <= 10) return { text: `Còn ${props.product.stock}`, color: 'text-yellow-600', bg: 'bg-yellow-50' }
  return { text: 'Còn hàng', color: 'text-green-600', bg: 'bg-green-50' }
})

// Get category icon
const categoryIcon = computed(() => {
  const icons: Record<string, string> = {
    'áo': '👔',
    'quần': '👖', 
    'đầm': '👗',
    'chân váy': '🥻',
    'áo dài': '🥻'
  }
  return icons[props.product.category.toLowerCase()] || '👕'
})
</script>

<template>
  <div
    class="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:scale-105 animate-fade-in-up"
    @click="viewDetail"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Product Image Container -->
    <div class="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Product Image -->
      <img
        :src="product.image || '/images/placeholder.jpg'"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      <!-- Gradient Overlay on Hover -->
      <div 
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      
      <!-- Top Badges -->
      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <!-- Sale Badge -->
        <div 
          v-if="showSale && salePercentage" 
          class="bg-gradient-to-r from-accent-500 to-red-500 text-white px-3 py-1.5 text-xs font-bold rounded-xl shadow-soft animate-pulse-soft"
        >
          -{{ salePercentage }}%
        </div>
        
        <!-- New Badge -->
        <div 
          v-if="product.isNew" 
          class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 text-xs font-bold rounded-xl shadow-soft"
        >
          NEW
        </div>
        
        <!-- Hot Badge -->
        <div 
          v-if="product.isHot" 
          class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 text-xs font-bold rounded-xl shadow-soft animate-bounce-soft"
        >
          🔥 HOT
        </div>
      </div>

      <!-- Category Badge -->
      <div class="absolute top-4 right-4">
        <div class="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-lg shadow-soft">
          {{ categoryIcon }}
        </div>
      </div>

      <!-- Stock Status -->
      <div class="absolute bottom-4 left-4">
        <div :class="`px-3 py-1.5 rounded-xl text-xs font-semibold ${stockStatus.bg} ${stockStatus.color} backdrop-blur-sm shadow-soft`">
          {{ stockStatus.text }}
        </div>
      </div>
      
      <!-- Quick Actions - Show on Hover -->
      <div 
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
      >
        <div class="flex gap-3">
          <!-- Quick View Button -->
          <button
            @click.stop="$emit('preview', product)"
            class="w-12 h-12 bg-white/95 backdrop-blur-sm text-brand-700 rounded-xl hover:bg-white hover:text-accent-600 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:scale-110 flex items-center justify-center"
            title="Xem nhanh"
          >
            <i class="bx bx-show text-xl"></i>
          </button>
          
          <!-- Add to Cart Button -->
          <button
            @click.stop="addToCart"
            :disabled="product.stock === 0 || adding"
            class="w-12 h-12 bg-accent-600 hover:bg-accent-700 text-white rounded-xl transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :title="product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'"
          >
            <i v-if="adding" class="bx bx-loader-alt animate-spin text-xl"></i>
            <i v-else-if="product.stock === 0" class="bx bx-x text-xl"></i>
            <i v-else class="bx bx-cart-add text-xl"></i>
          </button>

          <!-- Wishlist Button -->
          <button
            @click.stop=""
            class="w-12 h-12 bg-white/95 backdrop-blur-sm text-brand-700 rounded-xl hover:bg-white hover:text-red-500 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:scale-110 flex items-center justify-center"
            title="Yêu thích"
          >
            <i class="bx bx-heart text-xl"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-6">
      <!-- Product Name -->
      <h3 class="font-bold text-lg text-brand-900 mb-2 line-clamp-2 group-hover:text-accent-600 transition-colors">
        {{ product.name }}
      </h3>

      <!-- Product Category -->
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs text-brand-500 bg-gray-100 px-2 py-1 rounded-full">
          {{ product.category }}
        </span>
        <div class="flex items-center gap-1">
          <!-- Rating Stars -->
          <div class="flex text-yellow-400">
            <i class="bx bxs-star text-xs"></i>
            <i class="bx bxs-star text-xs"></i>
            <i class="bx bxs-star text-xs"></i>
            <i class="bx bxs-star text-xs"></i>
            <i class="bx bx-star text-xs"></i>
          </div>
          <span class="text-xs text-brand-500">(4.2)</span>
        </div>
      </div>

      <!-- Price Section -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Current Price -->
          <span class="text-xl font-bold text-brand-900">
            {{ formatPrice(product.price) }}
          </span>
          
          <!-- Original Price (if on sale) -->
          <span 
            v-if="product.originalPrice && product.originalPrice > product.price" 
            class="text-sm text-brand-500 line-through"
          >
            {{ formatPrice(product.originalPrice) }}
          </span>
        </div>

        <!-- Quick Add Button (Mobile) -->
        <button
          @click.stop="addToCart"
          :disabled="product.stock === 0 || adding"
          class="sm:hidden w-10 h-10 bg-accent-600 hover:bg-accent-700 text-white rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
      >
          <i v-if="adding" class="bx bx-loader-alt animate-spin"></i>
          <i v-else class="bx bx-plus"></i>
        </button>
      </div>

      <!-- Additional Info on Hover -->
      <div 
        class="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
      >
        <p class="text-sm text-brand-600 line-clamp-2">
          {{ product.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Enhanced hover effects */
.group:hover .scale-110 {
  transform: scale(1.1);
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(4px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.9);
  }
}

/* Focus states for accessibility */
button:focus {
  outline: none;
  ring: 2px;
  ring-color: rgb(239 68 68 / 0.5);
  ring-offset: 2px;
}

/* Loading state */
.animate-pulse-soft {
  animation: pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Smooth image loading */
img {
  transition: opacity 0.3s ease;
}

img[loading="lazy"] {
  opacity: 0;
}

img[loading="lazy"].loaded {
  opacity: 1;
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .group .absolute.inset-0.flex {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
}

  .group .absolute.inset-0.flex .flex {
    transform: none;
    opacity: 0.7;
}
}

/* Card variations for different layouts */
.card-compact .p-6 {
  padding: 1rem;
}

.card-compact .text-xl {
  font-size: 1.125rem;
}

/* Smooth state transitions */
* {
  transition-property: transform, opacity, background-color, border-color, text-decoration-color, fill, stroke, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

/* Gradient border effect */
.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(45deg, #ef4444, #8b5cf6);
  border-radius: inherit;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
</style>