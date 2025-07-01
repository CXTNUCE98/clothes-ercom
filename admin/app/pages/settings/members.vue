<script setup lang="ts">
import type { Member } from '~/types'
import { useAuth, getApiBaseUrl } from '~/composables/useAuth'

const { token } = useAuth()
const apiBase = getApiBaseUrl()

const fetchMembers = async () => {
  return await $fetch(`${apiBase}/members`, {
    headers: { Authorization: `Bearer ${token.value}` }
  })
}
const { data: members, refresh } = useAsyncData('members', fetchMembers)

const q = ref('')

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return member.name.search(new RegExp(q.value, 'i')) !== -1 || member.username.search(new RegExp(q.value, 'i')) !== -1
  })
})

async function inviteMember(email: string, name: string) {
  await $fetch(`${apiBase}/members/invite`, {
    method: 'POST',
    body: { email, name },
    headers: { Authorization: `Bearer ${token.value}` }
  })
  refresh()
}

async function deleteMember(id: number) {
  await $fetch(`${apiBase}/members/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token.value}` }
  })
  refresh()
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
