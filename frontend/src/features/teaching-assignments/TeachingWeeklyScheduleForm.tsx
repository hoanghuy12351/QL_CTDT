import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarDays, Save } from "lucide-react";
import Button from "../../components/ui/Button";
import type {
  AssignmentWeeklyScheduleDetailDto,
  ClassroomOption,
  TeachingAssignment,
  WeeklyScheduleFormRow,
  WeeklyScheduleSaveValues,
} from "./teachingAssignment.types";

type TeachingWeeklyScheduleFormProps = {
  assignment: TeachingAssignment;
  detail?: AssignmentWeeklyScheduleDetailDto;
  classrooms: ClassroomOption[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: WeeklyScheduleSaveValues) => void;
};

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatDateRange = (start?: string | null, end?: string | null) => {
  if (!start && !end) return "";

  const format = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  const startText = format(start);
  const endText = format(end);

  if (startText && endText) return `${startText} - ${endText}`;
  return startText || endText;
};

export default function TeachingWeeklyScheduleForm({
  assignment,
  classrooms,
  detail,
  isLoading = false,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: TeachingWeeklyScheduleFormProps) {
  const initialRows = useMemo<WeeklyScheduleFormRow[]>(() => {
    if (!detail) return [];

    const scheduleByWeek = new Map(
      detail.lichDaPhanBo.map((item) => [item.tuanId, item]),
    );

    return detail.tuanDaoTao.map((week) => {
      const schedule = scheduleByWeek.get(week.tuanId);

      return {
        tuanId: week.tuanId,
        weekNumber: week.soTuan,
        weekName: week.tenTuan || `Tuần ${week.soTuan}`,
        dateRange: formatDateRange(week.ngayBatDau, week.ngayKetThuc),
        phongHocId: schedule?.phongHocId ? String(schedule.phongHocId) : "",
        soTiet:
          schedule?.soTiet !== undefined && schedule?.soTiet !== null
            ? String(schedule.soTiet)
            : "",
        noiDungGiangDay: schedule?.noiDungGiangDay ?? "",
        ghiChu: schedule?.ghiChu ?? "",
      };
    });
  }, [detail]);

  const [rows, setRows] = useState<WeeklyScheduleFormRow[]>(initialRows);
  const [error, setError] = useState("");

  useEffect(() => {
    setRows(initialRows);
    setError("");
  }, [initialRows]);

  const totalPeriods = useMemo(
    () => rows.reduce((total, row) => total + toNumber(row.soTiet, 0), 0),
    [rows],
  );

  const remainingPeriods = assignment.assignedPeriods - totalPeriods;

  const setRowField = (
    index: number,
    field: keyof WeeklyScheduleFormRow,
    value: string,
  ) => {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (rows.length === 0) {
      setError("Chưa có tuần đào tạo để phân bổ.");
      return;
    }

    if (Math.abs(totalPeriods - assignment.assignedPeriods) > 0.001) {
      setError(
        `Tổng số tiết theo tuần phải bằng số tiết phân công (${assignment.assignedPeriods} tiết). Hiện tại đang là ${totalPeriods} tiết.`,
      );
      return;
    }

    const lich = rows
      .filter((row) => toNumber(row.soTiet, 0) > 0)
      .map((row) => ({
        tuanId: row.tuanId,
        phongHocId: row.phongHocId ? Number(row.phongHocId) : undefined,
        soTiet: toNumber(row.soTiet, 0),
        noiDungGiangDay: row.noiDungGiangDay.trim() || undefined,
        ghiChu: row.ghiChu.trim() || undefined,
      }));

    if (lich.length === 0) {
      setError("Cần nhập ít nhất một tuần có số tiết lớn hơn 0.");
      return;
    }

    onSubmit({
      phanCongId: assignment.id,
      lich,
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
        Đang tải danh sách tuần đào tạo...
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
            <CalendarDays size={20} aria-hidden="true" />
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-slate-900">
              {assignment.lecturerName} / {assignment.group?.name}
            </div>
            <div className="mt-1">
              {assignment.group?.className} / {assignment.group?.courseName}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700">
                Phân công: {assignment.assignedPeriods} tiết
              </span>
              <span
                className={[
                  "rounded-md px-2.5 py-1",
                  remainingPeriods === 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700",
                ].join(" ")}
              >
                Đã phân bổ: {totalPeriods} tiết
              </span>
              <span
                className={[
                  "rounded-md px-2.5 py-1",
                  remainingPeriods === 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700",
                ].join(" ")}
              >
                Còn lại: {remainingPeriods} tiết
              </span>
            </div>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-auto">
          <table className="w-full min-w-[980px] table-fixed text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Tuần
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Thời gian
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Số tiết
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Phòng
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Nội dung
                </th>
                <th className="border-b border-slate-200 px-3 py-3 font-semibold">
                  Ghi chú
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {rows.map((row, index) => (
                <tr key={row.tuanId} className="bg-white hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <span className="block font-semibold text-slate-950">
                      {row.weekName}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Tuần {row.weekNumber}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-slate-600">
                    {row.dateRange || "-"}
                  </td>

                  <td className="px-3 py-3">
                    <input
                      min={0}
                      step="0.5"
                      type="number"
                      disabled={isSubmitting}
                      value={row.soTiet}
                      onChange={(event) =>
                        setRowField(index, "soTiet", event.target.value)
                      }
                      className="min-h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-100"
                    />
                  </td>

                  <td className="px-3 py-3">
                    <select
                      disabled={isSubmitting}
                      value={row.phongHocId}
                      onChange={(event) =>
                        setRowField(index, "phongHocId", event.target.value)
                      }
                      className="min-h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-100"
                    >
                      <option value="">Chưa chọn</option>
                      {classrooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.code} {room.name ? `- ${room.name}` : ""}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-3 py-3">
                    <input
                      disabled={isSubmitting}
                      value={row.noiDungGiangDay}
                      placeholder="Nội dung giảng dạy"
                      onChange={(event) =>
                        setRowField(
                          index,
                          "noiDungGiangDay",
                          event.target.value,
                        )
                      }
                      className="min-h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-100"
                    />
                  </td>

                  <td className="px-3 py-3">
                    <input
                      disabled={isSubmitting}
                      value={row.ghiChu}
                      placeholder="Ghi chú"
                      onChange={(event) =>
                        setRowField(index, "ghiChu", event.target.value)
                      }
                      className="min-h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-100"
                    />
                  </td>
                </tr>
              ))}

              {rows.length === 0 ? (
                <tr>
                  <td
                    className="px-3 py-8 text-center text-sm text-slate-500"
                    colSpan={6}
                  >
                    Chưa có tuần đào tạo cho kế hoạch năm học này.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Hủy
        </Button>

        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Save size={18} aria-hidden="true" />}
        >
          Lưu phân bổ tuần
        </Button>
      </div>
    </form>
  );
}
