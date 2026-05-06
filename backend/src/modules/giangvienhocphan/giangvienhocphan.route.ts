import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createGiangVienHocPhanSchema,
  giangVienHocPhanIdParamSchema,
  updateGiangVienHocPhanSchema,
} from "./giangvienhocphan.validation.js";

export default createAdminResourceRouter({
  resource: "giang-vien-hoc-phan",
  label: "giang vien hoc phan",
  createSchema: createGiangVienHocPhanSchema,
  updateSchema: updateGiangVienHocPhanSchema,
  idParamSchema: giangVienHocPhanIdParamSchema,
});
