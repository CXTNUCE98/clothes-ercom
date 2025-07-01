<script setup lang="ts">
import { ref, watch, computed, onMounted, reactive } from 'vue'
import type { User } from '~/types'
import { useAuth } from '~/composables/useAuth'
import {
  ElTable,
  ElTableColumn,
  ElButton,
  ElInput,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElForm,
  ElFormItem,
  ElMessage,
  ElTag,
  ElAvatar,
  ElPagination,
  ElContainer,
  ElHeader,
  ElMain,
  ElSpace,
  ElRow,
  ElCol,
  ElCard,
  ElPopconfirm
} from 'element-plus'

const { token } = useAuth()

// Reactive data
const tableData = ref<User[]>([])
const loading = ref(false)
const selectedRows = ref<User[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchEmail = ref('')
const statusFilter = ref('all')

// Modal states
const showCreate = ref(false)
const newCustomer = reactive({
  name: '',
  email: '',
  password: ''
})

// Fetch customers
const fetchCustomers = async () => {
  loading.value = true
  try {
    const response = await $fetch('http://localhost:3001/api/admin/customers', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    const data = (response as any).customers || []
    tableData.value = data
    total.value = data.length
  } catch (error) {
    ElMessage.error('Không thể tải danh sách khách hàng')
  } finally {
    loading.value = false
  }
}

// Delete customer
const deleteCustomer = async (id: number) => {
  try {
    await $fetch(`http://localhost:3001/api/admin/customers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    ElMessage.success('Đã xóa khách hàng')
    await fetchCustomers()
  } catch (error) {
    ElMessage.error('Không thể xóa khách hàng')
  }
}

// Create customer
const createCustomer = async () => {
  try {
    await $fetch('http://localhost:3001/api/admin/customers', {
      method: 'POST',
      body: newCustomer,
      headers: { Authorization: `Bearer ${token.value}` }
    })
    ElMessage.success('Tạo khách hàng thành công')
    showCreate.value = false
    newCustomer.name = ''
    newCustomer.email = ''
    newCustomer.password = ''
    await fetchCustomers()
  } catch (err: any) {
    ElMessage.error(err?.data?.error || 'Không thể tạo khách hàng')
  }
}

// Copy to clipboard
const copyToClipboard = (text: string, message: string) => {
  navigator.clipboard.writeText(text)
  ElMessage.success(message)
}

// Handle selection change
const handleSelectionChange = (selection: User[]) => {
  selectedRows.value = selection
}

// Delete selected customers
const deleteSelectedCustomers = async () => {
  try {
    for (const customer of selectedRows.value) {
      await deleteCustomer(customer.id)
    }
    selectedRows.value = []
  } catch (error) {
    ElMessage.error('Không thể xóa các khách hàng đã chọn')
  }
}

// Computed filtered data
const filteredData = computed(() => {
  let filtered = tableData.value

  // Filter by email
  if (searchEmail.value) {
    filtered = filtered.filter(item =>
      item.email.toLowerCase().includes(searchEmail.value.toLowerCase())
    )
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter.value)
  }

  return filtered
})

// Paginated data
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// Status options
const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đã đăng ký', value: 'subscribed' },
  { label: 'Chưa đăng ký', value: 'unsubscribed' },
  { label: 'Bị từ chối', value: 'bounced' }
]

// Status tag type mapping
const getStatusType = (status: string) => {
  const typeMap: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
    subscribed: 'success',
    unsubscribed: 'danger',
    bounced: 'warning'
  }
  return (typeMap[status] as 'success' | 'primary' | 'warning' | 'info' | 'danger') || 'info'
}

// Dropdown menu items
const getDropdownItems = (row: User) => [
  {
    label: 'Sao chép ID',
    icon: 'bx bx-copy',
    action: () => copyToClipboard(row.id.toString(), 'Đã sao chép ID khách hàng')
  },
  {
    label: 'Xem chi tiết',
    icon: 'bx bx-show',
    action: () => console.log('View details', row.id)
  },
  {
    label: 'Xem thanh toán',
    icon: 'bx bx-wallet',
    action: () => console.log('View payments', row.id)
  },
  {
    label: 'Xóa khách hàng',
    icon: 'bx bx-trash',
    action: () => deleteCustomer(row.id),
    danger: true
  }
]

// Initialize data
onMounted(() => {
  fetchCustomers()
})

// Watch for search changes
watch([searchEmail, statusFilter], () => {
  currentPage.value = 1
})
</script>

<template>
  <ElContainer class="customers-container">
    <!-- Header -->
    <ElHeader class="header">
      <ElRow justify="space-between" align="middle">
        <ElCol :span="12">
          <h1 class="title">Quản lý khách hàng</h1>
        </ElCol>
        <ElCol :span="12" class="text-right">
          <ElButton type="primary" @click="showCreate = true">
            <i class="bx bx-plus"></i>
            Tạo khách hàng mới
          </ElButton>
        </ElCol>
      </ElRow>
    </ElHeader>

    <!-- Main Content -->
    <ElMain>
      <ElCard shadow="never" class="table-card">
        <!-- Filters and Actions -->
        <template #header>
          <ElRow justify="space-between" align="middle" :gutter="16">
            <ElCol :span="8">
              <ElInput v-model="searchEmail" placeholder="Tìm kiếm theo email..." clearable>
                <template #prefix>
                  <i class="bx bx-search"></i>
                </template>
              </ElInput>
            </ElCol>
            <ElCol :span="16" class="text-right">
              <ElSpace>
                <!-- Delete selected button -->
                <ElPopconfirm v-if="selectedRows.length > 0" title="Bạn có chắc chắn muốn xóa các khách hàng đã chọn?"
                  confirm-button-text="Xóa" cancel-button-text="Hủy" confirm-button-type="danger"
                  @confirm="deleteSelectedCustomers">
                  <template #reference>
                    <ElButton type="danger" plain>
                      <i class="bx bx-trash"></i>
                      Xóa đã chọn ({{ selectedRows.length }})
                    </ElButton>
                  </template>
                </ElPopconfirm>

                <!-- Status filter -->
                <ElSelect v-model="statusFilter" placeholder="Lọc theo trạng thái" style="width: 180px">
                  <ElOption v-for="option in statusOptions" :key="option.value" :label="option.label"
                    :value="option.value" />
                </ElSelect>
              </ElSpace>
            </ElCol>
          </ElRow>
        </template>

        <!-- Table -->
        <ElTable :data="paginatedData" v-loading="loading" @selection-change="handleSelectionChange" stripe border>
          <!-- Selection column -->
          <ElTableColumn type="selection" width="55" />

          <!-- ID column -->
          <ElTableColumn prop="id" label="ID" width="80" />

          <!-- Name column with avatar -->
          <ElTableColumn label="Tên" min-width="200">
            <template #default="{ row }">
              <div class="name-cell">
                <ElAvatar :src="row?.avatar?.src" :size="40" class="avatar">
                  {{ row?.name.charAt(0).toUpperCase() }}
                </ElAvatar>
                <div class="name-info">
                  <div class="name">{{ row?.name }}</div>
                  <div class="username">@{{ row?.name }}</div>
                </div>
              </div>
            </template>
          </ElTableColumn>

          <!-- Email column -->
          <ElTableColumn prop="email" label="Email" min-width="200" sortable />

          <!-- Location column -->
          <ElTableColumn prop="location" label="Địa điểm" min-width="150" />

          <!-- Status column -->
          <ElTableColumn label="Trạng thái" width="120">
            <template #default="{ row }">
              <ElTag :type="getStatusType(row?.status)" size="small" class="status-tag">
                {{ row?.status }}
              </ElTag>
            </template>
          </ElTableColumn>

          <!-- Actions column -->
          <ElTableColumn label="Thao tác" width="80" fixed="right">
            <template #default="{ row }">
              <ElDropdown trigger="click" placement="bottom-end">
                <ElButton text type="primary" circle>
                  <i class="bx bx-dots-vertical-rounded"></i>
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem v-for="item in getDropdownItems(row)" :key="item.label" :class="{ 'danger-item': item.danger }" @click="item.action">
                      <i :class="item.icon"></i>
                      {{ item.label }}
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </template>
          </ElTableColumn>
        </ElTable>

        <!-- Pagination -->
        <template #footer>
          <ElRow justify="space-between" align="middle" class="pagination-row">
            <ElCol>
              <span class="selection-info">
                Đã chọn {{ selectedRows.length }} / {{ filteredData.length }} hàng
              </span>
            </ElCol>
            <ElCol>
              <ElPagination v-model="currentPage" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]" :total="filteredData.length"
                layout="total, sizes, prev, pager, next, jumper" background />
            </ElCol>
          </ElRow>
        </template>
      </ElCard>
    </ElMain>

    <!-- Create Customer Dialog -->
    <ElDialog v-model="showCreate" title="Tạo khách hàng mới" width="450px" :close-on-click-modal="false">
      <ElForm :model="newCustomer" label-width="100px" @submit.prevent="createCustomer" ref="createFormRef">
        <ElFormItem label="Tên" prop="name"
          :rules="[{ required: true, message: 'Vui lòng nhập tên', trigger: 'blur' }]">
          <ElInput v-model="newCustomer.name" autocomplete="off" placeholder="Nhập tên khách hàng" />
        </ElFormItem>

        <ElFormItem label="Email" prop="email" :rules="[
          { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
          { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
        ]">
          <ElInput v-model="newCustomer.email" autocomplete="off" placeholder="Nhập email" />
        </ElFormItem>

        <ElFormItem label="Mật khẩu" prop="password"
          :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }]">
          <ElInput v-model="newCustomer.password" type="password" autocomplete="off" placeholder="Nhập mật khẩu"
            show-password />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <ElSpace>
          <ElButton @click="showCreate = false">Hủy</ElButton>
          <ElButton type="primary" @click="createCustomer">Tạo mới</ElButton>
        </ElSpace>
      </template>
    </ElDialog>
  </ElContainer>
</template>

<style scoped>
.customers-container {
  height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 24px;
}

.title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.table-card {
  margin: 24px;
  border-radius: 8px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  flex-shrink: 0;
}

.name-info {
  flex: 1;
}

.name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 2px;
}

.username {
  font-size: 12px;
  color: #909399;
}

.status-tag {
  text-transform: capitalize;
}

.pagination-row {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

.selection-info {
  font-size: 14px;
  color: #606266;
}

.danger-item {
  color: #f56c6c;
}

.danger-item:hover {
  background-color: #fef0f0;
  color: #f56c6c;
}

:deep(.el-table) {
  border-radius: 6px;
}

:deep(.el-table__header) {
  background-color: #fafafa;
}

:deep(.el-dropdown-menu__item.danger-item) {
  color: #f56c6c;
}

:deep(.el-dropdown-menu__item.danger-item:hover) {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>