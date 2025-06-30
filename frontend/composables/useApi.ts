export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const apiFetch = $fetch.create({
    baseURL: apiBase,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const authFetch = $fetch.create({
    baseURL: apiBase,
    headers: {
      'Content-Type': 'application/json'
    },
    onRequest({ request, options }) {
      const token = useCookie('token').value
      if (token) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        } as any
      }
    }
  })

  return {
    $fetch: apiFetch,
    authFetch
  }
} 