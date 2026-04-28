import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createKhoaSchema,
  khoaIdParamSchema,
  updateKhoaSchema,
} from "./khoa.validation.js";

export default createAdminResourceRouter({
  resource: "khoa",
  label: "khoa",
  createSchema: createKhoaSchema,
  updateSchema: updateKhoaSchema,
  idParamSchema: khoaIdParamSchema,
});
