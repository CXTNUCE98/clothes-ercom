# Hướng dẫn Setup Project Clothes E-commerce

## Yêu cầu hệ thống

- Node.js (version 16 trở lên)
- npm hoặc yarn
- Git

## Cấu trúc Project

```
clothes-ercom/
├── frontend/          # Nuxt.js 3.x frontend
│   ├── components/    # Vue components
│   ├── pages/         # Pages và routing
│   ├── composables/   # Composables (useAuth, useApi)
│   ├── layouts/       # Layout templates
│   └── nuxt.config.ts # Nuxt configuration
├── backend/           # Node.js + Express backend
│   ├── routes/        # API routes
│   ├── middleware/    # Middleware (auth)
│   ├── scripts/       # Database scripts
│   └── database.js    # Database configuration
├── setup.bat          # Setup script cho Windows
├── setup.sh           # Setup script cho Linux/Mac
└── README.md          # Documentation chính
```

## Cách 1: Setup tự động (Khuyến nghị)

### Windows
```bash
# Chạy file setup.bat
setup.bat
```

### Linux/Mac
```bash
# Chạy file setup.sh
./setup.sh
```

## Cách 2: Setup thủ công

### Bước 1: Setup Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env

# Khởi tạo database
npm run init-db

# Chạy backend (development mode)
npm run dev
```

Backend sẽ chạy tại: http://localhost:3001

### Bước 2: Setup Frontend

```bash
# Mở terminal mới, di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy frontend (development mode)
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Cấu hình Database

Project sử dụng SQLite làm database. File database sẽ được tạo tự động tại `backend/database.sqlite`.

### Cấu hình trong file .env

```env
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
DB_PATH=./database.sqlite
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin user (cần auth)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm (có filter)
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/categories/list` - Lấy danh mục sản phẩm

### Cart (cần auth)
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart/add` - Thêm vào giỏ hàng
- `PUT /api/cart/update/:id` - Cập nhật số lượng
- `DELETE /api/cart/remove/:id` - Xóa khỏi giỏ hàng
- `DELETE /api/cart/clear` - Xóa toàn bộ giỏ hàng

### Orders (cần auth)
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng

## Tính năng Frontend

### Pages
- **Trang chủ** (`/`) - Hero section, danh mục, sản phẩm nổi bật
- **Đăng nhập** (`/login`) - Form đăng nhập
- **Đăng ký** (`/register`) - Form đăng ký
- **Danh sách sản phẩm** (`/products`) - Grid sản phẩm với filter
- **Chi tiết sản phẩm** (`/products/:id`) - Thông tin chi tiết và thêm vào giỏ hàng
- **Giỏ hàng** (`/cart`) - Quản lý giỏ hàng
- **Thanh toán** (`/checkout`) - Form đặt hàng

### Components
- `ProductCard.vue` - Card hiển thị sản phẩm
- Layout với navigation và footer

### Composables
- `useAuth.ts` - Quản lý authentication
- `useApi.ts` - Quản lý API calls

## Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation

### Frontend
- **Nuxt.js 3** - Vue.js framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Element Plus** - UI components
- **VueUse** - Vue composition utilities
- **Boxicons** - Icon library

## Troubleshooting

### Lỗi thường gặp

1. **Port đã được sử dụng**
   - Thay đổi port trong file .env
   - Hoặc kill process đang sử dụng port

2. **Database error**
   - Xóa file database.sqlite và chạy lại `npm run init-db`

3. **CORS error**
   - Kiểm tra cấu hình CORS trong backend/server.js

4. **Module not found**
   - Chạy lại `npm install` trong cả frontend và backend

### Logs

- Backend logs: Terminal chạy backend
- Frontend logs: Browser DevTools Console
- Database: File `backend/database.sqlite`

## Development

### Thêm sản phẩm mới

1. Thêm vào database thông qua script hoặc trực tiếp
2. Hoặc thêm API endpoint để admin thêm sản phẩm

### Thêm tính năng mới

1. Tạo API endpoint trong `backend/routes/`
2. Tạo page/component trong `frontend/pages/` hoặc `frontend/components/`
3. Cập nhật navigation nếu cần

## Production

### Build Frontend
```bash
cd frontend
npm run build
```

### Build Backend
```bash
cd backend
npm run start
```

### Environment Variables
- Cập nhật `JWT_SECRET` với secret key mạnh
- Cấu hình database production
- Cấu hình CORS cho domain production

## Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Node.js version (>= 16)
2. Dependencies đã được cài đặt đầy đủ
3. Database đã được khởi tạo
4. Port 3000 và 3001 không bị chiếm 