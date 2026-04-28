import type { LucideIcon } from "lucide-react";

export type AdminFieldType =
  | "text"
  | "number"
  | "email"
  | "textarea"
  | "select"
  | "date"
  | "month";

export type AdminSelectOption = {
  label: string;
  value: string;
  parentValue?: string;
};

export type AdminCrudField = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  placeholder?: string;
  options?: AdminSelectOption[];
  dependsOn?: string;
  dependencyPlaceholder?: string;
  min?: number;
};

export type AdminTableColumn = {
  key: string;
  label: string;
  fallback?: string;
};

export type AdminCrudConfig = {
  resource: string;
  path: string;
  title: string;
  description: string;
  primaryAction: string;
  icon: LucideIcon;
  idField: string;
  searchPlaceholder: string;
  fields: AdminCrudField[];
  columns: AdminTableColumn[];
};

export type AdminCrudRecord = Record<string, unknown>;

export type PaginationMeta = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type AdminCrudListResult = {
  items: AdminCrudRecord[];
  pagination: PaginationMeta;
};
