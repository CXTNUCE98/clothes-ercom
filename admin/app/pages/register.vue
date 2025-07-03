<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

// Use auth layout
definePageMeta({
  layout: 'auth'
})

const { register, isAuthenticated } = useAuth()
const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateForm = () => {
  let isValid = true
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  // Validate name
  if (!form.name) {
    errors.name = 'Vui lòng nhập tên'
    isValid = false
  }

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
  } else if (form.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    isValid = false
  }

  // Validate confirm password
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu không khớp'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    loading.value = true

    await register(form.name, form.email, form.password)

    toast.add({
      title: 'Đăng ký thành công',
      description: 'Chào mừng bạn đến với Admin Dashboard',
      color: 'success'
    })

    // Redirect to dashboard
    await navigateTo('/')
  } catch (error: any) {
    const message = error?.data?.error || 'Đăng ký thất bại'
    toast.add({
      title: 'Đăng ký thất bại',
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
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative max-w-md w-full space-y-8 px-4">
      <!-- Logo and Title -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <i class="i-lucide-user-plus text-white text-2xl"></i>
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Đăng ký tài khoản
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Tạo tài khoản mới để truy cập hệ thống
        </p>
      </div>

      <!-- Register Form -->
      <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
        <form @submit.prevent="handleRegister">
          <div class="space-y-6">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên
              </label>
              <UInput
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Nhập họ và tên"
                autocomplete="name"
                autofocus
                leading-icon="i-lucide-user"
                class="h-12"
                :class="{ 'border-red-500': errors.name }"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.name }}
              </p>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <UInput
                id="email"
                v-model="form.email"
                type="email"
                placeholder="example@email.com"
                autocomplete="email"
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
                autocomplete="new-password"
                leading-icon="i-lucide-lock"
                class="h-12"
                :class="{ 'border-red-500': errors.password }"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.password }}
              </p>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Xác nhận mật khẩu
              </label>
              <UInput
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                autocomplete="new-password"
                leading-icon="i-lucide-lock"
                class="h-12"
                :class="{ 'border-red-500': errors.confirmPassword }"
              />
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.confirmPassword }}
              </p>
            </div>

            <!-- Register Button -->
            <UButton
              type="submit"
              color="primary"
              :loading="loading"
              class="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <i v-if="!loading" class="i-lucide-user-plus h-5 w-5"></i>
              {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
            </UButton>
          </div>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Đã có tài khoản?
            <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
              Đăng nhập ngay
            </NuxtLink>
          </p>
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