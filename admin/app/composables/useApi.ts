import axios from 'axios'
import { useAuth, getApiBaseUrl } from './useAuth'

export const useApi = () => {
  const { token } = useAuth()
  const apiBase = getApiBaseUrl()

  const api = axios.create({
    baseURL: apiBase,
    headers: { 'Content-Type': 'application/json' }
  })

  api.interceptors.request.use((config) => {
    if (token.value) config.headers.Authorization = `Bearer ${token.value}`
    return config
  })

  return { api }
} 