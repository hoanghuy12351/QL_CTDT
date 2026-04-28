import type { AdminFeature } from "./adminFeature.types";

export function getAdminFeatureTitle(feature: Pick<AdminFeature, "name">) {
  return feature.name.trim();
}

