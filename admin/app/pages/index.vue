<script setup lang="ts">
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Period, Range } from '~/types'
import { useAuthDebug } from '~/composables/useAuthDebug'

const { isNotificationsSlideoverOpen } = useDashboard()
const { debugInfo, logAuthState } = useAuthDebug()

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

// Log auth state on mount
onMounted(() => {
  logAuthState()
})
</script>

<template>
  <div>
    <!-- Debug Info (remove in production) -->
    <div class="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">🔐 Debug Info</h3>
      <pre class="text-xs text-yellow-700 dark:text-yellow-300">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
    </div>

    <UDashboardPanel id="home">
      <template #header>
        <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <template #right>
            <UTooltip text="Notifications" :shortcuts="['N']">
              <UButton
                color="neutral"
                variant="ghost"
                square
                @click="isNotificationsSlideoverOpen = true"
              >
                <UChip color="error" inset>
                  <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
                </UChip>
              </UButton>
            </UTooltip>

            <UDropdownMenu :items="items">
              <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>

        <UDashboardToolbar>
          <template #left>
            <!-- NOTE: The `-ms-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
            <HomeDateRangePicker v-model="range" class="-ms-1" />

            <HomePeriodSelect v-model="period" :range="range" />
          </template>
        </UDashboardToolbar>
      </template>

      <template #body>
        <HomeStats :period="period" :range="range" />
        <HomeChart :period="period" :range="range" />
        <HomeSales :period="period" :range="range" />
      </template>
    </UDashboardPanel>
  </div>
</template>
