<script setup lang="ts">
const { login, isAuthenticated, token, user } = useAuth()

const testLogin = async () => {
  try {
    const result = await login('admin@example.com', 'password123')
    console.log('Login success:', result)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const testApi = async () => {
  try {
    const response = await $fetch('http://localhost:3001/api/health')
    console.log('Health check:', response)
  } catch (error) {
    console.error('Health check failed:', error)
  }
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">API Test Page</h1>
    
    <div class="space-y-4">
      <div class="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
        <h2 class="text-lg font-semibold mb-2">Auth State</h2>
        <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
        <p><strong>Has Token:</strong> {{ !!token }}</p>
        <p><strong>User:</strong> {{ user ? JSON.stringify(user) : 'null' }}</p>
      </div>

      <div class="space-x-4">
        <UButton @click="testLogin" color="primary">
          Test Login
        </UButton>
        <UButton @click="testApi" color="neutral">
          Test Health API
        </UButton>
      </div>

      <div class="mt-8">
        <UButton to="/" color="primary">
          Go to Dashboard
        </UButton>
      </div>
    </div>
  </div>
</template> 