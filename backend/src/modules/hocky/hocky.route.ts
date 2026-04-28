import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createHocKySchema,
  hocKyIdParamSchema,
  updateHocKySchema,
} from "./hocky.validation.js";

export default createAdminResourceRouter({
  resource: "hoc-ky",
  label: "hoc ky",
  createSchema: createHocKySchema,
  updateSchema: updateHocKySchema,
  idParamSchema: hocKyIdParamSchema,
});
