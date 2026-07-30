# UTEHY University Management System

Hệ thống quản lý chương trình đào tạo, kế hoạch học kỳ và phân công giảng dạy
dành cho trường đại học. Dự án hỗ trợ giáo vụ quản lý dữ liệu đào tạo tập
trung, đồng thời cung cấp cổng thông tin riêng để giảng viên theo dõi lịch dạy
và khối lượng công việc.

## Chức năng chính

- Đăng nhập và phân quyền quản trị viên, giảng viên.
- Quản lý khoa, bộ môn, ngành, chuyên ngành, khóa học, lớp và cơ sở.
- Quản lý học phần, chương trình đào tạo và tiến độ học tập của lớp.
- Lập kế hoạch đào tạo theo năm học và học kỳ.
- Tổ chức nhóm lý thuyết/thực hành và phân công giảng viên.
- Quản lý định mức giờ giảng, hệ số lớp và lịch dạy theo tuần.
- Dashboard theo dõi tiến độ, cảnh báo dữ liệu và tải giảng dạy.
- Xuất chương trình đào tạo và báo cáo kế hoạch ra Excel.
- Cổng giảng viên để xem phân công, số tiết và lịch giảng dạy.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Data fetching | TanStack Query, Axios |
| State và validation | Zustand, Zod |
| Backend | Node.js, Express 5, TypeScript |
| Database | MySQL, Prisma ORM |
| Authentication | JSON Web Token |
| Reports | ExcelJS |

## Cấu trúc dự án

```text
.
├── backend/              # REST API, Prisma schema và migrations
├── frontend/             # Ứng dụng React cho admin và giảng viên
├── docs/                 # Tài liệu cơ sở dữ liệu, ERD và class diagram
└── package.json          # Scripts dùng chung cho toàn dự án
```

## Cài đặt và chạy dự án

### 1. Yêu cầu hệ thống

Hãy cài đặt các công cụ sau:

- [Node.js](https://nodejs.org/) phiên bản 20 trở lên.
- npm (được cài cùng Node.js).
- [MySQL](https://dev.mysql.com/downloads/) phiên bản 8 trở lên.
- Git.

Kiểm tra phiên bản:

```bash
node --version
npm --version
mysql --version
git --version
```

### 2. Clone repository

```bash
git clone git@github.com:hoanghuy12351/university-management-system-UTEHY.git
cd university-management-system-UTEHY
```

Nếu chưa cấu hình SSH cho GitHub:

```bash
git clone https://github.com/hoanghuy12351/university-management-system-UTEHY.git
cd university-management-system-UTEHY
```

### 3. Cài đặt dependencies

Cài toàn bộ dependencies của root, backend và frontend:

```bash
npm run install:all
```

Hoặc cài riêng từng phần:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 4. Tạo MySQL database

Đăng nhập MySQL:

```bash
mysql -u root -p
```

Tạo database với UTF-8:

```sql
CREATE DATABASE university_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Thoát MySQL:

```sql
EXIT;
```

### 5. Cấu hình biến môi trường

Trên Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Trên macOS hoặc Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Nội dung cần cập nhật trong `backend/.env`:

```env
PORT=3008
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/university_management"
JWT_SECRET="replace_with_a_long_random_secret"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

Nếu tài khoản MySQL không có mật khẩu, chuỗi kết nối có dạng:

```env
DATABASE_URL="mysql://root@localhost:3306/university_management"
```

Cấu hình `frontend/.env`:

```env
VITE_API_URL="http://127.0.0.1:3008/api/v1"
```

Không commit các file `.env` vì chúng có thể chứa mật khẩu và khóa bí mật.

### 6. Khởi tạo cơ sở dữ liệu

Tạo Prisma Client và áp dụng toàn bộ migration:

```bash
npm run prisma:generate --prefix backend
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

Dự án cũng cung cấp dữ liệu mẫu trong `backend/sql`. Có thể nhập bộ dữ liệu
idempotent sau khi migration hoàn tất:

```bash
mysql -u root -p university_management < backend/sql/seed-qlctdt-idempotent.sql
```

Bước nhập dữ liệu mẫu là tùy chọn. Nếu không nhập, hãy chạy ứng dụng và đăng
ký tài khoản quản trị đầu tiên tại trang `/auth/register`.

### 7. Khởi động development

Chạy đồng thời backend và frontend:

```bash
npm run dev
```

Hoặc chạy riêng trong hai terminal:

```bash
npm run dev:backend
npm run dev:frontend
```

Ứng dụng mặc định chạy tại:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3008/api/v1`
- Health check: `http://localhost:3008/api/v1`

### 8. Build production

Kiểm tra lint và build toàn bộ dự án:

```bash
npm run lint
npm run build
```

Chạy backend từ bản build:

```bash
npm run start --prefix backend
```

Xem thử frontend production:

```bash
npm run preview --prefix frontend
```

## Các lệnh thường dùng

| Lệnh | Chức năng |
| --- | --- |
| `npm run dev` | Chạy frontend và backend cùng lúc |
| `npm run dev:backend` | Chỉ chạy Express API |
| `npm run dev:frontend` | Chỉ chạy React/Vite |
| `npm run build` | Build toàn bộ dự án |
| `npm run lint` | Kiểm tra mã nguồn frontend |
| `npm run prisma:generate --prefix backend` | Tạo Prisma Client |
| `npm run prisma:migrate --prefix backend` | Tạo migration khi phát triển |
| `npm run prisma:studio --prefix backend` | Mở giao diện quản lý dữ liệu Prisma |

## Xử lý lỗi thường gặp

### Không kết nối được MySQL

- Kiểm tra dịch vụ MySQL đang chạy.
- Kiểm tra username, password, port và database trong `DATABASE_URL`.
- Mật khẩu chứa ký tự đặc biệt phải được URL encode.

### Frontend không gọi được API

- Kiểm tra backend đang chạy tại port `3008`.
- Kiểm tra `VITE_API_URL` trong `frontend/.env`.
- Khởi động lại Vite sau khi thay đổi file `.env`.

### Prisma báo schema chưa đồng bộ

```bash
npm run prisma:generate --prefix backend
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

## Tài liệu

- [Mô tả cơ sở dữ liệu](docs/mo-ta-co-so-du-lieu-qldt.md)
- [Prisma class diagram](docs/prisma-class-diagram.md)
- [ERD](docs/prisma-erd.svg)
