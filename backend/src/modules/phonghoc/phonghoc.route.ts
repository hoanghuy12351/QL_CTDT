import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createPhongHocSchema,
  phongHocIdParamSchema,
  updatePhongHocSchema,
} from "./phonghoc.validation.js";

export default createAdminResourceRouter({
  resource: "phong-hoc",
  label: "phong hoc",
  createSchema: createPhongHocSchema,
  updateSchema: updatePhongHocSchema,
  idParamSchema: phongHocIdParamSchema,
});
