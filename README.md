# UTEHY University Management System

Hệ thống quản lý chương trình đào tạo, kế hoạch học kỳ và phân công giảng dạy
dành cho trường đại học. Dự án hỗ trợ giáo vụ quản lý dữ liệu đào tạo tập
trung, đồng thời cung cấp cổng thông tin riêng để giảng viên theo dõi lịch dạy
và khối lượng công việc.

## Chức năng chính

- Đăng nhập, phân quyền quản trị viên và giảng viên.
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
| State & validation | Zustand, Zod |
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
└── package.json          # Scripts chạy đồng thời hai ứng dụng
```

## Chạy dự án

Yêu cầu: Node.js, npm và MySQL.

```bash
npm run install:all
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
npm run prisma:generate --prefix backend
npm run dev
```

Cập nhật `backend/.env` bằng thông tin kết nối MySQL và JWT secret trước khi
chạy. Các địa chỉ mặc định:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3008/api/v1`

## Kiểm tra production

```bash
npm run build
npm run lint
```

## Tài liệu

- [Mô tả cơ sở dữ liệu](docs/mo-ta-co-so-du-lieu-qldt.md)
- [Prisma class diagram](docs/prisma-class-diagram.md)
- [ERD](docs/prisma-erd.svg)
