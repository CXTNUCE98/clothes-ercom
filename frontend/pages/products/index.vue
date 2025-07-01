<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
        <p class="text-gray-500">Khám phá bộ sưu tập thời trang mới nhất!</p>
      </div>
      <!-- Search and Filter -->
      <div class="flex flex-col md:flex-row gap-4 items-center bg-white rounded-xl shadow px-4 py-3">
        <el-input
          v-model="searchQuery"
          placeholder="Tìm kiếm sản phẩm..."
          clearable
          class="w-64"
          @input="handleSearch"
        >
          <template #prefix>
            <i class="bx bx-search text-gray-400"></i>
          </template>
        </el-input>
        <el-select v-model="selectedCategory" placeholder="Danh mục" class="w-40" @change="handleFilter">
          <el-option label="Tất cả" value="all" />
          <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
          />
        </el-select>
        <el-select v-model="sortBy" placeholder="Sắp xếp" class="w-40" @change="handleFilter">
          <el-option label="Mới nhất" value="newest" />
          <el-option label="Giá tăng dần" value="price-asc" />
          <el-option label="Giá giảm dần" value="price-desc" />
        </el-select>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="text-center py-12">
      <el-loading />
    </div>
    
    <div v-else-if="products.length === 0" class="text-center py-12">
      <div class="text-gray-500">
        <i class="bx bx-package text-6xl mb-4"></i>
        <p class="text-xl">Không tìm thấy sản phẩm</p>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
        @preview="handlePreview"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-8 flex justify-center">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '../composables/useApi'
import { useDebounceFn } from '@vueuse/core'
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

const route = useRoute()
const { $fetch } = useApi()

const loading = ref(false)
const products = ref<Product[]>([])
const categories = ref<string[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)

const searchQuery = ref('')
const selectedCategory = ref('all')
const sortBy = ref('newest')

const showPreview = ref(false)
const previewProduct = ref(null)
const toast = ref<{ message: string, type: 'success'|'error', key: number }|null>(null)

// Get query params
onMounted(() => {
  const { category, search, sort } = route.query
  if (category) selectedCategory.value = category as string
  if (search) searchQuery.value = search as string
  if (sort) sortBy.value = sort as string
  
  fetchCategories()
  fetchProducts()
})

const fetchCategories = async () => {
  try {
    const response = await $fetch('/products/categories/list')
    categories.value = response.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (selectedCategory.value !== 'all') {
      params.append('category', selectedCategory.value)
    }
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    if (sortBy.value !== 'newest') {
      params.append('sort', sortBy.value)
    }
    
    const response = await $fetch(`/products?${params.toString()}`)
    products.value = response.products
    total.value = response.products.length // In real app, this would come from API
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchProducts()
}, 500)

const handleFilter = () => {
  currentPage.value = 1
  fetchProducts()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchProducts()
}

const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

function handlePreview(product: any) {
  previewProduct.value = product
  showPreview.value = true
}

function handleAddedToCart() {
  toast.value = { message: 'Đã thêm vào giỏ hàng', type: 'success', key: Date.now() }
}
</script>

<style scoped>
.el-input, .el-select {
  @apply rounded-lg shadow-sm border border-gray-200 focus-within:border-brand-600 transition-colors;
}
.el-input__wrapper, .el-select__wrapper {
  @apply rounded-lg;
}
.el-select-dropdown__item.selected {
  @apply bg-brand-50 text-brand-600;
}
</style> 