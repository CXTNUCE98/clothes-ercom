import { useState } from 'nuxt/app'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export const useCartCount = () => {
  const cartCount = useState<number>('cartCount', () => 0)
  const { isAuthenticated } = useAuth()
  const { authFetch } = useApi()

  const fetchCartCount = async () => {
    if (!isAuthenticated.value) {
      cartCount.value = 0
      return
    }
    try {
      const res = await authFetch('/cart') as { items: any[] }
      cartCount.value = res.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
    } catch {
      cartCount.value = 0
    }
  }

  return { cartCount, fetchCartCount }
} 