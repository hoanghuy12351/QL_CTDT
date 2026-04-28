import { GraduationCap } from "lucide-react";
import { cohortsApi } from "../../api/admin/cohorts.api";
import EntityManagementPage from "../../components/common/EntityManagementPage";
import CohortForm from "./CohortForm";
import CohortTable from "./CohortTable";
import type { Cohort, CohortFormValues } from "./cohort.types";

export default function CohortPage() {
  return (
    <EntityManagementPage<Cohort, CohortFormValues>
      title="Khóa học"
      description="Quản lý mã khóa học, tên khóa học và khoảng năm bắt đầu - kết thúc."
      icon={GraduationCap}
      searchPlaceholder="Tìm mã khóa học, tên khóa học..."
      queryKeyBase="cohorts"
      emptyDescription="Thêm khóa học đầu tiên để liên kết với lớp và chương trình đào tạo."
      createActionLabel="Thêm khóa học"
      queryFn={cohortsApi.list}
      createFn={cohortsApi.create}
      updateFn={cohortsApi.update}
      deleteFn={(cohort) => cohortsApi.remove(cohort.id)}
      formComponent={CohortForm}
      tableComponent={CohortTable}
      getItemName={(cohort) => cohort.name}
    />
  );
}
