<script setup lang="ts">
import { useAuth, getApiBaseUrl } from '~/composables/useAuth'

const { token } = useAuth()
const apiBase = getApiBaseUrl()
const toast = useToast()

const changePasswordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const twoFactorForm = reactive({
  enabled: false,
  backupCodes: [] as string[]
})

const sessions = ref<Array<Record<string, unknown>>>([])
const loading = ref(false)

onMounted(async () => {
  try {
    // Fetch security settings
    const [securityResponse, sessionsResponse] = await Promise.all([
      $fetch<{ twoFactor: Record<string, unknown> }>(`${apiBase}/admin/security`, {
        headers: { Authorization: `Bearer ${token.value}` }
      }),
      $fetch<{ sessions: Array<Record<string, unknown>> }>(`${apiBase}/admin/sessions`, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
    ])

    if (securityResponse.twoFactor) {
      Object.assign(twoFactorForm, securityResponse.twoFactor)
    }
    if (sessionsResponse.sessions) {
      sessions.value = sessionsResponse.sessions
    }
  } catch (error) {
    console.error('Error fetching security settings:', error)
  }
})

const changePassword = async () => {
  if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
    toast.add({ title: 'Mật khẩu không khớp', color: 'error' })
    return
  }

  if (changePasswordForm.newPassword.length < 6) {
    toast.add({ title: 'Mật khẩu phải có ít nhất 6 ký tự', color: 'error' })
    return
  }

  try {
    loading.value = true
    await $fetch(`${apiBase}/admin/change-password`, {
      method: 'POST',
      body: {
        currentPassword: changePasswordForm.currentPassword,
        newPassword: changePasswordForm.newPassword
      },
      headers: { Authorization: `Bearer ${token.value}` }
    })

    toast.add({ title: 'Đã thay đổi mật khẩu', color: 'success' })
    
    // Reset form
    changePasswordForm.currentPassword = ''
    changePasswordForm.newPassword = ''
    changePasswordForm.confirmPassword = ''
  } catch (error) {
    console.error('Error changing password:', error)
    toast.add({ title: 'Lỗi thay đổi mật khẩu', color: 'error' })
  } finally {
    loading.value = false
  }
}

const toggleTwoFactor = async () => {
  try {
    loading.value = true
    const response = await $fetch<{ backupCodes: string[] }>(`${apiBase}/admin/two-factor`, {
      method: 'POST',
      body: { enabled: !twoFactorForm.enabled },
      headers: { Authorization: `Bearer ${token.value}` }
    })

    twoFactorForm.enabled = !twoFactorForm.enabled
    if (response.backupCodes) {
      twoFactorForm.backupCodes = response.backupCodes
    }

    toast.add({ 
      title: twoFactorForm.enabled ? 'Đã bật 2FA' : 'Đã tắt 2FA', 
      color: 'success' 
    })
  } catch (error) {
    console.error('Error toggling 2FA:', error)
    toast.add({ title: 'Lỗi cài đặt 2FA', color: 'error' })
  } finally {
    loading.value = false
  }
}

const revokeSession = async (sessionId: string) => {
  try {
    await $fetch(`${apiBase}/admin/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })

    sessions.value = sessions.value.filter((session: any) => session.id !== sessionId)
    toast.add({ title: 'Đã thu hồi phiên đăng nhập', color: 'success' })
  } catch (error) {
    console.error('Error revoking session:', error)
    toast.add({ title: 'Lỗi thu hồi phiên', color: 'error' })
  }
}
</script>

<template>
  <div>
    <UPageCard
      title="Security"
      description="Manage your account security and privacy settings."
      variant="naked"
      class="mb-4"
    />

    <div class="space-y-6">
      <!-- Change Password -->
      <UPageCard variant="subtle">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="i-lucide-lock text-lg"></i>
            <h3 class="text-lg font-semibold">Change Password</h3>
          </div>
        </template>

        <form @submit.prevent="changePassword" class="space-y-4">
          <UFormField
            name="currentPassword"
            label="Current Password"
            required
          >
            <UInput
              v-model="changePasswordForm.currentPassword"
              type="password"
              placeholder="Enter current password"
              autocomplete="current-password"
            />
          </UFormField>

          <UFormField
            name="newPassword"
            label="New Password"
            required
          >
            <UInput
              v-model="changePasswordForm.newPassword"
              type="password"
              placeholder="Enter new password"
              autocomplete="new-password"
            />
          </UFormField>

          <UFormField
            name="confirmPassword"
            label="Confirm New Password"
            required
          >
            <UInput
              v-model="changePasswordForm.confirmPassword"
              type="password"
              placeholder="Confirm new password"
              autocomplete="new-password"
            />
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            :loading="loading"
            class="w-fit"
          >
            Change Password
          </UButton>
        </form>
      </UPageCard>

      <!-- Two-Factor Authentication -->
      <UPageCard variant="subtle">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="i-lucide-shield text-lg"></i>
            <h3 class="text-lg font-semibold">Two-Factor Authentication</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">Enable 2FA</p>
              <p class="text-sm text-muted">Add an extra layer of security to your account.</p>
            </div>
            <UToggle v-model="twoFactorForm.enabled" @update:model-value="toggleTwoFactor" />
          </div>

          <div v-if="twoFactorForm.backupCodes.length > 0" class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div class="flex items-center gap-2 mb-2">
              <i class="i-lucide-alert-triangle text-amber-600 dark:text-amber-400"></i>
              <span class="text-sm font-medium text-amber-800 dark:text-amber-200">Backup Codes</span>
            </div>
            <p class="text-sm text-amber-700 dark:text-amber-300 mb-3">
              Save these backup codes in a secure place. You can use them to access your account if you lose your 2FA device.
            </p>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="code in twoFactorForm.backupCodes"
                :key="code"
                class="font-mono text-sm bg-white dark:bg-gray-800 p-2 rounded border text-center"
              >
                {{ code }}
              </div>
            </div>
          </div>
        </div>
      </UPageCard>

      <!-- Active Sessions -->
      <UPageCard variant="subtle">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="i-lucide-monitor text-lg"></i>
            <h3 class="text-lg font-semibold">Active Sessions</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="session in sessions"
            :key="session.id"
            class="flex items-center justify-between p-4 border rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <i class="i-lucide-monitor text-gray-600 dark:text-gray-400"></i>
              </div>
              <div>
                <p class="font-medium">{{ session.device || 'Unknown Device' }}</p>
                <p class="text-sm text-muted">
                  {{ session.location || 'Unknown Location' }} • 
                  {{ session.lastActive ? new Date(session.lastActive).toLocaleDateString() : 'Unknown' }}
                </p>
              </div>
            </div>
            <UButton
              v-if="!session.current"
              color="red"
              variant="ghost"
              size="sm"
              @click="revokeSession(session.id)"
            >
              Revoke
            </UButton>
            <UBadge v-else color="green" variant="subtle">
              Current
            </UBadge>
          </div>

          <div v-if="sessions.length === 0" class="text-center py-8 text-muted">
            <i class="i-lucide-monitor text-4xl mb-2"></i>
            <p>No active sessions found</p>
          </div>
        </div>
      </UPageCard>
    </div>
  </div>
</template>
