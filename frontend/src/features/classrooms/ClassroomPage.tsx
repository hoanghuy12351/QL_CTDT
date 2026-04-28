import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DoorOpen } from "lucide-react";
import { campusesApi } from "../../api/admin/campuses.api";
import { classroomsApi } from "../../api/admin/classrooms.api";
import EntityManagementPage from "../../components/common/EntityManagementPage";
import { buildSelectOptions } from "../admin/crud/adminCrudPage.utils";
import type { AdminSelectOption } from "../admin/crud/adminCrud.types";
import ClassroomForm from "./ClassroomForm";
import ClassroomTable from "./ClassroomTable";
import type { Classroom, ClassroomFormValues } from "./classroom.types";

export default function ClassroomPage() {
  const campusesQuery = useQuery({
    queryKey: ["campus-options"],
    queryFn: () => campusesApi.list({ page: 1, limit: 100 }),
  });

  const campusOptions = useMemo<AdminSelectOption[]>(
    () =>
      buildSelectOptions(campusesQuery.data?.items ?? [], "id", (campus) =>
        `${String(campus.code ?? "")} - ${String(campus.name ?? "")}`,
      ),
    [campusesQuery.data?.items],
  );

  return (
    <EntityManagementPage<Classroom, ClassroomFormValues, { campusOptions: AdminSelectOption[] }>
      title="Phòng học"
      description="Quản lý phòng học theo cơ sở, loại phòng và sức chứa sử dụng trong lịch dạy."
      icon={DoorOpen}
      searchPlaceholder="Tìm mã phòng, tên phòng, loại phòng..."
      queryKeyBase="classrooms"
      emptyDescription="Thêm phòng học đầu tiên để sẵn sàng cho lịch dạy và kế hoạch mở lớp."
      createActionLabel="Thêm phòng học"
      queryFn={classroomsApi.list}
      createFn={classroomsApi.create}
      updateFn={classroomsApi.update}
      deleteFn={(classroom) => classroomsApi.remove(classroom.id)}
      formComponent={ClassroomForm}
      formProps={{ campusOptions }}
      tableComponent={ClassroomTable}
      getItemName={(classroom) => classroom.code}
      extraSummary={
        <span className="rounded-md bg-brand-50 px-2.5 py-1 text-brand-700">
          {campusesQuery.data?.items.length ?? 0} cơ sở tham chiếu
        </span>
      }
    />
  );
}
