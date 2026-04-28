import { createAdminResourceRouter } from "../admin-crud/admin-resource-route.factory.js";
import {
  boMonIdParamSchema,
  createBoMonSchema,
  updateBoMonSchema,
} from "./bomon.validation.js";

export default createAdminResourceRouter({
  resource: "bo-mon",
  label: "bo mon",
  createSchema: createBoMonSchema,
  updateSchema: updateBoMonSchema,
  idParamSchema: boMonIdParamSchema,
});
