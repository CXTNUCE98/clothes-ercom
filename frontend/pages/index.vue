<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useApi } from '../composables/useApi'
import ProductCard from '../components/ProductCard.vue'
import ProductPreview from '../components/ProductPreview.vue'
import Toast from '../components/Toast.vue'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

const { $fetch } = useApi()
const loading = ref(false)
const featuredProducts = ref<Product[]>([])
const saleProducts = ref<Product[]>([])
const newProducts = ref<Product[]>([])
const showPreview = ref(false)
const previewProduct = ref<Product | null>(null)
const toast = ref<{ message: string; type: 'success' | 'error'; key: number } | null>(null)

const categories = [
  { 
    name: 'Áo', 
    value: 'áo',
    icon: '👔',
    description: 'Blazer, Sơ mi, Áo kiểu...',
    color: 'from-blue-400 to-blue-600',
    items: ['Blazer', 'Sơ mi', 'Áo kiểu', 'Áo thun']
  },
  { 
    name: 'Quần', 
    value: 'quần',
    icon: '👖',
    description: 'Quần tây, Jeans, Quần suông...',
    color: 'from-purple-400 to-purple-600',
    items: ['Quần tây', 'Quần Jeans', 'Quần suông', 'Quần short']
  },
  { 
    name: 'Đầm', 
    value: 'đầm',
    icon: '👗',
    description: 'Đầm công sở, Đầm dạ tiệc...',
    color: 'from-pink-400 to-pink-600',
    items: ['Đầm công sở', 'Đầm dạ tiệc', 'Đầm dài']
  },
  { 
    name: 'Chân váy', 
    value: 'chân váy',
    icon: '🥻',
    description: 'Chân váy xòe, Chân váy bút chì...',
    color: 'from-green-400 to-green-600',
    items: ['Chân váy xòe', 'Chân váy bút chì']
  }
]

const stats = [
  { label: 'Sản phẩm', value: '1000+', icon: 'bx-closet' },
  { label: 'Khách hàng hài lòng', value: '50K+', icon: 'bx-happy-heart-eyes' },
  { label: 'Đơn hàng thành công', value: '100K+', icon: 'bx-check-circle' },
  { label: 'Năm kinh nghiệm', value: '5+', icon: 'bx-medal' }
]

