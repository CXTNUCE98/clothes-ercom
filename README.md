# Clothes E-commerce Project

Project web bán hàng với Nuxt.js frontend, Node.js backend và Admin dashboard.

## Cấu trúc Project

```
clothes-ercom/
├── frontend/          # Nuxt.js 3.x frontend
├── backend/           # Node.js + Express backend
├── admin/             # Nuxt.js 3.x admin dashboard
├── setup.bat          # Setup script cho Windows
├── setup.sh           # Setup script cho Linux/Mac
├── README.md          # Documentation chính
├── SETUP_GUIDE.md     # Hướng dẫn setup chi tiết
├── frontend/TROUBLESHOOTING.md # Hướng dẫn fix lỗi frontend
└── frontend/ICON_FIX_GUIDE.md # Hướng dẫn fix lỗi icon
```

## Setup và Chạy

### Cách 1: Setup tự động (Khuyến nghị)

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
./setup.sh
```

### Cách 2: Setup thủ công

#### Backend Setup

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env từ .env.example:
```bash
cp .env.example .env
```

4. Khởi tạo database:
```bash
npm run init-db
```

5. Chạy backend:
```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:3001

#### Frontend Setup

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Generate types (quan trọng cho TypeScript):
```bash
npx nuxi prepare
```

4. Chạy frontend:
```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

#### Admin Setup

1. Di chuyển vào thư mục admin:
```bash
cd admin
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy admin dashboard:
```bash
npm run dev
```

Admin sẽ chạy tại: http://localhost:3011

**Hoặc sử dụng script có sẵn:**

**Windows:**
```bash
cd admin
start-admin.bat
```

**Linux/Mac:**
```bash
cd admin
./start-admin.sh
```

## Troubleshooting

### Lỗi TypeScript thường gặp

Nếu gặp lỗi "Cannot find name 'useAuth', 'useApi', etc.":

1. Chạy lệnh generate types:
```bash
cd frontend
npx nuxi prepare
```

2. Hoặc chạy development server:
```bash
npm run dev
```

### Lỗi "$fetch" initialization

Đã được fix trong `frontend/composables/useApi.ts`.

### Lỗi Icon - InvalidCharacterError

Nếu gặp lỗi `InvalidCharacterError: Failed to execute 'createElement' on 'Document': The tag name provided ('bx bx-user') is not a valid name.`

**Nguyên nhân:** Element Plus không thể xử lý Boxicons classes trong `prefix-icon`.

**Giải pháp:** Đã được fix bằng cách thay thế `prefix-icon` bằng icon elements riêng biệt.

Xem chi tiết trong `frontend/ICON_FIX_GUIDE.md`.

### Chi tiết troubleshooting

Xem file `frontend/TROUBLESHOOTING.md` để biết thêm chi tiết.

## API Endpoints

### Auth
- POST /api/auth/register - Đăng ký
- POST /api/auth/login - Đăng nhập
- GET /api/auth/profile - Lấy thông tin user

### Products
- GET /api/products - Lấy danh sách sản phẩm
- GET /api/products/:id - Lấy chi tiết sản phẩm
- GET /api/products/categories/list - Lấy danh mục sản phẩm

### Cart
- GET /api/cart - Lấy giỏ hàng
- POST /api/cart/add - Thêm vào giỏ hàng
- PUT /api/cart/update/:id - Cập nhật giỏ hàng
- DELETE /api/cart/remove/:id - Xóa khỏi giỏ hàng

### Orders
- POST /api/orders - Tạo đơn hàng
- GET /api/orders - Lấy danh sách đơn hàng

## Database Schema

### User
- id, email, password, name, role, createdAt

### Product
- id, name, description, price, category, image, stock, createdAt

### Cart
- id, userId, productId, quantity, createdAt

### Order
- id, userId, items, total, status, createdAt

## Tính năng

### Frontend
- ✅ Trang chủ với hero section và sản phẩm nổi bật
- ✅ Đăng ký/Đăng nhập với validation
- ✅ Danh sách sản phẩm với filter và search
- ✅ Chi tiết sản phẩm
- ✅ Giỏ hàng với quản lý số lượng
- ✅ Thanh toán
- ✅ Responsive design với Tailwind CSS
- ✅ UI components với Element Plus
- ✅ Icons với Boxicons (đã fix lỗi)

### Admin Dashboard
- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Analytics và báo cáo
- ✅ Modern UI với Nuxt UI Pro
- ✅ Responsive design

### Backend
- ✅ RESTful API với Express.js
- ✅ Authentication với JWT
- ✅ Database SQLite với sample data
- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration

## Công nghệ sử dụng

**Backend:**
- Node.js + Express.js
- SQLite database
- JWT authentication
- bcryptjs cho password hashing

**Frontend:**
- Nuxt.js 3 với TypeScript
- Tailwind CSS
- Element Plus UI components
- VueUse utilities
- Boxicons icons (đã fix compatibility)

**Admin Dashboard:**
- Nuxt.js 3 với TypeScript
- Nuxt UI Pro components
- VueUse utilities
- Element Plus components
- Tailwind CSS

## Lỗi đã được fix

- ✅ Lỗi "$fetch" initialization
- ✅ Lỗi TypeScript composables
- ✅ Lỗi Element Plus icon compatibility
- ✅ Lỗi ElMessage usage
- ✅ Lỗi prefix-icon với Boxicons 