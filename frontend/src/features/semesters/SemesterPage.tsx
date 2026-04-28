import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarRange } from "lucide-react";
import { schoolYearsApi } from "../../api/admin/schoolYears.api";
import { semestersApi } from "../../api/admin/semesters.api";
import EntityManagementPage from "../../components/common/EntityManagementPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type { AdminSelectOption } from "../admin/crud/adminCrud.types";
import SemesterForm from "./SemesterForm";
import SemesterTable from "./SemesterTable";
import type { Semester, SemesterFormValues } from "./semester.types";

export default function SemesterPage() {
  const schoolYearsQuery = useQuery({
    queryKey: ["school-year-options"],
    queryFn: () => schoolYearsApi.list({ page: 1, limit: 100 }),
  });

  const schoolYearOptions = useMemo<AdminSelectOption[]>(
    () =>
      buildSelectOptions(schoolYearsQuery.data?.items ?? [], "id", (schoolYear) =>
        String(schoolYear.code ?? ""),
      ),
    [schoolYearsQuery.data?.items],
  );

  return (
    <EntityManagementPage<Semester, SemesterFormValues, { schoolYearOptions: AdminSelectOption[] }>
      title="Học kỳ"
      description="Quản lý học kỳ thuộc năm học, thời gian bắt đầu - kết thúc và trạng thái vận hành."
      icon={CalendarRange}
      searchPlaceholder="Tìm mã học kỳ, tên học kỳ, trạng thái..."
      queryKeyBase="semesters"
      emptyDescription="Thêm học kỳ đầu tiên để phục vụ kế hoạch đào tạo theo năm học."
      createActionLabel="Thêm học kỳ"
      queryFn={semestersApi.list}
      createFn={semestersApi.create}
      updateFn={semestersApi.update}
      deleteFn={(semester) => semestersApi.remove(semester.id)}
      formComponent={SemesterForm}
      formProps={{ schoolYearOptions }}
      tableComponent={SemesterTable}
      getItemName={(semester) => semester.name}
      extraSummary={
        <span className="rounded-md bg-brand-50 px-2.5 py-1 text-brand-700">
          {schoolYearsQuery.data?.items.length ?? 0} năm học tham chiếu
        </span>
      }
    />
  );
}
