import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  Layers3,
  RefreshCw,
  Users,
  type LucideIcon,
} from "lucide-react";

import { dashboardApi } from "../../api/admin/dashboard.api";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import Badge, { type BadgeTone } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import TableSkeleton from "../../components/ui/TableSkeleton";
import type {
  DashboardAlert,
  DashboardOverview,
  DashboardRecentItem,
  DashboardRecentYearPlan,
  DashboardWorkload,
} from "../../features/admin-dashboard.types";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(value);

const statusLabel: Record<string, string> = {
  du_thao: "Dự thảo",
  da_duyet: "Đã duyệt",
  dang_thuc_hien: "Đang thực hiện",
  da_dong: "Đã đóng",
  da_phan_cong: "Đã phân công",
  can_bo_sung: "Cần bổ sung",
};

const statusTone: Record<string, BadgeTone> = {
  du_thao: "amber",
  da_duyet: "blue",
  dang_thuc_hien: "green",
  da_dong: "slate",
  da_phan_cong: "green",
  can_bo_sung: "red",
};

const alertToneClassName: Record<DashboardAlert["tone"], string> = {
  red: "border-red-100 bg-red-50 text-red-700",
  amber: "border-amber-100 bg-amber-50 text-amber-700",
  blue: "border-brand-100 bg-brand-50 text-brand-700",
  green: "border-emerald-100 bg-emerald-50 text-emerald-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
};

type StatCardProps = {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  tone?: "brand" | "amber" | "green" | "slate";
  to: string;
};

const statToneClassName: Record<NonNullable<StatCardProps["tone"]>, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

function StatCard({
  helper,
  icon: Icon,
  label,
  tone = "brand",
  to,
  value,
}: StatCardProps) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-slate-950">
            {formatNumber(value)}
          </p>
        </div>
        <div
          className={[
            "flex size-11 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset transition group-hover:scale-105",
            statToneClassName[tone],
          ].join(" ")}
        >
          <Icon size={20} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{helper}</p>
    </Link>
  );
}

function LoadingCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
          <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 space-y-2">
            <div className="h-3 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkflowCard({ data }: { data: DashboardOverview }) {
  const rows = [
    {
      label: "KH năm học dự thảo",
      value: data.workflow.yearPlans.duThao,
      total: data.counts.tongKeHoachNam,
      tone: "amber" as const,
    },
    {
      label: "KH năm học đã duyệt/đang chạy",
      value:
        data.workflow.yearPlans.daDuyet +
        data.workflow.yearPlans.dangThucHien,
      total: data.counts.tongKeHoachNam,
      tone: "green" as const,
    },
    {
      label: "KH học kỳ dự thảo",
      value: data.workflow.semesterPlans.duThao,
      total: data.counts.tongKeHoachHocKy,
      tone: "amber" as const,
    },
    {
      label: "KH học kỳ đã khóa/đóng",
      value:
        data.workflow.semesterPlans.dangThucHien +
        data.workflow.semesterPlans.daDong,
      total: data.counts.tongKeHoachHocKy,
      tone: "green" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-slate-950">
          Tiến độ duyệt kế hoạch
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Theo dõi nhanh kế hoạch năm học và kế hoạch học kỳ.
        </p>
      </CardHeader>
      <CardBody className="space-y-4">
        {rows.map((row) => {
          const percent = row.total > 0 ? Math.round((row.value / row.total) * 100) : 0;

          return (
            <div key={row.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-700">{row.label}</span>
                <span className="font-bold text-slate-950">
                  {formatNumber(row.value)} / {formatNumber(row.total)}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={[
                    "h-full rounded-full",
                    row.tone === "green" ? "bg-emerald-500" : "bg-amber-500",
                  ].join(" ")}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}

function AlertList({ alerts }: { alerts: DashboardAlert[] }) {
  const visibleAlerts = alerts.filter((alert) => alert.count > 0);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Cảnh báo cần xử lý
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Các điểm ảnh hưởng trực tiếp đến kế hoạch và báo cáo.
          </p>
        </div>
        <Badge tone={visibleAlerts.length > 0 ? "amber" : "green"}>
          {visibleAlerts.length > 0 ? "Cần rà soát" : "Ổn định"}
        </Badge>
      </CardHeader>
      <CardBody>
        {visibleAlerts.length === 0 ? (
          <EmptyState
            title="Không có cảnh báo lớn"
            description="Dữ liệu hiện tại chưa phát hiện lỗi thiếu CTĐT, thiếu nhóm, thiếu phân công hoặc thiếu phân bổ tuần."
            icon={<AlertTriangle size={20} aria-hidden="true" />}
          />
        ) : (
          <div className="space-y-3">
            {visibleAlerts.map((alert) => (
              <Link
                key={alert.key}
                to={alert.href}
                className={[
                  "group flex items-start gap-4 rounded-lg border p-4 transition hover:-translate-y-0.5 hover:shadow-sm",
                  alertToneClassName[alert.tone],
                ].join(" ")}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/80 text-lg font-extrabold shadow-sm">
                  {formatNumber(alert.count)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-950">{alert.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {alert.description}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 opacity-60 transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function WeeklyProgress({ data }: { data: DashboardOverview }) {
  const maxValue = Math.max(1, ...data.progress.map((item) => item.value));

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Số tiết đã phân bổ theo tuần
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Dựa trên các kế hoạch năm học đã duyệt hoặc đang thực hiện.
          </p>
        </div>
        <Badge tone="blue">12 tuần gần nhất</Badge>
      </CardHeader>
      <CardBody>
        {data.progress.length === 0 ? (
          <EmptyState
            title="Chưa có dữ liệu tuần"
            description="Khi phân bổ số tiết theo tuần, biểu đồ tiến độ sẽ hiển thị tại đây."
          />
        ) : (
          <div className="flex h-72 items-end gap-3 rounded-lg bg-slate-50 p-4">
            {data.progress.map((item) => {
              const percent = Math.max(8, (item.value / maxValue) * 100);

              return (
                <div
                  key={item.tuanId}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-bold text-slate-700">
                    {formatNumber(item.value)}
                  </span>
                  <div className="flex h-48 w-full items-end rounded-md bg-white ring-1 ring-slate-100">
                    <div
                      className="w-full rounded-md bg-brand-700 transition hover:bg-brand-800"
                      style={{ height: `${percent}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-center">
                    <p className="truncate text-xs font-semibold text-slate-700">
                      {item.label}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function RecentItemsTable({ rows }: { rows: DashboardRecentItem[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Hoạt động gần đây
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kế hoạch học kỳ và phân công mới nhất.
          </p>
        </div>
        <Link
          to="/admin/training/plans/semesters"
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
        >
          Xem kế hoạch
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3 font-semibold">Nội dung</th>
              <th className="px-5 py-3 font-semibold">Thông tin</th>
              <th className="px-5 py-3 font-semibold">Trạng thái</th>
              <th className="px-5 py-3 font-semibold">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <Link
                    to={row.href}
                    className="font-semibold text-slate-950 transition hover:text-brand-700"
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-5 py-4 text-slate-600">{row.meta}</td>
                <td className="px-5 py-4">
                  <Badge tone={statusTone[row.status] ?? "slate"}>
                    {statusLabel[row.status] ?? row.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-slate-500">{row.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function WorkloadTable({ rows }: { rows: DashboardWorkload[] }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-slate-950">
          Giảng viên có nhiều tiết quy đổi
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Hỗ trợ rà soát tải giảng dạy trước khi chốt kế hoạch.
        </p>
      </CardHeader>
      <CardBody className="space-y-3">
        {rows.length === 0 ? (
          <EmptyState
            title="Chưa có phân công"
            description="Sau khi phân công giảng viên, danh sách tải giảng dạy sẽ được tổng hợp tại đây."
          />
        ) : (
          rows.map((row, index) => (
            <div
              key={row.giangVienId}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">
                    {index + 1}. {row.hoTen}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {[row.maGiangVien, row.boMon].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <Badge tone="blue">{formatNumber(row.soPhanCong)} phân công</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tiết phân công
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-slate-950">
                    {formatNumber(row.soTietPhanCong)}
                  </p>
                </div>
                <div className="rounded-md bg-white p-3 ring-1 ring-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Tiết quy đổi
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-slate-950">
                    {formatNumber(row.soTietQuyDoi)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}

function RecentYearPlans({ rows }: { rows: DashboardRecentYearPlan[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Kế hoạch năm học mới nhất
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi kế hoạch cha trước khi lập kế hoạch học kỳ.
          </p>
        </div>
        <Link
          to="/admin/training/plans/year"
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
        >
          Xem tất cả
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </CardHeader>
      <CardBody className="space-y-3">
        {rows.length === 0 ? (
          <EmptyState
            title="Chưa có kế hoạch năm học"
            description="Tạo kế hoạch năm học để bắt đầu sinh tuần đào tạo và lập kế hoạch học kỳ."
          />
        ) : (
          rows.map((row) => (
            <Link
              key={row.id}
              to={row.href}
              className="block rounded-lg border border-slate-100 bg-slate-50 p-4 transition hover:border-brand-200 hover:bg-brand-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-950">{row.tenKeHoach}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {row.maKeHoach} · {row.namHoc} · {row.khoa}
                  </p>
                </div>
                <Badge tone={statusTone[row.trangThai] ?? "slate"}>
                  {statusLabel[row.trangThai] ?? row.trangThai}
                </Badge>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <span>{formatNumber(row.soKeHoachHocKy)} kế hoạch học kỳ</span>
                <span>{formatNumber(row.soTuanDaoTao)} tuần đào tạo</span>
              </div>
            </Link>
          ))
        )}
      </CardBody>
    </Card>
  );
}

export default function DashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: dashboardApi.overview,
  });

  const stats = useMemo(() => {
    const counts = dashboardQuery.data?.counts;
    if (!counts) return [];

    return [
      {
        label: "Việc cần xử lý",
        value: counts.viecCanXuLy,
        helper: "Thiếu CTĐT, thiếu nhóm, thiếu phân công hoặc chưa phân bổ tuần.",
        icon: AlertTriangle,
        tone: "amber" as const,
        to: "/admin/dashboard",
      },
      {
        label: "Kế hoạch học kỳ",
        value: counts.tongKeHoachHocKy,
        helper: "Các kế hoạch học kỳ đang lập, đã duyệt hoặc đã đóng.",
        icon: CalendarCheck2,
        to: "/admin/training/plans/semesters",
      },
      {
        label: "Chương trình đào tạo",
        value: counts.tongChuongTrinh,
        helper: "CTĐT theo ngành, chuyên ngành và khóa học.",
        icon: GraduationCap,
        to: "/admin/curriculums",
      },
      {
        label: "Lớp đang quản lý",
        value: counts.tongLop,
        helper: "Lớp theo khóa học, ngành, chuyên ngành và cơ sở.",
        icon: Layers3,
        to: "/admin/lop",
      },
      {
        label: "Giảng viên",
        value: counts.tongGiangVien,
        helper: "Nguồn lực phân công theo bộ môn và học phần có thể dạy.",
        icon: Users,
        tone: "green" as const,
        to: "/admin/giangvien",
      },
      {
        label: "Học phần",
        value: counts.tongHocPhan,
        helper: "Danh mục học phần gồm tín chỉ, lý thuyết, thực hành và tổng tiết.",
        icon: BookOpen,
        to: "/admin/hocphan",
      },
      {
        label: "Phân công giảng dạy",
        value: counts.tongPhanCong,
        helper: "Số dòng phân công giảng viên cho các nhóm học phần.",
        icon: ClipboardList,
        tone: "green" as const,
        to: "/admin/assignments",
      },
      {
        label: "Báo cáo sẵn sàng",
        value: counts.baoCaoSanSang,
        helper: "Kế hoạch học kỳ đã qua bước dự thảo, có thể xuất báo cáo.",
        icon: FileSpreadsheet,
        tone: "slate" as const,
        to: "/admin/reports",
      },
    ];
  }, [dashboardQuery.data?.counts]);

  if (dashboardQuery.isError) {
    return (
      <ErrorState
        title="Không tải được dashboard"
        description="Vui lòng kiểm tra backend hoặc đăng nhập lại rồi thử làm mới trang."
        onAction={() => void dashboardQuery.refetch()}
      />
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-700">Tổng quan</p>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-950 md:text-3xl">
            Dashboard quản lý đào tạo
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            Theo dõi tình trạng kế hoạch, cảnh báo dữ liệu thiếu, tải giảng dạy
            và tiến độ phân bổ tuần trước khi xuất báo cáo chính thức.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            to="/admin/training/plans/year"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
          >
            <CalendarCheck2 size={18} aria-hidden="true" />
            Lập kế hoạch
          </Link>
          <Link
            to="/admin/reports"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
          >
            <FileSpreadsheet size={18} aria-hidden="true" />
            Xuất báo cáo
          </Link>
          <Button
            leftIcon={<RefreshCw size={18} aria-hidden="true" />}
            variant="ghost"
            onClick={() => void dashboardQuery.refetch()}
            isLoading={dashboardQuery.isFetching && !dashboardQuery.isLoading}
          >
            Làm mới
          </Button>
        </div>
      </header>

      {dashboardQuery.isLoading ? (
        <>
          <LoadingCards />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
            <TableSkeleton rows={5} columns={4} />
            <TableSkeleton rows={5} columns={2} />
          </div>
        </>
      ) : dashboardQuery.data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
            <WeeklyProgress data={dashboardQuery.data} />
            <div className="space-y-6">
              <WorkflowCard data={dashboardQuery.data} />
              <AlertList alerts={dashboardQuery.data.alerts} />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
            <RecentItemsTable rows={dashboardQuery.data.recentItems} />
            <WorkloadTable rows={dashboardQuery.data.workloadTop} />
          </div>

          <RecentYearPlans rows={dashboardQuery.data.recentYearPlans} />
        </>
      ) : null}
    </section>
  );
}
