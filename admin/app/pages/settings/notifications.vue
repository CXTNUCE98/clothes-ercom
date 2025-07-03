<script setup lang="ts">
import { useAuth, getApiBaseUrl } from '~/composables/useAuth'
const { token } = useAuth()
const apiBase = getApiBaseUrl()
const toast = useToast()

const notifications = reactive({
  email: {
    marketing: true,
    security: true,
    updates: false,
    orders: true
  },
  push: {
    marketing: false,
    security: true,
    updates: true,
    orders: true
  },
  sms: {
    security: true,
    orders: false
  }
})

const loading = ref(false)

onMounted(async () => {
  try {
    const response = await $fetch<{ notifications: Record<string, unknown> }>(`${apiBase}/admin/notifications`, {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (response.notifications) {
      Object.assign(notifications, response.notifications)
    }
  } catch (error) {
    console.error('Error fetching notifications settings:', error)
  }
})

const saveSettings = async () => {
  try {
    loading.value = true
    await $fetch(`${apiBase}/admin/notifications`, {
      method: 'PUT',
      body: notifications,
      headers: { Authorization: `Bearer ${token.value}` }
    })
    toast.add({ title: 'Đã lưu cài đặt thông báo', color: 'success' })
  } catch (error) {
    console.error('Error saving notifications settings:', error)
    toast.add({ title: 'Lỗi lưu cài đặt', color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <UPageCard
      title="Notifications"
      description="Configure how you receive notifications."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Save changes"
        color="neutral"
        :loading="loading"
        @click="saveSettings"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <div class="space-y-6">
      <!-- Email Notifications -->
      <UPageCard variant="subtle">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="i-lucide-mail text-lg"></i>
            <h3 class="text-lg font-semibold">Email Notifications</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Marketing emails</p>
              <p class="text-sm text-muted">Receive emails about new products and features.</p>
            </div>
            <UToggle v-model="notifications.email.marketing" />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Security alerts</p>
              <p class="text-sm text-muted">Get notified about account security events.</p>
            </div>
            <UToggle v-model="notifications.email.security" />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Product updates</p>
              <p class="text-sm text-muted">Receive updates about new features and improvements.</p>
            </div>
            <UToggle v-model="notifications.email.updates" />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Order notifications</p>
              <p class="text-sm text-muted">Get emails about order status changes.</p>
            </div>
            <UToggle v-model="notifications.email.orders" />
          </div>
        </div>
      </UPageCard>

      <!-- Push Notifications -->
      <UPageCard variant="subtle">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="i-lucide-bell text-lg"></i>
            <h3 class="text-lg font-semibold">Push Notifications</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Marketing notifications</p>
              <p class="text-sm text-muted">Receive push notifications about promotions.</p>
            </div>
            <UToggle v-model="notifications.push.marketing" />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Security alerts</p>
              <p class="text-sm text-muted">Get notified about security events.</p>
            </div>
            <UToggle v-model="notifications.push.security" />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Product updates</p>
              <p class="text-sm text-muted">Receive updates about new features.</p>
            </div>
            <UToggle v-model="notifications.push.updates" />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Order notifications</p>
              <p class="text-sm text-muted">Get push notifications about orders.</p>
            </div>
            <UToggle v-model="notifications.push.orders" />
          </div>
        </div>
      </UPageCard>

      <!-- SMS Notifications -->
      <UPageCard variant="subtle">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="i-lucide-message-circle text-lg"></i>
            <h3 class="text-lg font-semibold">SMS Notifications</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Security alerts</p>
              <p class="text-sm text-muted">Receive SMS for critical security events.</p>
            </div>
            <UToggle v-model="notifications.sms.security" />
          </div>

          <USeparator />

          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Order notifications</p>
              <p class="text-sm text-muted">Get SMS about important order updates.</p>
            </div>
            <UToggle v-model="notifications.sms.orders" />
          </div>
        </div>
      </UPageCard>
    </div>
  </div>
</template>
