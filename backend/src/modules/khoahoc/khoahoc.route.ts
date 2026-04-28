import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createKhoaHocSchema,
  khoaHocIdParamSchema,
  updateKhoaHocSchema,
} from "./khoahoc.validation.js";

export default createAdminResourceRouter({
  resource: "khoa-hoc",
  label: "khoa hoc",
  createSchema: createKhoaHocSchema,
  updateSchema: updateKhoaHocSchema,
  idParamSchema: khoaHocIdParamSchema,
});
