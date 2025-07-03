import { ref, computed, onMounted } from 'vue'
import { useAuthState } from '../composables/useAuthState'

export const useAuth = () => {
  const { token, user, isAuthenticated, isInitialized, isInitializing, setAuth, clearAuth, initializeAuth } = useAuthState()

  const login = async (email: string, password: string) => {
    const response = await $fetch<{ token: string; user: Record<string, unknown> }>('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })

    setAuth(response.token, response.user)
    return response
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await $fetch<{ token: string; user: Record<string, unknown> }>('http://localhost:3001/api/auth/register', {
      method: 'POST',
      body: { name, email, password }
    })

    setAuth(response.token, response.user)
    return response
  }

  const logout = () => {
    clearAuth()
  }

  const fetchUser = async () => {
    if (!token.value) return null

    try {
      const response = await $fetch<{ user: Record<string, unknown> }>('http://localhost:3001/api/admin/admin/profile', {
        headers: { Authorization: `Bearer ${token.value}` }
      })
      return response.user
    } catch (error) {
      console.error('Error fetching user:', error)
      clearAuth()
      return null
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isInitialized,
    isInitializing,
    login,
    register,
    logout,
    fetchUser,
    initializeAuth
  }
}

export const getApiBaseUrl = () => {
  return 'http://localhost:3001/api'
} 