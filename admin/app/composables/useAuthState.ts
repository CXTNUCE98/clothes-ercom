export const useAuthState = () => {
  const token = useCookie('auth-token')
  const user = useState<Record<string, unknown> | null>('auth-user', () => null)
  const isInitialized = ref(false)
  const isInitializing = ref(false)

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value
  })

  const initializeAuth = async () => {
    // Prevent multiple simultaneous initializations
    if (isInitialized.value || isInitializing.value) return

    isInitializing.value = true

    try {
      if (token.value && !user.value) {
        const response = await $fetch<{ user: Record<string, unknown> }>('http://localhost:3001/api/admin/admin/profile', {
          headers: { Authorization: `Bearer ${token.value}` }
        })
        user.value = response.user
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      // Clear invalid auth state
      token.value = null
      user.value = null
    } finally {
      isInitialized.value = true
      isInitializing.value = false
    }
  }

  const setAuth = (newToken: string, newUser: Record<string, unknown>) => {
    token.value = newToken
    user.value = newUser
    isInitialized.value = true
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    isInitialized.value = false
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    isInitialized: readonly(isInitialized),
    isInitializing: readonly(isInitializing),
    initializeAuth,
    setAuth,
    clearAuth
  }
} 