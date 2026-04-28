import { ArrowRight, ClipboardCheck, Plus } from "lucide-react";
import AdminDataTable from "../../components/admin/AdminDataTable";
import DashboardAlerts from "../../components/admin/DashboardAlerts";
import DashboardProgressChart from "../../components/admin/DashboardProgressChart";
import AdminModuleCard from "../../components/admin/AdminModuleCard";
import AdminStatCard from "../../components/admin/AdminStatCard";
import Button from "../../components/ui/Button";
import { ADMIN_NAV_ITEMS } from "../../lib/constants";

const stats = [
  {
    label: "Việc cần xử lý",
    value: "24",
    badge: "Ưu tiên",
    helper: "Kế hoạch thiếu phân công, lớp chưa xác nhận và dữ liệu cần rà soát.",
    emphasis: true,
  },
  {
    label: "Chương trình đào tạo",
    value: "12",
    badge: "CTĐT",
    helper: "Đang áp dụng theo khóa học, ngành và chuyên ngành.",
  },
  {
    label: "Lớp đang học",
    value: "48",
    badge: "Lớp",
    helper: "Theo dõi tiến độ học phần và kế hoạch học kỳ.",
  },
  {
    label: "Giảng viên khả dụng",
    value: "86",
    badge: "GV",
    helper: "Sẵn sàng phân công theo bộ môn và học phần có thể dạy.",
  },
  {
    label: "Học phần",
    value: "186",
    badge: "HP",
    helper: "Bao gồm tín chỉ, lý thuyết, thực hành và tổng số tiết.",
  },
  {
    label: "Kế hoạch học kỳ",
    value: "7",
    badge: "KH",
    helper: "Đang lập hoặc chờ duyệt cho năm học hiện tại.",
  },
  {
    label: "Nhóm chưa có GV",
    value: "18",
    badge: "Cảnh báo",
    helper: "Các nhóm LT/TH cần hoàn tất trước khi xuất báo cáo.",
  },
  {
    label: "Báo cáo tháng",
    value: "9",
    badge: "Excel",
    helper: "Báo cáo lớp, giảng viên và tổng hợp đã sẵn sàng.",
  },
];

const latestRows = [
  {
    id: "plan-1",
    name: "Kế hoạch học kỳ 2 năm học 2025-2026",
    owner: "Giáo vụ khoa",
    status: "warning" as const,
    updatedAt: "Hôm nay",
  },
  {
    id: "curriculum-1",
    name: "CTĐT Kỹ thuật phần mềm - Công nghệ Web - K20",
    owner: "Bộ môn CNPM",
    status: "active" as const,
    updatedAt: "2 ngày trước",
  },
  {
    id: "class-1",
    name: "Lớp 12522W.4 cần xác nhận học phần kỳ tới",
    owner: "Trợ lý đào tạo",
    status: "draft" as const,
    updatedAt: "5 ngày trước",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">Tổng quan</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-950 md:text-3xl">
            Tổng quan quản trị
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            Theo dõi nhanh chương trình đào tạo, kế hoạch học kỳ, phân công
            giảng viên và các việc cần xử lý hôm nay.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button leftIcon={<Plus size={18} aria-hidden="true" />}>
            Lập kế hoạch
          </Button>
          <Button
            leftIcon={<ClipboardCheck size={18} aria-hidden="true" />}
            variant="secondary"
          >
            Xử lý việc
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_448px]">
        <DashboardProgressChart />
        <DashboardAlerts />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Việc cần xử lý gần đây
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Bảng giữ chiều cao ổn định và có skeleton khi nối API.
              </p>
            </div>
            <Button
              leftIcon={<ArrowRight size={18} aria-hidden="true" />}
              variant="secondary"
            >
              Xem tất cả
            </Button>
          </div>
          <AdminDataTable rows={latestRows} />
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Truy cập nhanh</h2>
            <p className="mt-1 text-sm text-slate-500">
              Các phân hệ thường dùng trong trang quản trị.
            </p>
          </div>
          <div className="grid gap-4">
            {ADMIN_NAV_ITEMS.filter((item) => item.to !== "/admin/dashboard")
              .slice(0, 4)
              .map((item) => (
                <AdminModuleCard key={item.to} {...item} />
              ))}
          </div>
        </section>
      </div>
    </section>
  );
}
