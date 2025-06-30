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
const showPreview = ref(false)
const previewProduct = ref<Product | null>(null)
const toast = ref<{ message: string; type: 'success' | 'error'; key: number } | null>(null)

const categories = [
  { name: 'Quần áo', value: 'quần áo', icon: 'bx bx-tshirt', description: 'Áo thun, áo sơ mi, quần jean...' },
  { name: 'Giày dép', value: 'giày dép', icon: 'bx bx-walk', description: 'Sneaker, giày công sở...' },
  { name: 'Ví', value: 'ví', icon: 'bx bx-briefcase', description: 'Ví da, ví cầm tay...' },
  { name: 'Túi xách', value: 'túi xách', icon: 'bx bx-shopping-bag', description: 'Túi xách, balo...' }
]

const fetchFeaturedProducts = async () => {
  loading.value = true
  try {
    const response = await $fetch('/products?limit=8')
    featuredProducts.value = response.products
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
  fetchFeaturedProducts()
})
</script>

<template>
  <div>

    <!-- ✅ Hero Section -->
    <section
      class="bg-gradient-to-r from-primary-700 via-indigo-500 to-primary-600 text-white py-24 rounded-b-3xl shadow-xl relative overflow-hidden">
      <div class="absolute inset-0 bg-pattern opacity-10"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">
          Thời trang cho mọi người
        </h1>
        <p class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-medium opacity-90 animate-fade-up delay-200">
          Khám phá bộ sưu tập thời trang đa dạng với chất lượng cao và giá cả hợp lý
        </p>
        <NuxtLink to="/products">
          <el-button size="large" type="primary"
            class="bg-white text-primary-700 hover:bg-indigo-50 hover:text-primary-600 font-bold px-8 py-3 rounded-xl shadow-lg text-lg transition-all transform hover:scale-105 animate-fade-up delay-300">
            Mua sắm ngay
          </el-button>
        </NuxtLink>
      </div>
    </section>

    <!-- ✅ Featured Categories -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-12 text-primary-700 animate-fade-up">
          Danh mục sản phẩm
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div v-for="category in categories" :key="category.name"
            class="bg-gradient-to-br from-white via-primary-50 to-indigo-50 rounded-2xl shadow-md p-6 md:p-8 text-center border border-primary-100 hover:border-primary-300 group cursor-pointer transition-all transform hover:-translate-y-2 hover:shadow-xl animate-fade-up"
            @click="navigateToCategory(category.value)">
            <div class="text-4xl md:text-5xl mb-4 text-primary-600 group-hover:text-indigo-500 transition-colors">
              <i :class="category.icon"></i>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-2 text-gray-900 group-hover:text-primary-700 transition">
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-600">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ✅ Featured Products -->
    <section class="py-16 md:py-24 bg-gradient-to-br from-primary-50 via-white to-indigo-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl md:text-4xl font-extrabold text-center mb-12 text-primary-700 animate-fade-up">
          Sản phẩm nổi bật
        </h2>

        <div v-if="loading" class="flex justify-center items-center h-40">
          <el-loading />
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" @preview="handlePreview"
            @added="handleAddedToCart" class="animate-fade-up" />
        </div>

        <!-- ✅ Product Preview Modal -->
        <ProductPreview v-if="showPreview" :product="previewProduct" :visible="showPreview" @close="showPreview = false"
          @added="handleAddedToCart" />

        <!-- ✅ Toast Notification -->
        <Toast v-if="toast" :key="toast.key" :message="toast.message" :type="toast.type" />
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes fade-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fade-up 0.6s ease-out forwards;
}

.animate-fade-up.delay-200 {
  animation-delay: 0.2s;
}

.animate-fade-up.delay-300 {
  animation-delay: 0.3s;
}

.bg-pattern {
  background-image: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
}
</style>
