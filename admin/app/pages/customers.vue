<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import { getPaginationRowModel, type Row } from '@tanstack/table-core'
import type { User } from '~/types'
import { useAuth } from '~/composables/useAuth'

const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UBadge = resolveComponent('UBadge')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const table = useTemplateRef('table')
const { token } = useAuth()
const { api } = useApi()

const columnFilters = ref([{ id: 'email', value: '' }])
const columnVisibility = ref()
const rowSelection = ref({})

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

const deleteCustomer = async (id: number) => {
  try {
    await api.delete(`/admin/customers/${id}`)
    toast.add({ title: 'Thành công', description: 'Đã xóa khách hàng', color: 'success' })
    await fetchCustomers()
  } catch (err) {
    toast.add({ title: 'Lỗi', description: 'Không thể xóa khách hàng', color: 'error' })
  }
}

const deleteSelectedCustomers = async () => {
  const selectedRows = table.value?.tableApi?.getFilteredSelectedRowModel().rows || []
  for (const row of selectedRows) {
    await deleteCustomer(row.original.id)
  }
}

const data = computed(() => {
  return (customersData.value?.customers || []).map((customer: Record<string, unknown>) => ({
    id: customer.id as number,
    name: customer.name as string,
    email: customer.email as string,
    avatar: { src: `https://i.pravatar.cc/128?u=${customer.id}` },
    status: (customer.status as string) || 'subscribed',
    location: (customer.location as string) || 'Việt Nam'
  }))
})

function getRowItems(row: Row<User>) {
  return [
    { type: 'label', label: 'Thao tác' },
    { label: 'Sao chép ID', icon: 'i-lucide-copy', onSelect() { navigator.clipboard.writeText(row.original.id.toString()); toast.add({ title: 'Đã sao chép', description: 'ID khách hàng đã được sao chép', color: 'success' }) } },
    { type: 'separator' },
    { label: 'Xem chi tiết', icon: 'i-lucide-list' },
    { label: 'Xem thanh toán', icon: 'i-lucide-wallet' },
    { type: 'separator' },
    { label: 'Xóa khách hàng', icon: 'i-lucide-trash', color: 'red', onSelect() { deleteCustomer(row.original.id) } }
  ]
}

const columns: TableColumn<User>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'model-value': table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
          table.toggleAllPageRowsSelected(!!value),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'model-value': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
        'aria-label': 'Select row'
      })
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => {
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          ...row.original.avatar,
          size: 'lg'
        }),
        h('div', undefined, [
          h('p', { class: 'font-medium text-highlighted' }, row.original.name),
          h('p', { class: '' }, `@${row.original.name}`)
        ])
      ])
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Email',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
  },
  {
    accessorKey: 'location',
    header: 'Địa điểm',
    cell: ({ row }) => row.original.location
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    filterFn: 'equals',
    cell: ({ row }) => {
      const color = {
        subscribed: 'green' as const,
        unsubscribed: 'red' as const,
        bounced: 'yellow' as const
      }[row.original.status]

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        row.original.status
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
  }
]

const statusFilter = ref('all')

watch(() => statusFilter.value, (newVal) => {
  if (!table?.value?.tableApi) return
  const statusColumn = table.value.tableApi.getColumn('status')
  if (!statusColumn) return
  if (newVal === 'all') statusColumn.setFilterValue(undefined)
  else statusColumn.setFilterValue(newVal)
})

const pagination = ref({ pageIndex: 0, pageSize: 10 })
</script>

<template>
  <UDashboardPanel id="customers">
    <template #header>
      <UDashboardNavbar title="Quản lý khách hàng">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <CustomersAddModal /> 
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
        <UInput
          :model-value="(table?.tableApi?.getColumn('email')?.getFilterValue() as string)"
          class="max-w-sm"
          icon="i-lucide-search"
          placeholder="Tìm kiếm theo email..."
          @update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
        />

        <div class="flex flex-wrap items-center gap-1.5">
          <UButton
            v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
            label="Xóa đã chọn"
            color="red"
            variant="subtle"
            icon="i-lucide-trash"
            @click="deleteSelectedCustomers"
          >
            <template #trailing>
              <UKbd>
                {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
              </UKbd>
            </template>
          </UButton>

          <USelect
            v-model="statusFilter"
            :items="[
              { label: 'Tất cả', value: 'all' },
              { label: 'Đã đăng ký', value: 'subscribed' },
              { label: 'Chưa đăng ký', value: 'unsubscribed' },
              { label: 'Bị từ chối', value: 'bounced' }
            ]"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            placeholder="Lọc theo trạng thái"
            class="min-w-28"
          />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => ({
                  label: upperFirst(column.id),
                  type: 'checkbox' as const,
                  checked: column.getIsVisible(),
                  onUpdateChecked(checked: boolean) {
                    table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                  },
                  onSelect(e?: Event) {
                    e?.preventDefault()
                  }
                }))
            "
            :content="{ align: 'end' }"
          >
            <UButton
              label="Hiển thị"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-settings-2"
            />
          </UDropdownMenu>
        </div>
      </div>

      <UTable
        ref="table"
        v-model:column-filters="columnFilters"
        v-model:column-visibility="columnVisibility"
        v-model:row-selection="rowSelection"
        v-model:pagination="pagination"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel()
        }"
        class="shrink-0"
        :data="data"
        :columns="columns"
        :loading="pending"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
          td: 'border-b border-default'
        }"
      />

      <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
        <div class="text-sm text-muted">
          {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} trong số
          {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} hàng được chọn.
        </div>

        <div class="flex items-center gap-1.5">
          <UPagination
            :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
            :total="table?.tableApi?.getFilteredRowModel().rows.length"
            @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>