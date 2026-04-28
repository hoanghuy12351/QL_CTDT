import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import type { SchoolYear, SchoolYearFormValues } from "./schoolYear.types";

type SchoolYearFormProps = {
  initialData?: SchoolYear | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: SchoolYearFormValues) => void;
};

type SchoolYearFormErrors = Partial<Record<keyof SchoolYearFormValues, string>>;

const emptyValues: SchoolYearFormValues = {
  code: "",
  startDate: "",
  endDate: "",
  status: "",
};

const statusOptions = [
  { label: "Dự thảo", value: "du_thao" },
  { label: "Đang áp dụng", value: "dang_ap_dung" },
  { label: "Đã đóng", value: "da_dong" },
];

const validateSchoolYearForm = (values: SchoolYearFormValues) => {
  const errors: SchoolYearFormErrors = {};
  if (!values.code.trim()) errors.code = "Mã năm học là bắt buộc";
  if (values.startDate && values.endDate && values.startDate > values.endDate) {
    errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
  }
  return errors;
};

const toDateInputValue = (value: string | null) => value?.slice(0, 10) ?? "";

export default function SchoolYearForm({
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: SchoolYearFormProps) {
  const initialValues = useMemo<SchoolYearFormValues>(() => {
    if (!initialData) return emptyValues;
    return {
      code: initialData.code,
      startDate: toDateInputValue(initialData.startDate),
      endDate: toDateInputValue(initialData.endDate),
      status: initialData.status ?? "",
    };
  }, [initialData]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<SchoolYearFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof SchoolYearFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateSchoolYearForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      code: values.code.trim(),
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <TextInput disabled={isSubmitting} error={errors.code} label="Mã năm học *" name="code" placeholder="VD: 2025-2026" value={values.code} onChange={(event) => setFieldValue("code", event.target.value)} />
        <SelectInput disabled={isSubmitting} error={errors.status} label="Trạng thái" name="status" options={statusOptions} value={values.status} onChange={(event) => setFieldValue("status", event.target.value)} />
        <TextInput disabled={isSubmitting} error={errors.startDate} label="Ngày bắt đầu" name="startDate" type="date" value={values.startDate} onChange={(event) => setFieldValue("startDate", event.target.value)} />
        <TextInput disabled={isSubmitting} error={errors.endDate} label="Ngày kết thúc" name="endDate" type="date" value={values.endDate} onChange={(event) => setFieldValue("endDate", event.target.value)} />
      </div>
      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Save size={18} aria-hidden="true" />}>Lưu dữ liệu</Button>
      </div>
    </form>
  );
}
