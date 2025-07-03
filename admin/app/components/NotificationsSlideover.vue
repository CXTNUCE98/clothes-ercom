<script setup lang="ts">
import { formatTimeAgo } from '@vueuse/core'
import { useApi } from '~/composables/useApi'

const { isNotificationsSlideoverOpen } = useDashboard()
const { api } = useApi()

const notificationsData = ref<{ notifications: Array<Record<string, unknown>> } | null>(null)
const isLoading = ref(false)

const fetchNotifications = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/notifications')
    notificationsData.value = response.data
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchNotifications)

const notifications = computed(() => notificationsData.value?.notifications || [])
</script>

<template>
  <USlideover
    v-model:open="isNotificationsSlideoverOpen"
    title="Notifications"
  >
    <template #body>
      <NuxtLink
        v-for="notification in notifications"
        :key="notification.id"
        :to="`/inbox?id=${notification.id}`"
        class="px-3 py-2.5 rounded-md hover:bg-elevated/50 flex items-center gap-3 relative -mx-3 first:-mt-3 last:-mb-3"
      >
        <UChip
          color="error"
          :show="!!notification.unread"
          inset
        >
          <UAvatar
            v-bind="notification.sender.avatar"
            :alt="notification.sender.name"
            size="md"
          />
        </UChip>

        <div class="text-sm flex-1">
          <p class="flex items-center justify-between">
            <span class="text-highlighted font-medium">{{ notification.sender.name }}</span>

            <time
              :datetime="notification.date"
              class="text-muted text-xs"
              v-text="formatTimeAgo(new Date(notification.date))"
            />
          </p>

          <p class="text-dimmed">
            {{ notification.body }}
          </p>
        </div>
      </NuxtLink>
    </template>
  </USlideover>
</template>
