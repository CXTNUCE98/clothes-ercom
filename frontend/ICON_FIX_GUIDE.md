# Hướng dẫn Fix Lỗi Icon - InvalidCharacterError

## Vấn đề
Lỗi `InvalidCharacterError: Failed to execute 'createElement' on 'Document': The tag name provided ('bx bx-user') is not a valid name.`

## Nguyên nhân
Element Plus không thể xử lý Boxicons classes trong thuộc tính `prefix-icon`. Element Plus cố gắng tạo một element với tên `'bx bx-user'` thay vì hiểu đó là CSS classes.

## Giải pháp

### 1. Thay thế prefix-icon bằng icon elements

**Trước (gây lỗi):**
```vue
<el-input
  v-model="form.email"
  prefix-icon="bx bx-envelope"
  placeholder="Email"
/>
```

**Sau (đã fix):**
```vue
<div class="relative">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <i class="bx bx-envelope text-gray-400"></i>
  </div>
  <el-input
    v-model="form.email"
    placeholder="Email"
    class="pl-10"
  />
</div>
```

### 2. Sử dụng CSS classes

Thêm class `pl-10` (padding-left) để tạo khoảng trống cho icon.

### 3. Các components đã được fix

- ✅ `pages/login.vue` - Form đăng nhập
- ✅ `pages/register.vue` - Form đăng ký
- ✅ `components/ProductCard.vue` - Card sản phẩm

### 4. CSS Custom Styles

File `assets/css/inputs.css` đã được tạo với các styles:
- Styling cho input fields với icons
- Boxicons styling
- Element Plus input adjustments

### 5. Cách sử dụng ElMessage

**Trước (gây lỗi):**
```typescript
ElMessage.success('Thành công')
```

**Sau (đã fix):**
```typescript
const { $ElMessage } = useNuxtApp()
$ElMessage.success('Thành công')
```

## Setup hoàn chỉnh

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

## Lưu ý

- Tất cả các icon inputs đã được chuyển sang sử dụng `<i>` elements
- ElMessage được sử dụng thông qua `useNuxtApp()`
- CSS custom styles đã được thêm vào project
- Không còn sử dụng `prefix-icon` với Boxicons classes

## Testing

Sau khi fix, test các chức năng:
1. Form đăng nhập/đăng ký
2. Thêm sản phẩm vào giỏ hàng
3. Các thông báo ElMessage
4. Icon hiển thị đúng trong inputs 