<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          Thời trang cho mọi người
        </h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Khám phá bộ sưu tập thời trang đa dạng với chất lượng cao và giá cả hợp lý
        </p>
        <NuxtLink to="/products">
          <el-button size="large" type="primary" class="bg-white text-primary-600 hover:bg-gray-100">
            Mua sắm ngay
          </el-button>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Danh mục sản phẩm</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="category in categories" 
            :key="category.name"
            class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateToCategory(category.value)"
          >
            <div class="text-4xl mb-4">
              <i :class="category.icon"></i>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ category.name }}</h3>
            <p class="text-gray-600 text-sm">{{ category.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center mb-12">Sản phẩm nổi bật</h2>
        <div v-if="loading" class="text-center">
          <el-loading />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id" 
            :product="product" 
            @preview="handlePreview"
            @added="handleAddedToCart"
          />
        </div>
        <ProductPreview
          v-if="showPreview"
          :product="previewProduct"
          :visible="showPreview"
          @close="showPreview = false"
          @added="handleAddedToCart"
        />
        <Toast v-if="toast" :key="toast.key" :message="toast.message" :type="toast.type" />
      </div>
    </section>
  </div>
</template>

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
const previewProduct = ref(null)
const toast = ref<{ message: string, type: 'success'|'error', key: number }|null>(null)

const categories = [
  {
    name: 'Quần áo',
    value: 'quần áo',
    icon: 'bx bx-tshirt',
    description: 'Áo thun, áo sơ mi, quần jean...'
  },
  {
    name: 'Giày dép',
    value: 'giày dép',
    icon: 'bx bx-walk',
    description: 'Sneaker, giày công sở...'
  },
  {
    name: 'Ví',
    value: 'ví',
    icon: 'bx bx-briefcase',
    description: 'Ví da, ví cầm tay...'
  },
  {
    name: 'Túi xách',
    value: 'túi xách',
    icon: 'bx bx-shopping-bag',
    description: 'Túi xách, balo...'
  }
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

function handlePreview(product: any) {
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