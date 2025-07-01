<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header v-if="!hideHeaderFooter" class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <!-- Top promotional bar -->
      <div class="bg-gradient-to-r from-accent-600 to-accent-500 text-white py-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center text-sm">
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <i class="bx bx-phone text-sm"></i>
                <span class="font-medium">0909 726 522</span>
              </div>
              <div class="hidden sm:flex items-center gap-2">
                <i class="bx bx-envelope text-sm"></i>
                <span>info@realclothes.com</span>
              </div>
            </div>
            <div class="flex items-center">
              <div class="animate-pulse-soft">
                <span class="font-semibold">🔥 SALE đến 50% - Miễn phí vận chuyển toàn quốc</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main navigation -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <div class="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-soft group-hover:shadow-soft-lg transition-all duration-300">
              R
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-brand-900 group-hover:text-accent-600 transition-colors">Real Clothes</span>
              <span class="text-xs text-brand-500 -mt-1">Fashion for everyone</span>
            </div>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-1">
            <!-- Sale Menu -->
            <div class="relative group">
              <button class="nav-item text-accent-600 font-semibold bg-accent-50 hover:bg-accent-100">
                <span>On Sale</span>
                <i class="bx bx-chevron-down ml-1 text-sm transition-transform group-hover:rotate-180"></i>
              </button>
              <div class="mega-menu opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div class="bg-white rounded-2xl shadow-soft-xl border border-gray-100 p-8 min-w-[500px]">
                  <div class="grid grid-cols-2 gap-8">
                    <div>
                      <h3 class="font-bold text-brand-900 mb-4 text-lg">🔥 FINAL SALE</h3>
                      <ul class="space-y-3">
                        <li><a href="#" class="menu-link">Blazer tay ngắn <span class="text-accent-600 font-semibold">699K</span></a></li>
                        <li><a href="#" class="menu-link">Đầm mùa hè <span class="text-accent-600 font-semibold">599K</span></a></li>
                        <li><a href="#" class="menu-link">Sơ mi công sở <span class="text-accent-600 font-semibold">449K</span></a></li>
                        <li><a href="#" class="menu-link">Jeans từ <span class="text-accent-600 font-semibold">249K</span></a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="font-bold text-brand-900 mb-4 text-lg">🎁 Ưu đãi tháng 6</h3>
                      <ul class="space-y-3">
                        <li><a href="#" class="menu-link">Quà tặng đơn <span class="text-success-600 font-semibold">1.499K</span></a></li>
                        <li><a href="#" class="menu-link">Quà tặng đơn <span class="text-success-600 font-semibold">1.799K</span></a></li>
                        <li><a href="#" class="menu-link">Quà tặng đơn <span class="text-success-600 font-semibold">2.299K</span></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Áo Menu -->
            <div class="relative group">
              <button class="nav-item">
                <span>Áo</span>
                <i class="bx bx-chevron-down ml-1 text-sm transition-transform group-hover:rotate-180"></i>
              </button>
              <div class="mega-menu opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div class="bg-white rounded-2xl shadow-soft-xl border border-gray-100 p-8 min-w-[600px]">
                  <div class="grid grid-cols-3 gap-8">
                    <div>
                      <h3 class="font-bold text-brand-900 mb-4 flex items-center gap-2">
                        <i class="bx bx-closet text-xl text-accent-500"></i>
                        Áo công sở
                      </h3>
                      <ul class="space-y-3">
                        <li><a href="#" class="menu-link">Blazer</a></li>
                        <li><a href="#" class="menu-link">Sơ mi</a></li>
                        <li><a href="#" class="menu-link">Áo kiểu</a></li>
                        <li><a href="#" class="menu-link">Áo vest</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="font-bold text-brand-900 mb-4 flex items-center gap-2">
                        <i class="bx bx-closet text-xl text-accent-500"></i>
                        Áo thời trang
                      </h3>
                      <ul class="space-y-3">
                        <li><a href="#" class="menu-link">Áo thun</a></li>
                        <li><a href="#" class="menu-link">Áo 2 dây</a></li>
                        <li><a href="#" class="menu-link">Tank top</a></li>
                        <li><a href="#" class="menu-link">Crop top</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="font-bold text-brand-900 mb-4 flex items-center gap-2">
                        <i class="bx bx-star text-xl text-warning-500"></i>
                        Trending
                      </h3>
                      <ul class="space-y-3">
                        <li><a href="#" class="menu-link flex items-center gap-2">
                          <span>Áo len mỏng</span>
                          <span class="bg-accent-100 text-accent-700 text-xs px-2 py-1 rounded-full">Hot</span>
                        </a></li>
                        <li><a href="#" class="menu-link">Cardigan</a></li>
                        <li><a href="#" class="menu-link">Hoodie nữ</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Other menu items -->
            <div class="relative group">
              <button class="nav-item">
                <span>Quần</span>
                <i class="bx bx-chevron-down ml-1 text-sm transition-transform group-hover:rotate-180"></i>
              </button>
              <div class="mega-menu opacity-0 invisible group-hover:opacity-100 group-hover:visible">
                <div class="bg-white rounded-2xl shadow-soft-xl border border-gray-100 p-8 min-w-[500px]">
                  <div class="grid grid-cols-2 gap-8">
                    <div>
                      <h3 class="font-bold text-brand-900 mb-4">Quần công sở</h3>
                      <ul class="space-y-3">
                        <li><a href="#" class="menu-link">Quần tây</a></li>
                        <li><a href="#" class="menu-link">Quần lưng cao</a></li>
                        <li><a href="#" class="menu-link">Quần dập li</a></li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="font-bold text-brand-900 mb-4">Quần thời trang</h3>
                      <ul class="space-y-3">
                        <li><a href="#" class="menu-link">Quần suông</a></li>
                        <li><a href="#" class="menu-link">Quần short</a></li>
                        <li><a href="#" class="menu-link">Quần Jeans</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NuxtLink to="/products?category=chân váy" class="nav-item">Chân váy</NuxtLink>
            <NuxtLink to="/products?category=đầm" class="nav-item">Đầm</NuxtLink>
            <NuxtLink to="/products?category=áo dài" class="nav-item">Áo dài</NuxtLink>
          </nav>

          <!-- Search Bar -->
          <div class="hidden md:flex flex-1 max-w-lg mx-8">
            <div class="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="w-full px-5 py-3 pl-12 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-accent-500 focus:bg-white transition-all duration-300 text-brand-700 placeholder-brand-400"
              >
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                <i class="bx bx-search text-xl text-brand-400"></i>
              </div>
              <button class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-accent-500 text-white px-4 py-1.5 rounded-lg hover:bg-accent-600 transition-colors text-sm font-medium">
                Tìm
              </button>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-4">
            <!-- Cart -->
            <NuxtLink to="/cart" class="relative group">
              <div class="p-3 rounded-xl bg-gray-50 group-hover:bg-accent-50 transition-colors">
                <i class="bx bx-cart text-2xl text-brand-700 group-hover:text-accent-600 transition-colors"></i>
                <span 
                  v-if="cartCount > 0" 
                  class="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-semibold shadow-soft animate-bounce-soft"
                >
                  {{ cartCount }}
                </span>
              </div>
            </NuxtLink>

            <!-- User Menu -->
            <div class="relative" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
              <button class="flex items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-brand-100 transition-colors group">
                <i class="bx bx-user text-2xl text-brand-700 group-hover:text-brand-900"></i>
                <i class="bx bx-chevron-down text-sm text-brand-500 group-hover:text-brand-700 transition-transform" :class="{'rotate-180': showUserMenu}"></i>
              </button>
              <transition name="dropdown">
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-soft-xl border border-gray-100 py-2 overflow-hidden">
                  <template v-if="isAuthenticated">
                    <div class="px-4 py-3 border-b border-gray-100">
                      <div class="font-semibold text-brand-900">{{ user?.name }}</div>
                      <div class="text-sm text-brand-500">{{ user?.email }}</div>
                    </div>
                    <NuxtLink to="/profile" class="dropdown-item">
                      <i class="bx bx-user-circle"></i>
                      <span>Thông tin cá nhân</span>
                    </NuxtLink>
                    <NuxtLink to="/orders" class="dropdown-item">
                      <i class="bx bx-receipt"></i>
                      <span>Đơn hàng của tôi</span>
                    </NuxtLink>
                    <button @click="logout" class="dropdown-item w-full text-left text-accent-600">
                      <i class="bx bx-log-out"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </template>
                  <template v-else>
                    <NuxtLink to="/login" class="dropdown-item">
                      <i class="bx bx-log-in"></i>
                      <span>Đăng nhập</span>
                    </NuxtLink>
                    <NuxtLink to="/register" class="dropdown-item">
                      <i class="bx bx-user-plus"></i>
                      <span>Đăng ký</span>
                    </NuxtLink>
                  </template>
                </div>
              </transition>
            </div>

            <!-- Mobile Menu Button -->
            <button class="lg:hidden p-3 rounded-xl bg-gray-50 hover:bg-brand-100 transition-colors" @click="drawerOpen = true">
              <i class="bx bx-menu text-2xl text-brand-700"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="mobile-menu">
        <div v-if="drawerOpen" class="fixed inset-0 z-50 lg:hidden">
          <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" @click="drawerOpen = false"></div>
          <div class="fixed top-0 left-0 w-80 h-full bg-white shadow-soft-xl overflow-y-auto">
            <div class="p-6">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                    R
                  </div>
                  <span class="text-xl font-bold text-brand-900">Real Clothes</span>
                </div>
                <button @click="drawerOpen = false" class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <i class="bx bx-x text-2xl text-brand-700"></i>
              </button>
            </div>
              
              <!-- Mobile Search -->
              <div class="mb-6">
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    class="w-full px-4 py-3 pl-11 bg-gray-50 border-0 rounded-xl text-brand-700 placeholder-brand-400"
                  >
                  <i class="bx bx-search absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-400"></i>
                </div>
              </div>

              <!-- Mobile Navigation -->
              <nav class="space-y-2">
                <a href="#" class="mobile-menu-item text-accent-600 font-semibold">🔥 On Sale</a>
                <a href="#" class="mobile-menu-item">👔 Áo</a>
                <a href="#" class="mobile-menu-item">👖 Quần</a>
                <a href="#" class="mobile-menu-item">👗 Chân váy</a>
                <a href="#" class="mobile-menu-item">👗 Đầm</a>
                <a href="#" class="mobile-menu-item">🥻 Áo dài</a>
                
                <div class="border-t border-gray-200 my-4"></div>
                
                <NuxtLink to="/cart" class="mobile-menu-item" @click="drawerOpen = false">
                  <span>🛒 Giỏ hàng</span>
                  <span v-if="cartCount > 0" class="bg-accent-500 text-white text-xs px-2 py-1 rounded-full">{{ cartCount }}</span>
            </NuxtLink>
                
            <template v-if="isAuthenticated">
                  <a href="/profile" class="mobile-menu-item">👤 Thông tin cá nhân</a>
                  <a href="/orders" class="mobile-menu-item">📋 Đơn hàng</a>
                  <button @click="logout; drawerOpen = false" class="mobile-menu-item w-full text-left text-accent-600">
                    🚪 Đăng xuất
                  </button>
            </template>
            <template v-else>
                  <a href="/login" class="mobile-menu-item">🔑 Đăng nhập</a>
                  <a href="/register" class="mobile-menu-item">📝 Đăng ký</a>
            </template>
              </nav>
            </div>
          </div>
        </div>
      </transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer v-if="!hideHeaderFooter" class="bg-brand-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                R
              </div>
              <div>
                <h3 class="text-2xl font-bold">Real Clothes</h3>
                <p class="text-brand-400 text-sm">Fashion for everyone</p>
              </div>
            </div>
            <p class="text-brand-300 text-lg mb-6 max-w-md">
              Thời trang chất lượng cao với thiết kế hiện đại, phù hợp với mọi phong cách và cá tính.
            </p>
            <div class="flex gap-4">
              <a href="#" class="social-link">
                <i class="bx bxl-facebook text-xl"></i>
              </a>
              <a href="#" class="social-link">
                <i class="bx bxl-instagram text-xl"></i>
              </a>
              <a href="#" class="social-link">
                <i class="bx bxl-tiktok text-xl"></i>
              </a>
              <a href="#" class="social-link">
                <i class="bx bxl-youtube text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 class="font-bold text-lg mb-6 text-white">Thông tin</h4>
            <ul class="space-y-4">
              <li><a href="#" class="footer-link">Về chúng tôi</a></li>
              <li><a href="#" class="footer-link">Chính sách đổi trả</a></li>
              <li><a href="#" class="footer-link">Chính sách giao hàng</a></li>
              <li><a href="#" class="footer-link">Chính sách bảo mật</a></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold text-lg mb-6 text-white">Liên hệ</h4>
            <div class="space-y-4">
              <div class="flex items-center gap-3">
                <i class="bx bx-phone text-accent-400 text-xl"></i>
                <span class="text-brand-300">0909 726 522</span>
              </div>
              <div class="flex items-center gap-3">
                <i class="bx bx-envelope text-accent-400 text-xl"></i>
                <span class="text-brand-300">info@realclothes.com</span>
              </div>
              <div class="flex items-start gap-3">
                <i class="bx bx-map text-accent-400 text-xl mt-1"></i>
                <span class="text-brand-300">68 Nguyễn Huệ, Phường Bến Nghé<br>Quận 1, TP. Hồ Chí Minh</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t border-brand-800 pt-8 text-center">
          <p class="text-brand-400">&copy; 2024 Real Clothes. All rights reserved. Made with ❤️ in Vietnam</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted, computed } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'
