import { Building2 } from "lucide-react";
import { campusesApi } from "../../api/admin/campuses.api";
import EntityManagementPage from "../../components/common/EntityManagementPage";
import CampusForm from "./CampusForm";
import CampusTable from "./CampusTable";
import type { Campus, CampusFormValues } from "./campus.types";

export default function CampusPage() {
  return (
    <EntityManagementPage<Campus, CampusFormValues>
      title="Cơ sở"
      description="Quản lý các cơ sở đào tạo, mã cơ sở và địa chỉ phục vụ lớp, phòng học."
      icon={Building2}
      searchPlaceholder="Tìm mã cơ sở, tên cơ sở, địa chỉ..."
      queryKeyBase="campuses"
      emptyDescription="Thêm cơ sở đầu tiên để liên kết với lớp học và phòng học."
      createActionLabel="Thêm cơ sở"
      queryFn={campusesApi.list}
      createFn={campusesApi.create}
      updateFn={campusesApi.update}
      deleteFn={(campus) => campusesApi.remove(campus.id)}
      formComponent={CampusForm}
      tableComponent={CampusTable}
      getItemName={(campus) => campus.name}
    />
  );
}
