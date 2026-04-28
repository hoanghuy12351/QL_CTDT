import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createNamHocSchema,
  namHocIdParamSchema,
  updateNamHocSchema,
} from "./namhoc.validation.js";

export default createAdminResourceRouter({
  resource: "nam-hoc",
  label: "nam hoc",
  createSchema: createNamHocSchema,
  updateSchema: updateNamHocSchema,
  idParamSchema: namHocIdParamSchema,
});
