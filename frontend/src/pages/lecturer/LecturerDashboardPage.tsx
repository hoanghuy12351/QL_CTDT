import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CheckCircle2, ClipboardList, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { lecturerApi } from "../../api/lecturer.api";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import {
  formatNumber,
  formatWeekRange,
  getClassName,
  getCourseName,
  getGroupName,
  getRoomName,
} from "../../features/lecturer/lecturer.helpers";

const statCards = [
  {
    key: "activeAssignments",
    label: "Phân công đang nhận",
    icon: ClipboardList,
  },
  {
    key: "confirmedAssignments",
    label: "Đã xác nhận",
    icon: CheckCircle2,
  },
  {
    key: "totalAssignedPeriods",
    label: "Tổng số tiết",
    icon: CalendarDays,
  },
  {
    key: "totalConvertedPeriods",
    label: "Số tiết quy đổi",
    icon: Clock3,
  },
] as const;

export default function LecturerDashboardPage() {
  const dashboardQuery = useQuery({
    queryKey: ["lecturer-dashboard"],
    queryFn: lecturerApi.dashboard,
  });

  if (dashboardQuery.isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500">
        Đang tải dữ liệu giảng viên...
      </div>
    );
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <ErrorState
        title="Không tải được không gian giảng viên"
        description="Vui lòng kiểm tra tài khoản giảng viên đã được liên kết với hồ sơ giảng viên hay chưa."
        onAction={() => dashboardQuery.refetch()}
      />
    );
  }

  const { lecturer, stats, upcomingSchedules } = dashboardQuery.data;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">
              Không gian giảng viên
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              Xin chào, {lecturer.hoTen}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Theo dõi phân công giảng dạy, số tiết và lịch dạy theo tuần của bạn.
            </p>
          </div>
          <div className="rounded-xl border border-white bg-white/80 px-4 py-3 text-sm shadow-sm">
            <p className="font-bold text-slate-950">
              {lecturer.maGiangVien || "Chưa có mã giảng viên"}
            </p>
            <p className="mt-1 text-slate-500">
              {lecturer.boMon?.tenBoMon || "Chưa gán bộ môn"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;
          const value = stats[item.key];
          return (
            <Card key={item.key}>
              <CardBody className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {formatNumber(value)}
                  </p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Lịch dạy theo tuần</h2>
            <p className="mt-1 text-sm text-slate-500">
              Các tuần đã được phân bổ trong kế hoạch giảng dạy.
            </p>
          </div>
          <Link
            to="/lecturer/assignments"
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-800"
          >
            Xem tất cả phân công
          </Link>
        </CardHeader>
        <CardBody>
          {upcomingSchedules.length === 0 ? (
            <EmptyState
              title="Chưa có lịch dạy"
              description="Khi giáo vụ phân bổ số tiết theo tuần, lịch dạy của bạn sẽ hiển thị tại đây."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Tuần</th>
                    <th className="px-4 py-3">Học phần</th>
                    <th className="px-4 py-3">Lớp / nhóm</th>
                    <th className="px-4 py-3">Phòng</th>
                    <th className="px-4 py-3 text-right">Số tiết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingSchedules.map((schedule) => (
                    <tr key={schedule.lichTuanId} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {formatWeekRange(schedule)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {getCourseName(schedule.phanCongGiangDay)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{getClassName(schedule.phanCongGiangDay)}</p>
                        <p className="text-xs text-slate-500">
                          {getGroupName(schedule.phanCongGiangDay)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {getRoomName(schedule)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-slate-950">
                        {formatNumber(schedule.soTiet)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