const fetchProducts = async () => {
  loading.value = true
  try {
    const [featured, sale, newItems] = await Promise.all([
      $fetch('/products?limit=8'),
      $fetch('/products?sale=true&limit=8'),
      $fetch('/products?new=true&limit=8')
    ])
    featuredProducts.value = featured.products
    saleProducts.value = sale.products
    newProducts.value = newItems.products
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const navigateToCategory = (category: string) => {
  navigateTo(`/products?category=${category}`)
}

function handlePreview(product: Product) {
  previewProduct.value = product
  showPreview.value = true
}

function handleAddedToCart() {
  toast.value = { message: 'Đã thêm vào giỏ hàng', type: 'success', key: Date.now() }
}

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="bg-gray-50">
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <!-- Background decorations -->
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-bounce-soft"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-bounce-soft animation-delay-2000"></div>
        <div class="absolute -bottom-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-bounce-soft animation-delay-4000"></div>
      </div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="text-center lg:text-left animate-fade-in-up">
            <div class="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-6">
              🔥 Hot Deal: Sale up to 50%
            </div>
            <h1 class="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-brand-900 mb-6 leading-tight">
              <span class="bg-gradient-to-r from-accent-600 to-purple-600 bg-clip-text text-transparent">Real Clothes</span>
              <br>
              <span class="text-brand-800">Fashion Collection</span>
        </h1>
            <p class="text-xl text-brand-600 mb-8 max-w-lg mx-auto lg:mx-0">
              Khám phá bộ sưu tập thời trang hiện đại với chất lượng cao, thiết kế tinh tế phù hợp với mọi phong cách
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <NuxtLink to="/products" class="group inline-flex items-center justify-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-xl hover:bg-accent-700 transition-all duration-300 hover:scale-105 hover:shadow-soft-lg">
                <span>Mua sắm ngay</span>
                <i class="bx bx-right-arrow-alt text-xl ml-2 group-hover:translate-x-1 transition-transform"></i>
              </NuxtLink>
              <NuxtLink to="/products?sale=true" class="group inline-flex items-center justify-center px-8 py-4 border-2 border-brand-300 text-brand-700 font-semibold rounded-xl hover:bg-brand-900 hover:text-white hover:border-brand-900 transition-all duration-300 hover:scale-105">
                <i class="bx bx-shopping-bag text-xl mr-2"></i>
                <span>Khám phá Sale</span>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Right Content - Hero Image -->
          <div class="relative animate-fade-in-right">
            <div class="relative w-full h-96 lg:h-128 rounded-3xl overflow-hidden bg-gradient-to-br from-accent-100 to-purple-100 p-8">
              <!-- Fashion illustration or hero image would go here -->
              <div class="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-purple-500/20"></div>
              <div class="relative h-full flex items-center justify-center">
                <div class="text-8xl opacity-20 animate-pulse-soft">👗</div>
              </div>
              <!-- Floating badges -->
              <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-soft animate-fade-in-down">
                <div class="text-sm font-semibold text-brand-900">Free Shipping</div>
                <div class="text-xs text-brand-600">Miễn phí vận chuyển</div>
              </div>
              <div class="absolute bottom-6 right-6 bg-accent-600 text-white rounded-xl px-4 py-2 shadow-soft animate-fade-in-up">
                <div class="text-sm font-semibold">Sale 50%</div>
                <div class="text-xs opacity-90">Limited time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(stat, index) in stats" :key="stat.label" 
               class="text-center animate-fade-in-up"
               :style="{ animationDelay: `${index * 100}ms` }">
            <div class="w-16 h-16 bg-gradient-to-br from-accent-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl">
              <i :class="`bx ${stat.icon}`"></i>
            </div>
            <div class="text-3xl font-bold text-brand-900 mb-2">{{ stat.value }}</div>
            <div class="text-brand-600">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sale Banner -->
    <section class="bg-gradient-to-r from-accent-600 via-accent-500 to-purple-600 text-white py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <p class="font-bold text-lg animate-pulse-soft">
            🔥 FLASH SALE 24H - Giảm đến 50% + Tặng quà tặng cho đơn hàng trên 1.5 triệu
          </p>
        </div>
      </div>
    </section>

    <!-- New Products Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 animate-fade-in-up">
          <div class="inline-flex items-center px-4 py-2 bg-success-100 text-success-700 rounded-full text-sm font-semibold mb-4">
            ✨ New Arrivals
          </div>
          <h2 class="text-4xl font-bold text-brand-900 mb-4">Sản phẩm mới nhất</h2>
          <p class="text-xl text-brand-600 max-w-2xl mx-auto">Khám phá những thiết kế mới nhất từ bộ sưu tập Real Clothes</p>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 bg-accent-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(product, index) in newProducts.slice(0, 4)" 
               :key="product.id"
               class="animate-fade-in-up"
               :style="{ animationDelay: `${index * 150}ms` }">
            <ProductCard 
              :product="product" 
              @preview="handlePreview"
              @added="handleAddedToCart" 
            />
          </div>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/products?new=true" class="inline-flex items-center px-8 py-4 bg-white text-brand-700 border-2 border-brand-200 font-semibold rounded-xl hover:bg-brand-900 hover:text-white hover:border-brand-900 transition-all duration-300 hover:scale-105 shadow-soft">
            Xem tất cả sản phẩm mới
            <i class="bx bx-right-arrow-alt text-xl ml-2"></i>
        </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl font-bold text-brand-900 mb-4">Danh mục sản phẩm</h2>
          <p class="text-xl text-brand-600 max-w-2xl mx-auto">Tìm kiếm phong cách hoàn hảo cho bạn</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(category, index) in categories" 
               :key="category.name"
               class="group cursor-pointer animate-fade-in-up"
               :style="{ animationDelay: `${index * 100}ms` }"
            @click="navigateToCategory(category.value)">
            <div class="relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-500 hover:scale-105">
              <!-- Category background -->
              <div class="aspect-square relative overflow-hidden">
                <div :class="`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-8xl group-hover:scale-110 transition-transform duration-300">{{ category.icon }}</div>
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              
              <!-- Category info -->
              <div class="p-6 text-center">
                <h3 class="text-xl font-bold text-brand-900 mb-2 group-hover:text-accent-600 transition-colors">{{ category.name }}</h3>
                <p class="text-brand-600 text-sm mb-4">{{ category.description }}</p>
                <div class="flex flex-wrap gap-2 justify-center">
                  <span v-for="item in category.items.slice(0, 2)" :key="item" 
                        class="px-3 py-1 bg-gray-100 text-brand-600 text-xs rounded-full">
                    {{ item }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 animate-fade-in-up">
          <div class="inline-flex items-center px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-semibold mb-4">
            ⭐ Best Sellers
          </div>
          <h2 class="text-4xl font-bold text-brand-900 mb-4">Sản phẩm bán chạy nhất</h2>
          <p class="text-xl text-brand-600 max-w-2xl mx-auto">Những sản phẩm được yêu thích nhất bởi khách hàng</p>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(product, index) in featuredProducts" 
               :key="product.id"
               class="animate-fade-in-up"
               :style="{ animationDelay: `${index * 100}ms` }">
            <ProductCard 
              :product="product" 
              @preview="handlePreview"
              @added="handleAddedToCart" 
            />
          </div>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/products?bestseller=true" class="inline-flex items-center px-8 py-4 bg-accent-600 text-white font-semibold rounded-xl hover:bg-accent-700 transition-all duration-300 hover:scale-105 shadow-soft">
            Xem tất cả bestsellers
            <i class="bx bx-right-arrow-alt text-xl ml-2"></i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Sale Products Section -->
    <section class="py-20 bg-gradient-to-r from-accent-50 via-red-50 to-pink-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16 animate-fade-in-up">
          <div class="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold mb-4">
            🔥 Hot Sale
          </div>
          <h2 class="text-4xl font-bold text-accent-600 mb-4">Sản phẩm đang giảm giá</h2>
          <p class="text-xl text-brand-600 max-w-2xl mx-auto">Cơ hội sở hữu những sản phẩm chất lượng với giá ưu đãi</p>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="(product, index) in saleProducts.slice(0, 8)" 
               :key="product.id"
               class="animate-fade-in-up"
               :style="{ animationDelay: `${index * 100}ms` }">
            <ProductCard 
              :product="product" 
              @preview="handlePreview"
              @added="handleAddedToCart" 
              :show-sale="true"
            />
          </div>
        </div>

        <div class="text-center mt-12">
          <NuxtLink to="/products?sale=true" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent-600 to-red-600 text-white font-semibold rounded-xl hover:from-accent-700 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-glow">
            Xem tất cả sản phẩm sale
            <i class="bx bx-fire text-xl ml-2 animate-bounce-soft"></i>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center p-8 rounded-2xl border border-gray-100 hover:border-accent-200 hover:shadow-soft transition-all duration-300 animate-fade-in-up">
            <div class="w-16 h-16 bg-gradient-to-br from-accent-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl">
              <i class="bx bx-package"></i>
            </div>
            <h3 class="text-xl font-bold text-brand-900 mb-3">Miễn phí vận chuyển</h3>
            <p class="text-brand-600">Giao hàng miễn phí toàn quốc cho đơn hàng từ 500K</p>
          </div>
          
          <div class="text-center p-8 rounded-2xl border border-gray-100 hover:border-accent-200 hover:shadow-soft transition-all duration-300 animate-fade-in-up animation-delay-200">
            <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl">
              <i class="bx bx-refresh"></i>
            </div>
            <h3 class="text-xl font-bold text-brand-900 mb-3">Đổi trả dễ dàng</h3>
            <p class="text-brand-600">Chính sách đổi trả trong 30 ngày, hoàn tiền 100%</p>
          </div>
          
          <div class="text-center p-8 rounded-2xl border border-gray-100 hover:border-accent-200 hover:shadow-soft transition-all duration-300 animate-fade-in-up animation-delay-400">
            <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl">
              <i class="bx bx-support"></i>
            </div>
            <h3 class="text-xl font-bold text-brand-900 mb-3">Hỗ trợ 24/7</h3>
            <p class="text-brand-600">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-20 bg-gradient-to-br from-brand-900 via-brand-800 to-accent-900 text-white relative overflow-hidden">
      <!-- Background decorations -->
      <div class="absolute inset-0">
        <div class="absolute top-10 left-10 w-32 h-32 bg-accent-500/20 rounded-full blur-xl"></div>
        <div class="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
      
      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="animate-fade-in-up">
          <h2 class="text-4xl font-bold mb-6">Đăng ký nhận thông tin mới nhất</h2>
          <p class="text-xl text-brand-300 mb-12 max-w-2xl mx-auto">
            Nhận thông báo về sản phẩm mới, ưu đãi độc quyền và xu hướng thời trang mới nhất
          </p>
          
          <div class="max-w-md mx-auto">
            <div class="flex gap-4">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..."
                class="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              >
              <button class="px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-soft">
                Đăng ký
              </button>
            </div>
            <p class="text-sm text-brand-400 mt-4">
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Preview Modal -->
    <ProductPreview 
      v-if="showPreview" 
      :product="previewProduct" 
      :visible="showPreview" 
      @close="showPreview = false"
      @added="handleAddedToCart" 
    />

    <!-- Toast Notification -->
    <Toast v-if="toast" :key="toast.key" :message="toast.message" :type="toast.type" />
  </div>
</template>

<style scoped>
/* Animation utilities */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
    opacity: 0;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Custom gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Enhanced loading spinner */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Smooth hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:scale-110:hover {
  transform: scale(1.1);
}

/* Background blend modes */
.mix-blend-multiply {
  mix-blend-mode: multiply;
}

/* Backdrop blur support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

@supports not (backdrop-filter: blur(4px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.8);
  }
}

/* Gradient borders */
.gradient-border {
  background: linear-gradient(white, white) padding-box,
              linear-gradient(45deg, #ef4444, #8b5cf6) border-box;
  border: 2px solid transparent;
}

/* Custom animations for floating elements */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Staggered animations */
.stagger-animation:nth-child(1) { animation-delay: 0ms; }
.stagger-animation:nth-child(2) { animation-delay: 100ms; }
.stagger-animation:nth-child(3) { animation-delay: 200ms; }
.stagger-animation:nth-child(4) { animation-delay: 300ms; }
</style>
