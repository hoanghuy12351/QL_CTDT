import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  coSoIdParamSchema,
  createCoSoSchema,
  updateCoSoSchema,
} from "./coso.validation.js";

export default createAdminResourceRouter({
  resource: "co-so",
  label: "co so",
  createSchema: createCoSoSchema,
  updateSchema: updateCoSoSchema,
  idParamSchema: coSoIdParamSchema,
});
