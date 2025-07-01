import { ref } from 'vue'

export function useAuth() {
  // Lấy token từ localStorage (hoặc có thể lấy từ cookie/session tùy dự án)
  const token = ref<string>('')
  if (typeof window !== 'undefined') {
    token.value = localStorage.getItem('token') || ''
  }
  return { token }
}

export function getApiBaseUrl() {
  return 'http://localhost:3001/api/admin'
} 