<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col gap-8 animate-fade-in">
      <div class="flex flex-col items-center gap-2">
        <div class="bg-primary-100 rounded-full p-3 mb-2 shadow">
          <i class="bx bx-user-circle text-5xl text-primary-600"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Đăng nhập tài khoản</h2>
        <p class="text-gray-500 text-sm">Chào mừng bạn quay trở lại!</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleLogin" class="flex flex-col gap-6">
        <el-form-item prop="email">
          <div class="relative">
            <i class="bx bx-envelope absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400"></i>
            <el-input
              v-model="form.email"
              type="email"
              placeholder="Email"
              size="large"
              class="pl-10 rounded-lg"
              autocomplete="email"
            />
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <div class="relative">
            <i class="bx bx-lock absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400"></i>
            <el-input
              v-model="form.password"
              type="password"
              placeholder="Mật khẩu"
              size="large"
              class="pl-10 rounded-lg"
              show-password
              autocomplete="current-password"
            />
          </div>
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          class="w-full font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-200"
          :loading="loading"
          @click="handleLogin"
        >
          Đăng nhập
        </el-button>
      </el-form>
      <div class="text-center text-sm text-gray-500">
        Chưa có tài khoản?
        <NuxtLink to="/register" class="text-primary-600 font-semibold hover:underline ml-1">Đăng ký ngay</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface LoginForm {
  email: string
  password: string
}

const { login } = useAuth()
const loading = ref(false)
const formRef = ref()

const form = reactive<LoginForm>({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    const result = await login(form)
    if (result.success) {
      const { $ElMessage } = useNuxtApp()
      $ElMessage.success('Đăng nhập thành công')
      navigateTo('/')
    } else {
      const { $ElMessage } = useNuxtApp()
      $ElMessage.error(result.error)
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(0.4,0,0.2,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: none; }
}
</style> 