import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { lecturerApi } from "../../api/lecturer.api";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import TextInput from "../../components/ui/TextInput";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import { useDebounce } from "../../hooks/useDebounce";
import {
  assignmentRoleLabels,
  assignmentStatusLabels,
  formatNumber,
  getClassName,
  getCourseName,
  getGroupName,
  getSemesterPlanName,
} from "../../features/lecturer/lecturer.helpers";

const statusOptions: SelectOption[] = [
  { label: "Tất cả trạng thái", value: "" },
  { label: "Dự thảo", value: "du_thao" },
  { label: "Đã phân công", value: "da_phan_cong" },
  { label: "Đã xác nhận", value: "da_xac_nhan" },
  { label: "Đã hủy", value: "da_huy" },
];

export default function LecturerAssignmentsPage() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 400);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [debouncedKeyword, status]);

  const assignmentsQuery = useQuery({
    queryKey: ["lecturer-assignments", page, debouncedKeyword, status],
    queryFn: () =>
      lecturerApi.assignments({
        page,
        limit,
        keyword: debouncedKeyword || undefined,
        trangThai: status || undefined,
      }),
  });

  if (assignmentsQuery.isError) {
    return (
      <ErrorState
        title="Không tải được phân công giảng dạy"
        description="Vui lòng thử lại sau hoặc kiểm tra tài khoản giảng viên đã được liên kết hồ sơ."
        onAction={() => assignmentsQuery.refetch()}
      />
    );
  }

  const assignments = assignmentsQuery.data?.items ?? [];
  const pagination = assignmentsQuery.data?.pagination;
  const lecturer = assignmentsQuery.data?.lecturer;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">
              Phân công giảng dạy
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              Phân công của tôi
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Theo dõi các nhóm học phần được phân công cho {lecturer?.hoTen ?? "giảng viên"}.
            </p>
          </div>
          {lecturer ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <p className="font-bold text-slate-950">
                {lecturer.maGiangVien || "Chưa có mã giảng viên"}
              </p>
              <p className="mt-1 text-slate-500">
                {lecturer.boMon?.tenBoMon || "Chưa gán bộ môn"}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
            <TextInput
              label="Tìm kiếm"
              name="keyword"
              placeholder="Nhập mã học phần, tên học phần, lớp hoặc nhóm..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <SelectInput
              label="Trạng thái"
              name="status"
              options={statusOptions}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            />
          </div>
        </CardHeader>
        <CardBody>
          {assignmentsQuery.isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
              Đang tải danh sách phân công...
            </div>
          ) : assignments.length === 0 ? (
            <EmptyState
              icon={<Search size={22} aria-hidden="true" />}
              title="Chưa có phân công phù hợp"
              description="Khi giáo vụ phân công giảng dạy, dữ liệu sẽ hiển thị tại đây."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Học phần</th>
                    <th className="px-4 py-3">Lớp / nhóm</th>
                    <th className="px-4 py-3">Kế hoạch</th>
                    <th className="px-4 py-3">Vai trò</th>
                    <th className="px-4 py-3 text-right">Số tiết</th>
                    <th className="px-4 py-3 text-right">Quy đổi</th>
                    <th className="px-4 py-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assignments.map((assignment) => {
                    const role = assignment.vaiTro || "chinh";
                    const statusValue = assignment.trangThai || "da_phan_cong";
                    return (
                      <tr key={assignment.phanCongId} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-950">
                            {getCourseName(assignment)}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {assignment.nhomHocPhan?.keHoachLopHocPhan?.hocPhan?.tongSoTiet
                              ? `${formatNumber(
                                  assignment.nhomHocPhan.keHoachLopHocPhan.hocPhan.tongSoTiet,
                                )} tiết`
                              : ""}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <p>{getClassName(assignment)}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {getGroupName(assignment)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {getSemesterPlanName(assignment)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {assignmentRoleLabels[role] ?? role}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-950">
                          {formatNumber(assignment.soTietPhanCong)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-brand-700">
                          {formatNumber(assignment.soTietQuyDoi)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                            {assignmentStatusLabels[statusValue] ?? statusValue}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {pagination ? (
            <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Trang {pagination.page}/{Math.max(pagination.totalPages, 1)} · Tổng {pagination.totalItems} phân công
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1 || assignmentsQuery.isFetching}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  Trước
                </Button>
                <Button
                  variant="secondary"
                  disabled={
                    !pagination.totalPages ||
                    page >= pagination.totalPages ||
                    assignmentsQuery.isFetching
                  }
                  onClick={() => setPage((current) => current + 1)}
                >
                  Sau
                </Button>
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </div>
  );
}
