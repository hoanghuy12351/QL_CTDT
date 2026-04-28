import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createLopSchema,
  lopIdParamSchema,
  updateLopSchema,
} from "./lop.validation.js";

export default createAdminResourceRouter({
  resource: "lop",
  label: "lop",
  createSchema: createLopSchema,
  updateSchema: updateLopSchema,
  idParamSchema: lopIdParamSchema,
});
