export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth()

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated.value && to.path !== '/login' && to.path !== '/register') {
    return navigateTo('/login')
  }

  // If user is authenticated and trying to access login/register
  if (isAuthenticated.value && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/')
  }
}) 