import { useCartCount } from '../composables/useCartCount'
import { useRoute } from 'vue-router'

const drawerOpen = ref(false)
const showUserMenu = ref(false)

const { user, isAuthenticated, logout } = useAuth()
const { cartCount, fetchCartCount } = useCartCount()
const route = useRoute()

const hideHeaderFooter = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

onMounted(() => {
  fetchCartCount()
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

watchEffect(() => {
  if (isAuthenticated.value) fetchCartCount()
})
</script>

<style scoped>
.nav-item {
  @apply px-4 py-2 rounded-lg text-brand-700 hover:text-accent-600 font-medium transition-all duration-300 flex items-center gap-1 hover:bg-gray-50;
}

.mega-menu {
  @apply absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 invisible transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto;
}

.menu-link {
  @apply text-brand-600 hover:text-accent-600 text-sm transition-colors duration-200 py-2 block hover:bg-gray-50 px-2 rounded-lg;
}

.dropdown-item {
  @apply flex items-center gap-3 px-4 py-3 text-sm text-brand-700 hover:bg-gray-50 hover:text-accent-600 transition-colors duration-200;
}

.mobile-menu-item {
  @apply flex items-center justify-between py-4 px-4 text-brand-700 hover:text-accent-600 font-medium transition-colors duration-200 rounded-xl hover:bg-gray-50;
}

.social-link {
  @apply w-10 h-10 bg-brand-800 hover:bg-accent-600 rounded-lg flex items-center justify-center text-brand-300 hover:text-white transition-all duration-300 hover:scale-110;
}

.footer-link {
  @apply text-brand-300 hover:text-white transition-colors duration-200 text-sm;
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.mobile-menu-enter-active, .mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from, .mobile-menu-leave-to {
  transform: translateX(-100%);
}

/* Mega menu positioning improvements */
.group:hover .mega-menu {
  @apply opacity-100 visible pointer-events-auto;
}

/* Custom scrollbar for mobile menu */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  @apply bg-gray-100;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-gray-400 rounded-full;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-md {
    background-color: rgba(255, 255, 255, 0.98);
}
}

/* Enhanced hover states */
.nav-item:hover {
  @apply transform scale-105;
}

/* Gradient text for logo */
.bg-gradient-to-br {
  background-image: linear-gradient(135deg, var(--tw-gradient-stops));
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus states for accessibility */
.nav-item:focus,
.dropdown-item:focus,
.mobile-menu-item:focus {
  @apply outline-none ring-2 ring-accent-500 ring-offset-2;
}

/* Animation delays for staggered effects */
.nav-item:nth-child(1) { transition-delay: 0ms; }
.nav-item:nth-child(2) { transition-delay: 50ms; }
.nav-item:nth-child(3) { transition-delay: 100ms; }
.nav-item:nth-child(4) { transition-delay: 150ms; }
.nav-item:nth-child(5) { transition-delay: 200ms; }
.nav-item:nth-child(6) { transition-delay: 250ms; }
</style> 