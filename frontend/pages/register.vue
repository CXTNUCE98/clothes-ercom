<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col gap-8 animate-fade-in">
      <div class="flex flex-col items-center gap-2">
        <div class="bg-primary-100 rounded-full p-3 mb-2 shadow">
          <i class="bx bx-user-plus text-5xl text-primary-600"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Đăng ký tài khoản</h2>
        <p class="text-gray-500 text-sm">Tạo tài khoản mới để trải nghiệm mua sắm!</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleRegister" class="flex flex-col gap-6">
        <el-form-item prop="name">
          <div class="relative">
            <i class="bx bx-user absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400"></i>
            <el-input
              v-model="form.name"
              placeholder="Họ và tên"
              size="large"
              class="pl-10 rounded-lg"
              autocomplete="name"
            />
          </div>
        </el-form-item>
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
              autocomplete="new-password"
            />
          </div>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <div class="relative">
            <i class="bx bx-lock absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400"></i>
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Xác nhận mật khẩu"
              size="large"
              class="pl-10 rounded-lg"
              show-password
              autocomplete="new-password"
            />
          </div>
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          class="w-full font-semibold rounded-lg shadow hover:shadow-lg transition-all duration-200"
          :loading="loading"
          @click="handleRegister"
        >
          Đăng ký
        </el-button>
      </el-form>
      <div class="text-center text-sm text-gray-500">
        Đã có tài khoản?
        <NuxtLink to="/login" class="text-primary-600 font-semibold hover:underline ml-1">Đăng nhập</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const { register } = useAuth()
const loading = ref(false)
const formRef = ref()

const form = reactive<RegisterForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('Vui lòng xác nhận mật khẩu'))
  } else if (value !== form.password) {
    callback(new Error('Mật khẩu xác nhận không khớp'))
  } else {
    callback()
  }
}

const rules = {
  name: [
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password
    })
    if (result.success) {
      const { $ElMessage } = useNuxtApp()
      $ElMessage.success('Đăng ký thành công')
      navigateTo('/')
    } else {
      const { $ElMessage } = useNuxtApp()
      $ElMessage.error(result.error)
    }
  } catch (error) {
    console.error('Register error:', error)
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