# Troubleshooting Guide - Frontend

## Lỗi TypeScript thường gặp

### 1. Lỗi "Cannot find name 'useAuth', 'useApi', etc."

Đây là lỗi do TypeScript chưa nhận diện được các composables của Nuxt. Để fix:

1. Chạy lệnh để generate types:
```bash
npm run dev
```

2. Hoặc chạy:
```bash
npx nuxi prepare
```

### 2. Lỗi "$fetch" initialization

Đã được fix trong `composables/useApi.ts` bằng cách đổi tên biến.

### 3. Lỗi Element Plus

Để sử dụng ElMessage trong components, thay vì dùng `ElMessage` trực tiếp, hãy sử dụng:

```typescript
// Thay vì:
ElMessage.success('Thành công')

// Sử dụng:
const { $ElMessage } = useNuxtApp()
$ElMessage.success('Thành công')
```

Hoặc tạo composable:

```typescript
// composables/useMessage.ts
export const useMessage = () => {
  const { $ElMessage } = useNuxtApp()
  return {
    success: (msg: string) => $ElMessage.success(msg),
    error: (msg: string) => $ElMessage.error(msg),
    warning: (msg: string) => $ElMessage.warning(msg)
  }
}

// Trong component:
const { success, error } = useMessage()
success('Thành công')
```

### 4. Lỗi v-model với Element Plus

Thay vì:
```vue
<el-pagination v-model:current-page="currentPage" />
```

Sử dụng:
```vue
<el-pagination :current-page="currentPage" @current-change="currentPage = $event" />
```

### 5. Setup hoàn chỉnh

1. Cài đặt dependencies:
```bash
npm install
```

2. Generate types:
```bash
npx nuxi prepare
```

3. Chạy development server:
```bash
npm run dev
```

## Cấu trúc file đã được tạo

- `composables/useApi.ts` - API calls
- `composables/useAuth.ts` - Authentication
- `composables/useMessage.ts` - Message notifications
- `plugins/element-plus.client.ts` - Element Plus plugin
- `types/global.d.ts` - Global type definitions

## Lưu ý

- Tất cả các composables sẽ tự động được import khi sử dụng
- Element Plus components sẽ tự động được register
- TypeScript sẽ tự động generate types sau khi chạy `npm run dev` 