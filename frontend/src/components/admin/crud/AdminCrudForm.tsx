import { memo, useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import Button from "../../ui/Button";
import TextInput from "../../ui/TextInput";
import type {
  AdminCrudConfig,
  AdminCrudRecord,
  AdminFieldType,
} from "../../../features/admin/crud/adminCrud.types";

type AdminCrudFormProps = {
  config: AdminCrudConfig;
  record: AdminCrudRecord | null;
  isSaving: boolean;
  onCancel: () => void;
  onSubmit: (payload: AdminCrudRecord) => void;
};

const toInputValue = (value: unknown, type?: AdminFieldType) => {
  if (value === null || value === undefined) return "";
  if (type === "month" && typeof value === "string") {
    const monthYearMatch = value.match(/^(0[1-9]|1[0-2])\/(\d{4})$/);
    if (monthYearMatch) return `${monthYearMatch[2]}-${monthYearMatch[1]}`;
  }
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }
  return String(value);
};

const normalizeValue = (type: AdminFieldType, value: string) => {
  if (value.trim() === "") return undefined;
  if (type === "number") return Number(value);
  if (type === "month") {
    const [year, month] = value.split("-");
    return `${month}/${year}`;
  }
  return value.trim();
};

function AdminCrudForm({
  config,
  isSaving,
  onCancel,
  onSubmit,
  record,
}: AdminCrudFormProps) {
  const initialValues = useMemo(
    () =>
      Object.fromEntries(
        config.fields.map((field) => [
          field.name,
          toInputValue(record?.[field.name], field.type),
        ]),
      ),
    [config.fields, record],
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (name: string, value: string) => {
    setValues((current) => {
      const nextValues = { ...current, [name]: value };

      config.fields.forEach((field) => {
        if (field.dependsOn !== name) return;

        const selectedOption = field.options?.find(
          (option) => option.value === nextValues[field.name],
        );

        if (selectedOption?.parentValue && selectedOption.parentValue !== value) {
          nextValues[field.name] = "";
        }
      });

      return nextValues;
    });
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    const payload: AdminCrudRecord = {};

    for (const field of config.fields) {
      const rawValue = values[field.name] ?? "";

      if (field.required && rawValue.trim() === "") {
        nextErrors[field.name] = `${field.label} là bắt buộc`;
        continue;
      }

      const normalized = normalizeValue(field.type, rawValue);
      if (normalized !== undefined) payload[field.name] = normalized;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        {config.fields.map((field) => {
          if (field.type === "select") {
            const dependencyValue = field.dependsOn
              ? values[field.dependsOn]
              : undefined;
            const selectOptions = field.dependsOn
              ? (field.options ?? []).filter(
                  (option) => option.parentValue === dependencyValue,
                )
              : (field.options ?? []);
            const isDependencyMissing =
              Boolean(field.dependsOn) && !dependencyValue;

            return (
              <label key={field.name} className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  {field.label}
                  {field.required ? (
                    <span className="ml-1 text-red-500">*</span>
                  ) : null}
                </span>
                <select
                  className={[
                    "min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition",
                    "hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
                    "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70",
                    errors[field.name]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "",
                  ].join(" ")}
                  disabled={isSaving || isDependencyMissing}
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    setFieldValue(field.name, event.target.value)
                  }
                >
                  <option value="">Chọn giá trị</option>
                  {selectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors[field.name] ? (
                  <p className="text-sm text-red-600">{errors[field.name]}</p>
                ) : null}
              </label>
            );
          }

          if (field.type === "textarea") {
            return (
              <label key={field.name} className="block space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">
                  {field.label}
                  {field.required ? (
                    <span className="ml-1 text-red-500">*</span>
                  ) : null}
                </span>
                <textarea
                  className={[
                    "min-h-24 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition",
                    "placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
                    "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70",
                    errors[field.name]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "",
                  ].join(" ")}
                  disabled={isSaving}
                  placeholder={field.placeholder}
                  value={values[field.name] ?? ""}
                  onChange={(event) =>
                    setFieldValue(field.name, event.target.value)
                  }
                />
                {errors[field.name] ? (
                  <p className="text-sm text-red-600">{errors[field.name]}</p>
                ) : null}
              </label>
            );
          }

          return (
            <TextInput
              key={field.name}
              disabled={isSaving}
              error={errors[field.name]}
              label={`${field.label}${field.required ? " *" : ""}`}
              min={field.min}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required}
              type={field.type}
              value={values[field.name] ?? ""}
              onChange={(event) => setFieldValue(field.name, event.target.value)}
            />
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={isSaving}
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          isLoading={isSaving}
          leftIcon={<Save size={18} aria-hidden="true" />}
        >
          Lưu dữ liệu
        </Button>
      </div>
    </form>
  );
}

export default memo(AdminCrudForm);
