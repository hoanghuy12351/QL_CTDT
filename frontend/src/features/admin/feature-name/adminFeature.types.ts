export type AdminFeatureStatus = "active" | "inactive";

export type AdminFeature = {
  id: string;
  name: string;
  description?: string;
  status: AdminFeatureStatus;
  createdAt: string;
  updatedAt: string;
};

export type AdminFeatureFormValues = {
  name: string;
  description?: string;
  status: AdminFeatureStatus;
};

