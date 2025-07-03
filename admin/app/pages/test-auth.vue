<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthDebug } from '~/composables/useAuthDebug'

const { token, user, isAuthenticated, login, logout } = useAuth()
const { debugInfo, logAuthState } = useAuthDebug()

const testLogin = async () => {
  try {
    await login('admin@example.com', 'password123')
    logAuthState()
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const testLogout = () => {
  logout()
  logAuthState()
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">🔐 Authentication Test</h1>
    
    <!-- Debug Info -->
    <div class="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">Debug Info</h2>
      <pre class="text-sm">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>

    <!-- Token Info -->
    <div class="mb-6 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">Token Info</h2>
      <p><strong>Has Token:</strong> {{ !!token }}</p>
      <p><strong>Token Value:</strong> {{ token ? `${token.substring(0, 50)}...` : 'null' }}</p>
    </div>

    <!-- User Info -->
    <div class="mb-6 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">User Info</h2>
      <p><strong>Has User:</strong> {{ !!user }}</p>
      <p><strong>User Data:</strong> {{ user ? JSON.stringify(user, null, 2) : 'null' }}</p>
    </div>

    <!-- Auth Status -->
    <div class="mb-6 p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">Auth Status</h2>
      <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
    </div>

    <!-- Test Buttons -->
    <div class="space-x-4">
      <UButton @click="testLogin" color="primary">
        Test Login
      </UButton>
      <UButton @click="testLogout" color="error">
        Test Logout
      </UButton>
      <UButton @click="logAuthState" color="neutral">
        Log Auth State
      </UButton>
    </div>

    <!-- Navigation -->
    <div class="mt-8 space-x-4">
      <UButton to="/" color="primary">
        Go to Dashboard
      </UButton>
      <UButton to="/login" color="neutral">
        Go to Login
      </UButton>
      <UButton to="/register" color="neutral">
        Go to Register
      </UButton>
    </div>
  </div>
</template> 