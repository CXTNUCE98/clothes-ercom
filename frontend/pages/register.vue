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
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const mounted = ref(false)
const acceptTerms = ref(false)

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
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
    { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự', trigger: 'blur' }
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
  if (!formRef.value || !acceptTerms.value) return
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

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <div class="register-container">
    <!-- Animated Background -->
    <div class="background-overlay">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="content-wrapper" :class="{ 'mounted': mounted }">
      <!-- Register Card -->
      <div class="register-card">
        <!-- Card Header -->
        <div class="card-header">
          <div class="logo-container">
            <div class="logo-circle">
              <i class="bx bx-user-plus"></i>
            </div>
            <div class="logo-ripple"></div>
          </div>
          <h1 class="title">Đăng ký tài khoản</h1>
          <p class="subtitle">Tạo tài khoản mới để trải nghiệm mua sắm!</p>
        </div>

        <!-- Register Form -->
        <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleRegister" class="register-form">
          <!-- Name Field -->
          <el-form-item prop="name" class="form-item">
            <div class="input-wrapper w-full">
              <div class="input-icon">
                <i class="bx bx-user"></i>
              </div>
              <el-input v-model="form.name" placeholder="Nhập họ và tên của bạn" size="large" class="custom-input"
                autocomplete="name" />
            </div>
          </el-form-item>

          <!-- Email Field -->
          <el-form-item prop="email" class="form-item">
            <div class="input-wrapper w-full">
              <div class="input-icon">
                <i class="bx bx-envelope"></i>
              </div>
              <el-input v-model="form.email" type="email" placeholder="Nhập email của bạn" size="large"
                class="custom-input" autocomplete="email" />
            </div>
          </el-form-item>

          <!-- Password Field -->
          <el-form-item prop="password" class="form-item">
            <div class="input-wrapper w-full">
              <div class="input-icon">
                <i class="bx bx-lock-alt"></i>
              </div>
              <el-input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu của bạn" size="large" class="custom-input" autocomplete="new-password" />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'bx bx-hide' : 'bx bx-show'"></i>
              </button>
            </div>
          </el-form-item>

          <!-- Confirm Password Field -->
          <el-form-item prop="confirmPassword" class="form-item">
            <div class="input-wrapper w-full">
              <div class="input-icon">
                <i class="bx bx-lock"></i>
              </div>
              <el-input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Xác nhận mật khẩu của bạn" size="large" class="custom-input" autocomplete="new-password" />
              <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                <i :class="showConfirmPassword ? 'bx bx-hide' : 'bx bx-show'"></i>
              </button>
            </div>
          </el-form-item>

          <!-- Terms and Conditions -->
          <div class="terms-checkbox">
            <label class="checkbox-container">
              <input type="checkbox" v-model="acceptTerms" />
              <span class="checkmark"></span>
              <span class="checkbox-text">
                Tôi đồng ý với
                <a href="/terms" class="terms-link">Điều khoản sử dụng</a>
                và
                <a href="/privacy" class="terms-link">Chính sách bảo mật</a>
              </span>
            </label>
          </div>

          <!-- Register Button -->
          <el-button type="primary" size="large" class="register-btn" :loading="loading" :disabled="!acceptTerms"
            @click="handleRegister">
            <span v-if="!loading" class="btn-content">
              <i class="bx bx-user-plus"></i>
              Đăng ký tài khoản
            </span>
            <span v-else class="btn-loading">
              <i class="bx bx-loader-alt rotating"></i>
              Đang xử lý...
            </span>
          </el-button>
        </el-form>

        <!-- Divider -->
        <div class="divider">
          <span>hoặc</span>
        </div>

        <!-- Social Register -->
        <div class="social-register">
          <button class="social-btn google-btn">
            <i class="bx bxl-google"></i>
            <span>Đăng ký với Google</span>
          </button>
          <button class="social-btn facebook-btn">
            <i class="bx bxl-facebook"></i>
            <span>Đăng ký với Facebook</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="login-link">
          <span>Đã có tài khoản?</span>
          <NuxtLink to="/login" class="signin-link">
            Đăng nhập ngay
            <i class="bx bx-right-arrow-alt"></i>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Base Styles */
.register-container {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  overflow: hidden;
  background: linear-gradient(135deg,
      #ff9a9e 0%,
      #fecfef 25%,
      #fecfef 50%,
      #a8edea 75%,
      #fed6e3 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Animated Background */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 70px;
  height: 70px;
  top: 15%;
  left: 8%;
  animation-delay: 0s;
}

.shape-2 {
  width: 110px;
  height: 110px;
  top: 65%;
  right: 8%;
  animation-delay: -3s;
}

.shape-3 {
  width: 50px;
  height: 50px;
  top: 85%;
  left: 15%;
  animation-delay: -8s;
}

.shape-4 {
  width: 90px;
  height: 90px;
  top: 8%;
  right: 25%;
  animation-delay: -12s;
}

.shape-5 {
  width: 130px;
  height: 130px;
  top: 45%;
  left: 3%;
  animation-delay: -6s;
}

.shape-6 {
  width: 60px;
  height: 60px;
  top: 25%;
  right: 40%;
  animation-delay: -9s;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }

  50% {
    transform: translateY(-15px) rotate(180deg);
    opacity: 0.3;
  }

  100% {
    transform: translateY(0px) rotate(360deg);
    opacity: 0.7;
  }
}

/* Content Wrapper */
.content-wrapper {
  width: 100%;
  max-width: 420px;
  max-height: calc(100vh - 1rem);
  overflow-y: auto;
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-wrapper.mounted {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Register Card */
.register-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  box-shadow:
    0 25px 50px -12px rgba(255, 154, 158, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.register-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

/* Card Header */
.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.logo-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 30px rgba(255, 154, 158, 0.3);
}

.logo-circle i {
  font-size: 2rem;
  color: white;
  animation: pulse 2s infinite;
}

.logo-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 154, 158, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

@keyframes ripple {
  0% {
    width: 60px;
    height: 60px;
    opacity: 1;
  }

  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  background: linear-gradient(135deg, #1f2937, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  font-weight: 400;
}

/* Form Styles */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-item {
  margin-bottom: 0;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  z-index: 10;
  color: #9ca3af;
  font-size: 1.25rem;
  transition: color 0.3s ease;
}

.input-wrapper:focus-within .input-icon {
  color: #ff9a9e;
}

:deep(.custom-input .el-input__wrapper) {
  padding-left: 3rem;
  padding-right: 3rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

:deep(.custom-input .el-input__wrapper:hover) {
  border-color: #d1d5db;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

:deep(.custom-input .el-input__wrapper.is-focus) {
  border-color: #ff9a9e;
  box-shadow: 0 0 0 3px rgba(255, 154, 158, 0.1);
}

:deep(.custom-input .el-input__inner) {
  font-size: 1rem;
  color: #374151;
  background: transparent;
}

:deep(.custom-input .el-input__inner::placeholder) {
  color: #9ca3af;
  font-weight: 400;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
  z-index: 10;
}

.password-toggle:hover {
  color: #ff9a9e;
  background: rgba(255, 154, 158, 0.1);
}

/* Terms Checkbox */
.terms-checkbox {
  margin: 0.5rem 0;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  user-select: none;
  gap: 0.5rem;
}

.checkbox-container input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkmark::after {
  content: '';
  position: absolute;
  left: 2px;
  top: -1px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) scale(0);
  transition: transform 0.3s ease;
}

.checkbox-container input[type="checkbox"]:checked+.checkmark {
  background: #ff9a9e;
  border-color: #ff9a9e;
}

.checkbox-container input[type="checkbox"]:checked+.checkmark::after {
  transform: rotate(45deg) scale(1);
}

.checkbox-text {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.terms-link {
  color: #ff9a9e;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #ff7875;
  text-decoration: underline;
}

/* Register Button */
:deep(.register-btn) {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.4);
  margin-top: 0.5rem;
}

:deep(.register-btn:hover:not(.is-disabled)) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 154, 158, 0.5);
}

:deep(.register-btn:active) {
  transform: translateY(0);
}

:deep(.register-btn.is-disabled) {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: 0 4px 15px rgba(255, 154, 158, 0.2);
}

:deep(.register-btn::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

:deep(.register-btn:hover::before) {
  left: 100%;
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 1.5rem 0 1rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
}

/* Social Register */
.social-register {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.google-btn {
  color: #dc2626;
  border-color: #fecaca;
}

.google-btn:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}

.facebook-btn {
  color: #2563eb;
  border-color: #bfdbfe;
}

.facebook-btn:hover {
  background: #eff6ff;
  border-color: #93c5fd;
}

/* Login Link */
.login-link {
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.signin-link {
  color: #ff9a9e;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.3s ease;
}

.signin-link:hover {
  color: #ff7875;
  transform: translateX(2px);
}

/* Responsive Design */
@media (max-width: 640px) {
  .register-card {
    padding: 1.5rem 1rem;
    margin: 0.5rem;
    border-radius: 16px;
  }

  .title {
    font-size: 1.25rem;
  }

  .logo-circle {
    width: 50px;
    height: 50px;
  }

  .logo-circle i {
    font-size: 1.5rem;
  }

  .checkbox-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .register-container {
    padding: 0.25rem;
  }

  .register-card {
    padding: 1.25rem 0.75rem;
  }

  .card-header {
    margin-bottom: 1.25rem;
  }

  .content-wrapper {
    max-width: 100%;
  }

  .social-register {
    gap: 0.5rem;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .register-card {
    background: white;
    border: 2px solid #000;
  }

  :deep(.custom-input .el-input__wrapper) {
    background: white;
    border-color: #000;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .floating-shapes {
    display: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .register-card {
    background: rgba(17, 24, 39, 0.95);
    color: white;
  }

  .title {
    background: linear-gradient(135deg, #f9fafb, #d1d5db);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: #9ca3af;
  }

  :deep(.custom-input .el-input__wrapper) {
    background: rgba(31, 41, 55, 0.8);
    border-color: #374151;
    color: white;
  }

  :deep(.custom-input .el-input__inner) {
    color: white;
  }

  .social-btn {
    background: rgba(31, 41, 55, 0.8);
    border-color: #374151;
    color: #d1d5db;
  }

  .checkbox-text {
    color: #d1d5db;
  }
}
</style>