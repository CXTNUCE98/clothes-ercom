# Hướng dẫn sử dụng Admin Dashboard

## Đăng nhập

1. Truy cập: http://localhost:3011/login
2. Sử dụng tài khoản demo:
   - Email: `admin@example.com`
   - Password: `password123`

## Tính năng chính

### 1. Quản lý khách hàng (`/customers`)

#### Xem danh sách khách hàng
- Hiển thị tất cả khách hàng từ database
- Tìm kiếm theo email
- Lọc theo trạng thái (Đã đăng ký, Chưa đăng ký, Bị từ chối)
- Phân trang và sắp xếp

#### Thêm khách hàng mới
- Click nút "Thêm khách hàng" ở header
- Điền thông tin: Tên, Email, Mật khẩu
- Validation tự động

#### Xóa khách hàng
- Xóa từng khách hàng: Click menu 3 chấm → "Xóa khách hàng"
- Xóa hàng loạt: Chọn nhiều khách hàng → Click "Xóa đã chọn"

#### Các thao tác khác
- Sao chép ID khách hàng
- Xem chi tiết khách hàng
- Xem lịch sử thanh toán

### 2. API Endpoints

#### Backend API (http://localhost:3001/api/admin)

**GET /customers**
- Lấy danh sách tất cả khách hàng
- Headers: `Authorization: Bearer <token>`

**POST /customers**
- Tạo khách hàng mới
- Body: `{ name, email, password }`
- Headers: `Authorization: Bearer <token>`

**DELETE /customers/:id**
- Xóa khách hàng theo ID
- Headers: `Authorization: Bearer <token>`

**GET /customers/:id**
- Lấy thông tin chi tiết khách hàng
- Headers: `Authorization: Bearer <token>`

**GET /customers/:id/payments**
- Lấy lịch sử thanh toán của khách hàng
- Headers: `Authorization: Bearer <token>`

## Cấu trúc dự án

```
admin/
├── app/
│   ├── components/
│   │   └── CustomersAddModal.vue    # Modal thêm khách hàng
│   ├── composables/
│   │   ├── useAuth.ts              # Quản lý authentication
│   │   └── useApi.ts               # Xử lý API calls
│   ├── middleware/
│   │   └── auth.ts                 # Middleware bảo vệ routes
│   ├── pages/
│   │   ├── login.vue               # Trang đăng nhập
│   │   └── customers.vue           # Trang quản lý khách hàng
│   └── layouts/
│       └── default.vue             # Layout chính
├── nuxt.config.ts                  # Cấu hình Nuxt
└── package.json                    # Dependencies
```

## Authentication

### Token Management
- Token được lưu trong localStorage
- Tự động thêm vào headers của API calls
- Tự động redirect về login nếu token invalid

### Middleware
- Tất cả routes (trừ `/login`) đều được bảo vệ
- Kiểm tra token trước khi cho phép truy cập

## Troubleshooting

### Lỗi "Invalid Token"
1. Kiểm tra backend có đang chạy không (port 3001)
2. Đăng nhập lại với tài khoản admin
3. Kiểm tra token trong localStorage

### Lỗi API calls
1. Kiểm tra CORS configuration trong backend
2. Kiểm tra admin middleware trong backend
3. Kiểm tra database connection

### Lỗi UI
1. Kiểm tra console browser
2. Restart development server: `npm run dev`
3. Clear cache browser

## Development

### Chạy development server
```bash
cd admin
npm run dev
```

### Build production
```bash
npm run build
npm run preview
```

### Cấu hình môi trường
Tạo file `.env`:
```env
NUXT_PORT=3011
NUXT_HOST=0.0.0.0
```

## Backend Integration

### Yêu cầu backend
- Node.js + Express
- SQLite database
- JWT authentication
- Admin middleware
- CORS enabled

### Database schema
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sample admin user
```sql
INSERT INTO users (email, password, name, role) 
VALUES ('admin@example.com', '$2a$10$...', 'Admin User', 'admin');
``` 