export const useAuthDebug = () => {
  const { token, user, isAuthenticated } = useAuth()

  const debugInfo = computed(() => ({
    hasToken: !!token.value,
    tokenValue: token.value ? `${token.value.substring(0, 20)}...` : 'null',
    hasUser: !!user.value,
    userInfo: user.value ? {
      name: user.value.name,
      email: user.value.email
    } : null,
    isAuthenticated: isAuthenticated.value
  }))

  const logAuthState = () => {
    console.log('🔐 Auth Debug Info:', debugInfo.value)
  }

  return {
    debugInfo,
    logAuthState
  }
} 