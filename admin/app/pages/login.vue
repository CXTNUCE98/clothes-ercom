<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

// Use auth layout
definePageMeta({
  layout: 'auth'
})

const { login, isAuthenticated } = useAuth()
const toast = useToast()

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  // Validate email
  if (!form.email) {
    errors.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email không hợp lệ'
    isValid = false
  }

  // Validate password
  if (!form.password) {
    errors.password = 'Vui lòng nhập mật khẩu'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    await login(form.email, form.password)

    toast.add({
      title: 'Đăng nhập thành công',
      description: 'Chào mừng bạn trở lại!',
      color: 'success'
    })

    // Redirect to dashboard
    await navigateTo('/')
  } catch (error: any) {
    const message = error?.data?.error || 'Đăng nhập thất bại'
    toast.add({
      title: 'Đăng nhập thất bại',
      description: message,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Check if already logged in
onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="min-h-screen flex w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative w-full space-y-8 px-4">
      <!-- Logo and Title -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <i class="i-lucide-shield-check text-white text-2xl"></i>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Admin Dashboard
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Đăng nhập để truy cập hệ thống quản lý
        </p>
      </div>

      <!-- Login Form -->
      <div class="flex justify-center">
        <div class="w-500px bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        <form @submit.prevent="handleLogin">
          <div class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <UInput
                id="email"
                v-model="form.email"
                type="email"
                placeholder="admin@example.com"
                autocomplete="email"
                autofocus
                leading-icon="i-lucide-mail"
                class="h-12"
                :class="{ 'border-red-500': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.email }}
              </p>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu
              </label>
              <UInput
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Nhập mật khẩu"
                autocomplete="current-password"
                leading-icon="i-lucide-lock"
                class="h-12"
                :class="{ 'border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.password }}
              </p>
            </div>

            <!-- Login Button -->
            <UButton
              type="submit"
              color="primary"
              :loading="loading"
              class="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <i v-if="!loading" class="i-lucide-log-in h-5 w-5"></i>
              {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </UButton>
          </div>
        </form>

        <!-- Demo Account Info -->
        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-2">
            <i class="i-lucide-info text-blue-600 dark:text-blue-400"></i>
            <span class="text-sm font-medium text-blue-800 dark:text-blue-200">Tài khoản demo</span>
          </div>
          <div class="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <div><strong>Email:</strong> admin@example.com</div>
            <div><strong>Password:</strong> password123</div>
          </div>
        </div>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Chưa có tài khoản?
            <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Đăng ký ngay
            </NuxtLink>
          </p>
        </div>
      </div>
      </div>

      <!-- Footer -->
      <div class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          © 2024 Admin Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style> 