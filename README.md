# Employee Management System - Hệ thống Quản lý Nhân viên

## Tổng quan dự án
- **Tên**: Employee Management System
- **Mục tiêu**: Xây dựng ứng dụng quản lý nhân viên với đầy đủ chức năng CRUD
- **Công nghệ**: ReactJS + Hono Framework + Cloudflare Pages
- **Tính năng chính**: 
  - ✅ Thêm nhân viên mới
  - ✅ Xem danh sách nhân viên
  - ✅ Cập nhật thông tin nhân viên
  - ✅ Xóa nhân viên
  - ✅ Tìm kiếm nhân viên theo tên, email, địa chỉ
  - ✅ Sắp xếp theo tên và địa chỉ (tăng dần/giảm dần)

## URLs
- **Development**: https://3000-iiydw97eyl4xv00x44nh0-2b54fc91.sandbox.novita.ai
- **Production**: [Chưa deploy]
- **GitHub**: [Chưa setup]

## API Endpoints

### 1. GET /api/employees
- **Mô tả**: Lấy danh sách tất cả nhân viên
- **Query params**: 
  - `sortBy`: 'name' hoặc 'address' 
  - `order`: 'asc' hoặc 'desc'
- **Response**: `{ success: true, data: Employee[], total: number }`

### 2. GET /api/employees/:id
- **Mô tả**: Lấy thông tin chi tiết một nhân viên
- **Response**: `{ success: true, data: Employee }`

### 3. POST /api/employees
- **Mô tả**: Tạo nhân viên mới
- **Body**: `{ name, dateOfBirth, gender, email, address }`
- **Response**: `{ success: true, data: Employee }`

### 4. PUT /api/employees/:id
- **Mô tả**: Cập nhật thông tin nhân viên
- **Body**: Partial Employee object
- **Response**: `{ success: true, data: Employee }`

### 5. DELETE /api/employees/:id
- **Mô tả**: Xóa nhân viên
- **Response**: `{ success: true, data: Employee }`

## Cấu trúc dữ liệu

### Employee Model
```typescript
interface Employee {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## Kiến trúc ứng dụng
- **Backend**: Hono framework với in-memory storage (có thể nâng cấp lên Cloudflare D1)
- **Frontend**: React 18 với Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Storage**: In-memory (development) / Cloudflare D1 (production - optional)

## Hướng dẫn sử dụng

### Cho người dùng cuối:
1. **Thêm nhân viên**: Click nút "Thêm nhân viên" → Điền form → Submit
2. **Sửa thông tin**: Click icon bút chì ở cột "Thao tác" → Sửa form → Cập nhật
3. **Xóa nhân viên**: Click icon thùng rác ở cột "Thao tác" → Xác nhận xóa
4. **Tìm kiếm**: Nhập từ khóa vào ô tìm kiếm (tìm theo tên, email, địa chỉ)
5. **Sắp xếp**: Click vào tiêu đề cột "Họ tên" hoặc "Địa chỉ" để sắp xếp

### Cho developer:

#### Cài đặt và chạy local:
```bash
# Clone project
git clone <repo-url>
cd webapp

# Install dependencies
npm install

# Build project
npm run build

# Start development server
npm run dev:sandbox

# Hoặc dùng PM2
pm2 start ecosystem.config.cjs
```

#### Deploy lên Cloudflare Pages:
```bash
# Build và deploy
npm run deploy
```

## Tính năng đã hoàn thành
- ✅ CRUD đầy đủ cho nhân viên
- ✅ Validation dữ liệu (email, required fields)
- ✅ Tìm kiếm real-time
- ✅ Sắp xếp theo tên và địa chỉ
- ✅ Giao diện responsive, chuyên nghiệp
- ✅ Thông báo lỗi và thành công
- ✅ Xác nhận trước khi xóa
- ✅ Loading states

## Tính năng chưa implement
- ❌ Phân trang cho danh sách lớn
- ❌ Export/Import CSV
- ❌ Upload ảnh avatar
- ❌ Lịch sử thay đổi
- ❌ Authentication & Authorization
- ❌ Multi-language support

## Đề xuất phát triển tiếp theo
1. **Database**: Chuyển từ in-memory sang Cloudflare D1 để lưu trữ persistent
2. **Authentication**: Thêm đăng nhập với JWT
3. **Phân trang**: Xử lý danh sách lớn với pagination
4. **Export/Import**: Cho phép xuất/nhập dữ liệu Excel/CSV
5. **Avatar**: Thêm chức năng upload ảnh đại diện
6. **Validation**: Tăng cường validation phía client
7. **Testing**: Thêm unit tests và integration tests

## Thiết kế giao diện

### Màu sắc chính:
- **Primary**: Indigo (#4F46E5)
- **Background**: Gray-50 (#F9FAFB)
- **Card**: White (#FFFFFF)
- **Text**: Gray-900 (#111827)
- **Border**: Gray-200 (#E5E7EB)

### Components:
- Header với logo và thống kê
- Search bar với icon
- Table với hover effects
- Modal form cho CRUD
- Alert messages (success/error)
- Loading states
- Empty state

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Active (Development)
- **Tech Stack**: Hono + React 18 + Tailwind CSS
- **Last Updated**: November 9, 2024

## Scripts

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "preview": "wrangler pages dev dist",
  "deploy": "npm run build && wrangler pages deploy dist",
  "clean-port": "fuser -k 3000/tcp 2>/dev/null || true",
  "test": "curl http://localhost:3000"
}
```

## License
MIT