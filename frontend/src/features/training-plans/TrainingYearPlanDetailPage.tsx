import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CalendarPlus, ClipboardList } from "lucide-react";
import { trainingPlansApi } from "../../api/admin/trainingPlans.api";
import ErrorState from "../../components/common/ErrorState";
import Button from "../../components/ui/Button";
import { getApiErrorMessage } from "../../types/api.types";
import {
  statusClassNames,
  trainingPlanStatusLabels,
} from "./trainingPlan.columns";
import SemesterPlanTable from "./SemesterPlanTable";

export default function TrainingYearPlanDetailPage() {
  const params = useParams();
  const planId = Number(params.id);

  const detailQuery = useQuery({
    queryKey: ["training-plan-detail", planId],
    queryFn: () => trainingPlansApi.detail(planId),
    enabled: Number.isFinite(planId) && planId > 0,
  });

  if (!Number.isFinite(planId) || planId <= 0) {
    return (
      <ErrorState
        title="Đường dẫn không hợp lệ"
        description="ID kế hoạch năm học không đúng định dạng."
      />
    );
  }

  if (detailQuery.isError) {
    return (
      <ErrorState
        title="Không tải được chi tiết kế hoạch năm học"
        description={getApiErrorMessage(detailQuery.error, "Vui lòng thử lại sau.")}
        onAction={() => detailQuery.refetch()}
      />
    );
  }

  const detail = detailQuery.data;
  const plan = detail?.plan;

  return (
    <section className="space-y-4">
      <div className="text-sm">
        <Link className="font-medium text-slate-500 hover:text-brand-700" to="/admin/training/plans/year">
          Kế hoạch năm học
        </Link>
        <span className="mx-2 text-slate-300">/</span>
        <span className="font-semibold text-slate-950">{plan?.name ?? "Đang tải..."}</span>
      </div>

      <header className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
              <ClipboardList size={22} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-950">{plan?.name ?? "Đang tải kế hoạch"}</h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                Xem thông tin tổng quan và các kế hoạch học kỳ trực thuộc.
              </p>
            </div>
          </div>
          <Link to={`/admin/training/plans/semesters?yearPlanId=${planId}`}>
            <Button leftIcon={<CalendarPlus size={16} aria-hidden="true" />}>
              Tạo kế hoạch học kỳ
            </Button>
          </Link>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Mã kế hoạch</p>
          <p className="mt-2 text-base font-bold text-slate-950">{plan?.code ?? "-"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Năm học</p>
          <p className="mt-2 text-base font-bold text-slate-950">{plan?.schoolYearName ?? "-"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Trạng thái</p>
          {plan ? (
            <span className={["mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1", statusClassNames[plan.status]].join(" ")}>
              {trainingPlanStatusLabels[plan.status]}
            </span>
          ) : (
            <p className="mt-2 text-base font-bold text-slate-950">-</p>
          )}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Học kỳ</p>
          <p className="mt-2 text-base font-bold text-slate-950">{detail?.semesterPlans.length ?? 0}</p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-950">Thông tin chung</h2>
        <dl className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Khoa</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-950">{plan?.facultyName ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Ghi chú</dt>
            <dd className="mt-1 text-sm text-slate-700">{plan?.note || "Không có ghi chú"}</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-slate-950">Kế hoạch học kỳ thuộc năm học</h2>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách học kỳ đang trực thuộc kế hoạch năm học này.
          </p>
        </div>
        <SemesterPlanTable rows={detail?.semesterPlans ?? []} isLoading={detailQuery.isLoading} />
      </section>
    </section>
  );
}
