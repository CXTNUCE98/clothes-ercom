<template>
  <div class="min-h-screen flex flex-col bg-transparent">
    <!-- Header -->
    <header class="bg-white/90 shadow-sm border-b sticky top-0 z-30 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div class="flex justify-between items-center h-20 relative">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-3 text-3xl font-extrabold text-primary-600 hover:text-primary-700 transition">
            <i class="bx bx-store-alt text-4xl"></i>
            Clothes Store
          </NuxtLink>

          <!-- Desktop Menu -->
          <nav class="hidden md:flex items-center gap-10 ml-8">
            <NuxtLink to="/" class="menu-link">Trang chủ</NuxtLink>
            <NuxtLink to="/products" class="menu-link">Sản phẩm</NuxtLink>
          </nav>

          <!-- Right section: Cart + User -->
          <div class="flex items-center gap-6">
            <!-- Cart Icon -->
            <NuxtLink to="/cart" class="relative group">
              <i class="bx bx-cart text-3xl text-gray-700 hover:text-primary-600 transition"></i>
              <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 shadow font-bold border-2 border-white">{{ cartCount }}</span>
            </NuxtLink>

            <!-- User Dropdown -->
            <div class="relative" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
              <button @click="toggleUserMenu" class="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary-50 transition group border border-transparent hover:border-primary-200">
                <i class="bx bx-user-circle text-3xl text-primary-600"></i>
                <span v-if="isAuthenticated" class="font-semibold text-gray-700 group-hover:text-primary-600 transition">{{ user?.name }}</span>
                <i class="bx bx-chevron-down text-xl text-gray-400"></i>
              </button>
              <!-- Dropdown -->
              <transition name="fade">
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 z-40 animate-fade-in border border-gray-100">
                  <template v-if="isAuthenticated">
                    <div class="px-4 py-2 text-gray-700 font-semibold border-b">Xin chào, {{ user?.name }}</div>
                    <NuxtLink to="/profile" class="dropdown-link"><i class="bx bx-user mr-2"></i>Thông tin cá nhân</NuxtLink>
                    <NuxtLink to="/orders" class="dropdown-link"><i class="bx bx-receipt mr-2"></i>Đơn hàng</NuxtLink>
                    <button @click="logout" class="dropdown-link w-full text-left"><i class="bx bx-log-out mr-2"></i>Đăng xuất</button>
                  </template>
                  <template v-else>
                    <NuxtLink to="/login" class="dropdown-link"><i class="bx bx-log-in mr-2"></i>Đăng nhập</NuxtLink>
                    <NuxtLink to="/register" class="dropdown-link"><i class="bx bx-user-plus mr-2"></i>Đăng ký</NuxtLink>
                  </template>
                </div>
              </transition>
            </div>

            <!-- Hamburger (Mobile) -->
            <button class="md:hidden flex items-center justify-center w-12 h-12 rounded-full hover:bg-primary-50 transition shadow border border-gray-200" @click="drawerOpen = true">
              <i class="bx bx-menu text-3xl"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile Drawer -->
      <transition name="slide">
        <div v-if="drawerOpen" class="fixed inset-0 z-40 flex">
          <div class="bg-white w-72 h-full shadow-2xl p-8 flex flex-col gap-8 animate-slide-in rounded-r-3xl border-r border-primary-100">
            <div class="flex items-center justify-between mb-8">
              <NuxtLink to="/" class="flex items-center gap-2 text-2xl font-bold text-primary-600">
                <i class="bx bx-store-alt text-3xl"></i>
                Clothes Store
              </NuxtLink>
              <button @click="drawerOpen = false" class="text-gray-400 hover:text-primary-600 transition">
                <i class="bx bx-x text-3xl"></i>
              </button>
            </div>
            <NuxtLink to="/" class="mobile-link" @click="drawerOpen = false">Trang chủ</NuxtLink>
            <NuxtLink to="/products" class="mobile-link" @click="drawerOpen = false">Sản phẩm</NuxtLink>
            <NuxtLink to="/cart" class="mobile-link" @click="drawerOpen = false">
              <i class="bx bx-cart mr-2"></i>Giỏ hàng
              <span v-if="cartCount > 0" class="ml-2 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">{{ cartCount }}</span>
            </NuxtLink>
            <div class="border-t my-2"></div>
            <template v-if="isAuthenticated">
              <NuxtLink to="/profile" class="mobile-link" @click="drawerOpen = false"><i class="bx bx-user mr-2"></i>Thông tin cá nhân</NuxtLink>
              <NuxtLink to="/orders" class="mobile-link" @click="drawerOpen = false"><i class="bx bx-receipt mr-2"></i>Đơn hàng</NuxtLink>
              <button @click="logout; drawerOpen = false" class="mobile-link w-full text-left"><i class="bx bx-log-out mr-2"></i>Đăng xuất</button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="mobile-link" @click="drawerOpen = false"><i class="bx bx-log-in mr-2"></i>Đăng nhập</NuxtLink>
              <NuxtLink to="/register" class="mobile-link" @click="drawerOpen = false"><i class="bx bx-user-plus mr-2"></i>Đăng ký</NuxtLink>
            </template>
          </div>
          <div class="flex-1 bg-black/30 backdrop-blur-sm" @click="drawerOpen = false"></div>
        </div>
      </transition>
    </header>

    <!-- Main content -->
    <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-primary-600 text-white py-10 mt-8 shadow-inner">
      <div class="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div class="text-center">
          <p class="text-lg font-semibold tracking-wide">&copy; 2024 Clothes Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useApi } from '../composables/useApi'
import { useCartCount } from '../composables/useCartCount'

const drawerOpen = ref(false)
const showUserMenu = ref(false)

const { user, isAuthenticated, logout } = useAuth()
const { cartCount, fetchCartCount } = useCartCount()

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
.menu-link {
  @apply text-gray-700 font-semibold text-lg px-4 py-2 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition;
}
.dropdown-link {
  @apply flex items-center px-5 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition w-full text-base rounded-xl;
}
.mobile-link {
  @apply flex items-center text-lg px-4 py-4 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition font-semibold;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.4,0,0.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: none; }
}
@media (max-width: 768px) {
  .menu-link { display: none !important; }
}
</style> 