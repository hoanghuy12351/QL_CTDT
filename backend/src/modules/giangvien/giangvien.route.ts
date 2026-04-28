import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createGiangVienSchema,
  giangVienIdParamSchema,
  updateGiangVienSchema,
} from "./giangvien.validation.js";

export default createAdminResourceRouter({
  resource: "giang-vien",
  label: "giang vien",
  createSchema: createGiangVienSchema,
  updateSchema: updateGiangVienSchema,
  idParamSchema: giangVienIdParamSchema,
});
