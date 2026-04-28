import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  createChuyenNganhSchema,
  chuyenNganhIdParamSchema,
  updateChuyenNganhSchema,
} from "./chuyennganh.validation.js";

export default createAdminResourceRouter({
  resource: "chuyen-nganh",
  label: "chuyen nganh",
  createSchema: createChuyenNganhSchema,
  updateSchema: updateChuyenNganhSchema,
  idParamSchema: chuyenNganhIdParamSchema,
});
