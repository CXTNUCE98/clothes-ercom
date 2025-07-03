export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, initializeAuth, isInitialized } = useAuth()

  // Initialize auth state if needed
  await initializeAuth()

  // Wait for initialization to complete
  if (!isInitialized.value) {
    // Wait a bit more for initialization
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Skip middleware for login and register pages
  if (to.path === '/login' || to.path === '/register') {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated.value) {
      return navigateTo('/')
    }
    return
  }

  // If user is not authenticated and trying to access any other page
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
}) 