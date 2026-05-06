import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileSpreadsheet, GraduationCap, Users } from "lucide-react";

import { adminCrudApi } from "../../api/adminCrud.api";
import { reportsApi } from "../../api/admin/reports.api";
import { teachingAssignmentsApi } from "../../api/admin/teachingAssignments.api";
import { trainingPlansApi } from "../../api/admin/trainingPlans.api";
import Card, { CardBody, CardHeader } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import PageHeader from "../../components/common/PageHeader";
import ErrorState from "../../components/common/ErrorState";
import Toast, { type ToastType } from "../../components/ui/Toast";
import { getApiErrorMessage } from "../../types/api.types";
import type { ReportDownload, SemesterReportRow } from "./report.types";

type ToastState = {
  type: ToastType;
  message: string;
};

type ExportKind = "semester" | "class" | "lecturer" | null;

const formatNumber = (value: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(value);

const formatDateRange = (start?: string | null, end?: string | null) => {
  const toDateText = (value?: string | null) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return [toDateText(start), toDateText(end)].filter(Boolean).join(" - ");
};

const saveDownload = (download: ReportDownload) => {
  const url = window.URL.createObjectURL(download.blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = download.fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

const getRowStatusLabel = (row: SemesterReportRow) => {
  if (!row.nhomHocPhanId) return "Chưa tạo nhóm";
  if (!row.phanCongId) return "Chưa phân công";

  return row.trangThai;
};

export default function ReportPage() {
  const [selectedSemesterPlanId, setSelectedSemesterPlanId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [exporting, setExporting] = useState<ExportKind>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 3500);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const semesterPlansQuery = useQuery({
    queryKey: ["reports-semester-plans"],
    queryFn: () => trainingPlansApi.listSemesterPlans({ page: 1, limit: 500 }),
  });

  const semesterPlanOptions = useMemo<SelectOption[]>(
    () =>
      (semesterPlansQuery.data?.items ?? []).map((semesterPlan) => ({
        value: String(semesterPlan.id),
        label: semesterPlan.name,
      })),
    [semesterPlansQuery.data?.items],
  );

  useEffect(() => {
    if (!selectedSemesterPlanId && semesterPlanOptions.length > 0) {
      setSelectedSemesterPlanId(String(semesterPlanOptions[0].value));
    }
  }, [selectedSemesterPlanId, semesterPlanOptions]);

  const classesQuery = useQuery({
    queryKey: ["reports-classes"],
    queryFn: () => adminCrudApi.list("lop", { page: 1, limit: 500 }),
  });

  const lecturersQuery = useQuery({
    queryKey: ["reports-lecturers"],
    queryFn: () => teachingAssignmentsApi.listLecturers({ page: 1, limit: 500 }),
  });

  const reportQuery = useQuery({
    queryKey: ["semester-report", selectedSemesterPlanId],
    queryFn: () => reportsApi.getSemesterReport(Number(selectedSemesterPlanId)),
    enabled: Boolean(selectedSemesterPlanId),
  });

  const classOptions = useMemo<SelectOption[]>(
    () =>
      (classesQuery.data?.items ?? []).map((item) => {
        const id = Number(item.lopId);
        const code = String(item.maLop ?? "");
        const name = String(item.tenLop ?? "");

        return {
          value: String(id),
          label: code ? `${code} - ${name}` : name,
        };
      }),
    [classesQuery.data?.items],
  );

  const lecturerOptions = useMemo<SelectOption[]>(
    () =>
      (lecturersQuery.data ?? []).map((lecturer) => ({
        value: String(lecturer.id),
        label: lecturer.code
          ? `${lecturer.code} - ${lecturer.name}`
          : lecturer.name,
      })),
    [lecturersQuery.data],
  );

  const previewRows = useMemo(
    () => (reportQuery.data?.rows ?? []).slice(0, 15),
    [reportQuery.data?.rows],
  );

  const previewWeeks = useMemo(
    () => (reportQuery.data?.weeks ?? []).slice(0, 8),
    [reportQuery.data?.weeks],
  );

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  const handleExport = async (kind: Exclude<ExportKind, null>) => {
    if (!selectedSemesterPlanId) {
      showToast("error", "Vui lòng chọn kế hoạch học kỳ trước khi xuất Excel.");
      return;
    }

    try {
      setExporting(kind);

      if (kind === "semester") {
        saveDownload(
          await reportsApi.exportSemesterReport(Number(selectedSemesterPlanId)),
        );
      }

      if (kind === "class") {
        if (!selectedClassId) {
          showToast("error", "Vui lòng chọn lớp cần xuất báo cáo.");
          return;
        }

        saveDownload(
          await reportsApi.exportClassReport(
            Number(selectedSemesterPlanId),
            Number(selectedClassId),
          ),
        );
      }

      if (kind === "lecturer") {
        if (!selectedLecturerId) {
          showToast("error", "Vui lòng chọn giảng viên cần xuất báo cáo.");
          return;
        }

        saveDownload(
          await reportsApi.exportLecturerReport(
            Number(selectedSemesterPlanId),
            Number(selectedLecturerId),
          ),
        );
      }

      showToast("success", "Đã xuất file Excel thành công.");
    } catch (error) {
      showToast("error", getApiErrorMessage(error, "Không thể xuất báo cáo."));
    } finally {
      setExporting(null);
    }
  };

  const summary = reportQuery.data?.summary;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo"
        description="Xem nhanh kế hoạch giảng dạy theo học kỳ và xuất Excel theo mẫu có cột tuần, lớp, giảng viên, số tiết."
        action={
          <Button
            leftIcon={<Download size={16} aria-hidden="true" />}
            isLoading={exporting === "semester"}
            onClick={() => void handleExport("semester")}
          >
            Xuất báo cáo học kỳ
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <FileSpreadsheet size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Bộ lọc báo cáo
              </h2>
              <p className="text-sm text-slate-500">
                Chọn kế hoạch học kỳ để xem dữ liệu trước khi xuất Excel.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid gap-4 lg:grid-cols-3">
            <SelectInput
              label="Kế hoạch học kỳ"
              options={semesterPlanOptions}
              placeholder="Chọn kế hoạch học kỳ"
              value={selectedSemesterPlanId}
              onChange={(event) => setSelectedSemesterPlanId(event.target.value)}
            />
            <SelectInput
              label="Lớp"
              options={classOptions}
              placeholder="Chọn lớp để xuất riêng"
              value={selectedClassId}
              onChange={(event) => setSelectedClassId(event.target.value)}
            />
            <SelectInput
              label="Giảng viên"
              options={lecturerOptions}
              placeholder="Chọn giảng viên để xuất riêng"
              value={selectedLecturerId}
              onChange={(event) => setSelectedLecturerId(event.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="secondary"
              leftIcon={<Download size={16} aria-hidden="true" />}
              isLoading={exporting === "class"}
              onClick={() => void handleExport("class")}
            >
              Xuất theo lớp
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Download size={16} aria-hidden="true" />}
              isLoading={exporting === "lecturer"}
              onClick={() => void handleExport("lecturer")}
            >
              Xuất theo giảng viên
            </Button>
          </div>
        </CardBody>
      </Card>

      {reportQuery.isError ? (
        <ErrorState
          title="Không thể tải báo cáo"
          description={getApiErrorMessage(reportQuery.error)}
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <FileSpreadsheet size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-slate-500">Dòng phân công</p>
              <p className="text-2xl font-bold text-slate-950">
                {formatNumber(summary?.totalRows ?? 0)}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-slate-500">Số lớp</p>
              <p className="text-2xl font-bold text-slate-950">
                {formatNumber(summary?.totalClasses ?? 0)}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Users size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-slate-500">Giảng viên</p>
              <p className="text-2xl font-bold text-slate-950">
                {formatNumber(summary?.totalLecturers ?? 0)}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Download size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm text-slate-500">Tổng tiết quy đổi</p>
              <p className="text-2xl font-bold text-slate-950">
                {formatNumber(summary?.totalConvertedPeriods ?? 0)}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Xem trước dữ liệu xuất Excel
            </h2>
            <p className="text-sm text-slate-500">
              Hiển thị tối đa 15 dòng đầu và 8 tuần đầu để kiểm tra nhanh.
            </p>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">STT</th>
                  <th className="px-4 py-3 text-left font-semibold">Giảng viên</th>
                  <th className="px-4 py-3 text-left font-semibold">Học phần</th>
                  <th className="px-4 py-3 text-left font-semibold">Lớp</th>
                  <th className="px-4 py-3 text-left font-semibold">Nhóm</th>
                  <th className="px-4 py-3 text-right font-semibold">Số tiết</th>
                  {previewWeeks.map((week) => (
                    <th
                      key={week.tuanId}
                      className="min-w-28 px-4 py-3 text-center font-semibold"
                    >
                      <span className="block">Tuần {week.soTuan}</span>
                      <span className="block text-[11px] normal-case text-slate-400">
                        {formatDateRange(week.ngayBatDau, week.ngayKetThuc)}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {reportQuery.isLoading ? (
                  <tr>
                    <td
                      colSpan={7 + previewWeeks.length}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      Đang tải dữ liệu báo cáo...
                    </td>
                  </tr>
                ) : null}
                {!reportQuery.isLoading && previewRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7 + previewWeeks.length}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      Chưa có dữ liệu để xuất báo cáo.
                    </td>
                  </tr>
                ) : null}
                {previewRows.map((row) => (
                  <tr key={row.rowId} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-600">{row.stt}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {row.tenGiangVien || "Chưa phân công"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="block font-medium">{row.tenHocPhan}</span>
                      <span className="text-xs text-slate-400">{row.maHocPhan}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{row.maLop}</td>
                    <td className="px-4 py-3 text-slate-700">{row.maNhom}</td>
                    <td className="px-4 py-3 text-right text-slate-700">
                      {formatNumber(row.soTietPhanCong || row.tongSoTietHocPhan)}
                    </td>
                    {previewWeeks.map((week) => (
                      <td
                        key={`${row.rowId}-${week.tuanId}`}
                        className="px-4 py-3 text-center text-slate-700"
                      >
                        {row.weeklyPeriods[String(week.tuanId)] || ""}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-slate-500">
                      {getRowStatusLabel(row)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {toast ? (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}
    </div>
  );
}
