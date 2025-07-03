# Admin Dashboard - Hệ thống Authentication

## Tính năng đã hoàn thiện

### 1. Authentication System
- ✅ **Đăng nhập** (`/login`) - Giao diện đẹp với validation
- ✅ **Đăng ký** (`/register`) - Form đăng ký với validation đầy đủ
- ✅ **Đăng xuất** - Tích hợp trong UserMenu
- ✅ **Middleware bảo vệ** - Tự động redirect khi chưa đăng nhập
- ✅ **Token Management** - Lưu trữ và quản lý token an toàn

### 2. User Profile & Settings
- ✅ **Profile Settings** (`/settings`) - Cập nhật thông tin cá nhân
- ✅ **Notifications Settings** (`/settings/notifications`) - Cài đặt thông báo
- ✅ **Security Settings** (`/settings/security`) - Bảo mật tài khoản
- ✅ **Members Management** (`/settings/members`) - Quản lý thành viên

### 3. UI/UX Improvements
- ✅ **Responsive Design** - Tương thích mobile/desktop
- ✅ **Dark/Light Mode** - Chuyển đổi theme
- ✅ **Toast Notifications** - Thông báo thành công/lỗi
- ✅ **Loading States** - Hiển thị trạng thái loading
- ✅ **Form Validation** - Validation real-time

## Cách sử dụng

### 1. Khởi động hệ thống
```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Admin Dashboard
cd admin
npm run dev
```

### 2. Truy cập Admin Dashboard
- **URL**: http://localhost:3011
- **Tài khoản demo**: admin@example.com / password123

### 3. Luồng sử dụng

#### Đăng ký tài khoản mới:
1. Truy cập http://localhost:3011/register
2. Điền thông tin: Tên, Email, Mật khẩu
3. Nhấn "Đăng ký"
4. Tự động chuyển đến Dashboard

#### Đăng nhập:
1. Truy cập http://localhost:3011/login
2. Nhập email và mật khẩu
3. Nhấn "Đăng nhập"
4. Chuyển đến Dashboard

#### Quản lý tài khoản:
1. Click vào avatar ở góc phải
2. Chọn "Settings" để vào trang cài đặt
3. Có 4 tab: General, Members, Notifications, Security

#### Đăng xuất:
1. Click vào avatar ở góc phải
2. Chọn "Logout"
3. Tự động chuyển về trang đăng nhập

## Cấu trúc API

### Authentication Endpoints
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/admin/profile` - Lấy thông tin profile
- `PUT /api/admin/profile` - Cập nhật profile

### Settings Endpoints
- `GET /api/admin/notifications` - Lấy cài đặt thông báo
- `PUT /api/admin/notifications` - Cập nhật thông báo
- `GET /api/admin/security` - Lấy cài đặt bảo mật
- `POST /api/admin/change-password` - Đổi mật khẩu
- `POST /api/admin/two-factor` - Bật/tắt 2FA
- `GET /api/admin/sessions` - Lấy phiên đăng nhập
- `DELETE /api/admin/sessions/:id` - Thu hồi phiên

### Members Endpoints
- `GET /api/members` - Lấy danh sách thành viên
- `POST /api/members/invite` - Mời thành viên
- `DELETE /api/members/:id` - Xóa thành viên

## Tính năng bảo mật

### 1. Token-based Authentication
- JWT token được lưu trong cookie và localStorage
- Tự động refresh token khi cần
- Middleware bảo vệ các route cần authentication

### 2. Form Validation
- Client-side validation với Zod
- Real-time validation feedback
- Server-side validation cho tất cả API calls

### 3. Security Features
- Password hashing (bcrypt)
- CSRF protection
- Rate limiting
- Session management

## Troubleshooting

### Lỗi thường gặp:

1. **"Cannot convert undefined or null to object"**
   - Nguyên nhân: Form validation schema lỗi
   - Giải pháp: Đã fix bằng cách chuyển sang manual validation

2. **API 404 errors**
   - Nguyên nhân: Backend chưa chạy hoặc URL sai
   - Giải pháp: Kiểm tra backend đang chạy trên port 3001

3. **Token invalid**
   - Nguyên nhân: Token hết hạn hoặc không hợp lệ
   - Giải pháp: Tự động logout và redirect về login

4. **Customers data không load**
   - Nguyên nhân: Token chưa được load trước khi gọi API
   - Giải pháp: Đã fix bằng watchEffect để reactive fetch

## Development Notes

### Tech Stack:
- **Frontend**: Nuxt 3 + Vue 3 + TypeScript
- **UI Framework**: Nuxt UI + Element Plus + Tailwind CSS
- **State Management**: Vue 3 Composition API
- **Authentication**: JWT + Cookie + LocalStorage
- **Backend**: Node.js + Express + MongoDB

### Code Structure:
```
admin/
├── app/
│   ├── components/     # Reusable components
│   ├── composables/    # Custom composables (useAuth)
│   ├── layouts/        # Layout components
│   ├── middleware/     # Route middleware
│   ├── pages/          # Page components
│   └── types/          # TypeScript types
├── public/             # Static assets
└── nuxt.config.ts      # Nuxt configuration
```

### Key Files:
- `composables/useAuth.ts` - Authentication logic
- `middleware/auth.ts` - Route protection
- `pages/login.vue` - Login page
- `pages/register.vue` - Register page
- `pages/settings/` - Settings pages
- `components/UserMenu.vue` - User menu with logout

## Next Steps

### Tính năng có thể thêm:
1. **Email Verification** - Xác thực email khi đăng ký
2. **Password Reset** - Quên mật khẩu
3. **Social Login** - Đăng nhập bằng Google/Facebook
4. **Role-based Access** - Phân quyền người dùng
5. **Activity Log** - Log hoạt động người dùng
6. **API Documentation** - Swagger/OpenAPI docs

### Performance Optimization:
1. **Lazy Loading** - Load components khi cần
2. **Caching** - Cache API responses
3. **Image Optimization** - Optimize avatar uploads
4. **Bundle Splitting** - Split code theo routes
