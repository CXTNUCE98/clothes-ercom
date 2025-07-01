<script setup lang="ts">
import { useAuth, getApiBaseUrl } from '~/composables/useAuth'
const { token } = useAuth()
const apiBase = getApiBaseUrl()

const state = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  product_updates: true,
  weekly_digest: false,
  important_updates: true
})

const sections = [{
  title: 'Notification channels',
  description: 'Where can we notify you?',
  fields: [{
    name: 'email',
    label: 'Email',
    description: 'Receive a daily email digest.'
  }, {
    name: 'desktop',
    label: 'Desktop',
    description: 'Receive desktop notifications.'
  }]
}, {
  title: 'Account updates',
  description: 'Receive updates about Nuxt UI.',
  fields: [{
    name: 'weekly_digest',
    label: 'Weekly digest',
    description: 'Receive a weekly digest of news.'
  }, {
    name: 'product_updates',
    label: 'Product updates',
    description: 'Receive a monthly email with all new features and updates.'
  }, {
    name: 'important_updates',
    label: 'Important updates',
    description: 'Receive emails about important updates like security fixes, maintenance, etc.'
  }]
}]

onMounted(async () => {
  const noti = await $fetch(`${apiBase}/notifications`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })
  Object.assign(state, noti.notifications)
})

async function onChange() {
  await $fetch(`${apiBase}/notifications`, {
    method: 'PUT',
    body: state,
    headers: { Authorization: `Bearer ${token.value}` }
  })
}
</script>

<template>
  <div v-for="(section, index) in sections" :key="index">
    <UPageCard
      :title="section.title"
      :description="section.description"
      variant="naked"
      class="mb-4"
    />

    <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
      <UFormField
        v-for="field in section.fields"
        :key="field.name"
        :name="field.name"
        :label="field.label"
        :description="field.description"
        class="flex items-center justify-between not-last:pb-4 gap-2"
      >
        <USwitch
          v-model="state[field.name]"
          @update:model-value="onChange"
        />
      </UFormField>
    </UPageCard>
  </div>
</template>
