interface User {
  id: number
  email: string
  name: string
  role: string
}

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  email: string
  password: string
  name: string
}

export const useAuth = () => {
  const user = useState<User | null>('user', () => null)
  const token = useCookie('token')
  const { $fetch, authFetch } = useApi()

  const login = async (data: LoginData) => {
    try {
      const response = await $fetch('/auth/login', {
        method: 'POST',
        body: data
      })
      
      token.value = response.token
      user.value = response.user
      
      return { success: true, data: response }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Đăng nhập thất bại' }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await $fetch('/auth/register', {
        method: 'POST',
        body: data
      })
      
      token.value = response.token
      user.value = response.user
      
      return { success: true, data: response }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Đăng ký thất bại' }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  const checkAuth = async () => {
    if (!token.value) return false
    
    try {
      const response = await authFetch('/auth/profile')
      user.value = response.user
      return true
    } catch (error) {
      token.value = null
      user.value = null
      return false
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user: readonly(user),
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated
  }
} 