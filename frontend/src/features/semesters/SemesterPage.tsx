import { CalendarRange } from "lucide-react";
import { semestersApi } from "../../api/admin/semesters.api";
import EntityManagementPage from "../../components/common/EntityManagementPage";
import SemesterForm from "./SemesterForm";
import SemesterTable from "./SemesterTable";
import type { Semester, SemesterFormValues } from "./semester.types";

export default function SemesterPage() {
  return (
    <EntityManagementPage<Semester, SemesterFormValues>
      title="Học kỳ"
      description="Quản lý học kỳ mẫu theo ngày/tháng. Năm học thực tế sẽ lấy theo kế hoạch đào tạo."
      icon={CalendarRange}
      searchPlaceholder="Tìm mã học kỳ, tên học kỳ, trạng thái..."
      queryKeyBase="semesters"
      emptyDescription="Thêm học kỳ đầu tiên để phục vụ kế hoạch đào tạo."
      createActionLabel="Thêm học kỳ"
      queryFn={semestersApi.list}
      createFn={semestersApi.create}
      updateFn={semestersApi.update}
      deleteFn={(semester) => semestersApi.remove(semester.id)}
      formComponent={SemesterForm}
      tableComponent={SemesterTable}
      getItemName={(semester) => semester.name}
    />
  );
}
