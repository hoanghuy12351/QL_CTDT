import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createNganhSchema,
  nganhIdParamSchema,
  updateNganhSchema,
} from "./nganh.validation.js";

export default createAdminResourceRouter({
  resource: "nganh",
  label: "nganh",
  createSchema: createNganhSchema,
  updateSchema: updateNganhSchema,
  idParamSchema: nganhIdParamSchema,
});
