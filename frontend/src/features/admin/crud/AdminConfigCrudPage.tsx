import AdminCrudPage from "../../../pages/admin/AdminCrudPage";
import { adminCrudConfigs } from "./adminCrud.config";

type AdminConfigCrudPageProps = {
  configKey: "quyDinhHeSoSiSo" | "quyDinhTinhGio" | "dinhMucGiangVien";
};

export default function AdminConfigCrudPage({
  configKey,
}: AdminConfigCrudPageProps) {
  return <AdminCrudPage config={adminCrudConfigs[configKey]} />;
}
