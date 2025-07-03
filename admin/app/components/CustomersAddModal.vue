<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const { api } = useApi()
const customersData = ref<{ customers: Array<Record<string, unknown>> } | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)

const fetchCustomers = async () => {
  pending.value = true
  error.value = null
  try {
    const response = await api.get('/admin/customers')
    customersData.value = response.data
  } catch (err) {
    error.value = (err as Error).message || 'Lỗi khi tải khách hàng'
  } finally {
    pending.value = false
  }
}

onMounted(fetchCustomers)

const isOpen = ref(false)
const loading = ref(false)
const form = ref({
  name: '',
  email: '',
  password: ''
})

const createCustomer = async (payload: { name: string; email: string; password: string }) => {
  loading.value = true
  try {
    await api.post('/admin/customers', payload)
    isOpen.value = false
    loading.value = false
    form.value = { name: '', email: '', password: '' }
    // Hiển thị toast thành công ở đây nếu muốn
  } catch {
    loading.value = false
    // Hiển thị toast lỗi ở đây nếu muốn
  }
}

const handleSubmit = () => {
  createCustomer({ ...form.value })
}
</script>

<template>
  <UModal v-model:open="isOpen" title="Thêm khách hàng">
    <UButton label="Thêm khách hàng" icon="i-lucide-plus" @click="isOpen = true" />
    <template #content>
      <UForm @submit.prevent="handleSubmit">
        <UFormGroup label="Tên" name="name">
          <UInput v-model="form.name" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput v-model="form.email" />
        </UFormGroup>
        <UFormGroup label="Mật khẩu" name="password">
          <UInput v-model="form.password" type="password" />
        </UFormGroup>
        <div class="flex justify-end gap-3 mt-4">
          <UButton color="gray" variant="solid" @click="isOpen = false">
            Hủy
          </UButton>
          <UButton color="primary" :loading="loading" type="submit">
            Tạo mới
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>