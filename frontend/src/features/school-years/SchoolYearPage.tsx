import { CalendarDays } from "lucide-react";
import { schoolYearsApi } from "../../api/admin/schoolYears.api";
import EntityManagementPage from "../../components/common/EntityManagementPage";
import SchoolYearForm from "./SchoolYearForm";
import SchoolYearTable from "./SchoolYearTable";
import type { SchoolYear, SchoolYearFormValues } from "./schoolYear.types";

export default function SchoolYearPage() {
  return (
    <EntityManagementPage<SchoolYear, SchoolYearFormValues>
      title="Năm học"
      description="Quản lý năm học theo thời gian bắt đầu, kết thúc và trạng thái áp dụng."
      icon={CalendarDays}
      searchPlaceholder="Tìm mã năm học, trạng thái..."
      queryKeyBase="school-years"
      emptyDescription="Thêm năm học đầu tiên để lập học kỳ và kế hoạch đào tạo."
      createActionLabel="Thêm năm học"
      queryFn={schoolYearsApi.list}
      createFn={schoolYearsApi.create}
      updateFn={schoolYearsApi.update}
      deleteFn={(schoolYear) => schoolYearsApi.remove(schoolYear.id)}
      formComponent={SchoolYearForm}
      tableComponent={SchoolYearTable}
      getItemName={(schoolYear) => schoolYear.code}
    />
  );
}
