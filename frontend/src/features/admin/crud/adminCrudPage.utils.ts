import type {
  AdminCrudRecord,
  AdminSelectOption,
} from "./adminCrud.types";

export const buildSelectOptions = (
  rows: AdminCrudRecord[],
  idKey: string,
  labelBuilder: (row: AdminCrudRecord) => string,
): AdminSelectOption[] =>
  rows.map((row) => ({
    value: String(row[idKey] ?? ""),
    label: labelBuilder(row),
  }));
