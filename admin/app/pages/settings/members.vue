<script setup lang="ts">
import { useApi } from '~/composables/useApi'

const { api } = useApi()

const membersData = ref<{ members: Array<Record<string, unknown>> } | null>(null)
const isLoading = ref(false)

const fetchMembers = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/members')
    membersData.value = response.data
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchMembers)

const members = computed(() => membersData.value?.members || [])

const q = ref('')

const filteredMembers = computed(() => {
  if (!members.value || !Array.isArray(members.value)) {
    return []
  }
  
  return members.value.filter((member) => {
    const name = (member.name as string) || ''
    const username = (member.username as string) || ''
    return name.search(new RegExp(q.value, 'i')) !== -1 || username.search(new RegExp(q.value, 'i')) !== -1
  })
})

async function inviteMember(email: string, name: string) {
  try {
    await $fetch(`${apiBase}/members/invite`, {
      method: 'POST',
      body: { email, name },
      headers: { Authorization: `Bearer ${token.value}` }
    })
    await refresh()
  } catch (error) {
    console.error('Error inviting member:', error)
  }
}

async function deleteMember(id: number) {
  try {
    await $fetch(`${apiBase}/members/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    await refresh()
  } catch (error) {
    console.error('Error deleting member:', error)
  }
}
</script>

<template>
  <div>
    <UPageCard
      title="Members"
      description="Invite new members by email address."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Invite people"
        color="neutral"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle" :ui="{ container: 'p-0 sm:p-0 gap-y-0', wrapper: 'items-stretch', header: 'p-4 mb-0 border-b border-default' }">
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search members"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </UPageCard>
  </div>
</template>
