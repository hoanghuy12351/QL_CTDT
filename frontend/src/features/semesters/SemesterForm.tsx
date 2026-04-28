import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import type { AdminSelectOption } from "../admin/crud/adminCrud.types";
import type { Semester, SemesterFormValues } from "./semester.types";

type SemesterFormProps = {
  initialData?: Semester | null;
  schoolYearOptions: AdminSelectOption[];
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: SemesterFormValues) => void;
};

type SemesterFormErrors = Partial<Record<keyof SemesterFormValues, string>>;

const emptyValues: SemesterFormValues = {
  schoolYearId: "",
  code: "",
  name: "",
  startDate: "",
  endDate: "",
  status: "",
};

const statusOptions = [
  { label: "Dự thảo", value: "du_thao" },
  { label: "Đang áp dụng", value: "dang_ap_dung" },
  { label: "Đã đóng", value: "da_dong" },
];

const toDateInputValue = (value: string | null) => value?.slice(0, 10) ?? "";

const validateSemesterForm = (values: SemesterFormValues) => {
  const errors: SemesterFormErrors = {};

  if (!values.schoolYearId) errors.schoolYearId = "Năm học là bắt buộc";
  if (!values.code.trim()) errors.code = "Mã học kỳ là bắt buộc";
  if (!values.name.trim()) errors.name = "Tên học kỳ là bắt buộc";
  if (values.startDate && values.endDate && values.startDate > values.endDate) {
    errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
  }

  return errors;
};

export default function SemesterForm({
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
  schoolYearOptions,
}: SemesterFormProps) {
  const initialValues = useMemo<SemesterFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      schoolYearId: String(initialData.schoolYearId),
      code: initialData.code,
      name: initialData.name,
      startDate: toDateInputValue(initialData.startDate),
      endDate: toDateInputValue(initialData.endDate),
      status: initialData.status ?? "",
    };
  }, [initialData]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<SemesterFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof SemesterFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateSemesterForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      schoolYearId: values.schoolYearId,
      code: values.code.trim(),
      name: values.name.trim(),
      startDate: values.startDate,
      endDate: values.endDate,
      status: values.status,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <SelectInput
          disabled={isSubmitting}
          error={errors.schoolYearId}
          label="Năm học"
          name="schoolYearId"
          placeholder="Chọn năm học"
          required
          options={schoolYearOptions}
          value={values.schoolYearId}
          onChange={(event) => setFieldValue("schoolYearId", event.target.value)}
        />

        <SelectInput
          disabled={isSubmitting}
          error={errors.status}
          label="Trạng thái"
          name="status"
          placeholder="Chọn trạng thái"
          options={statusOptions}
          value={values.status}
          onChange={(event) => setFieldValue("status", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.code}
          label="Mã học kỳ *"
          name="code"
          placeholder="VD: HK1"
          value={values.code}
          onChange={(event) => setFieldValue("code", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.name}
          label="Tên học kỳ *"
          name="name"
          placeholder="VD: Học kỳ 1"
          value={values.name}
          onChange={(event) => setFieldValue("name", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.startDate}
          label="Ngày bắt đầu"
          name="startDate"
          type="date"
          value={values.startDate}
          onChange={(event) => setFieldValue("startDate", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.endDate}
          label="Ngày kết thúc"
          name="endDate"
          type="date"
          value={values.endDate}
          onChange={(event) => setFieldValue("endDate", event.target.value)}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Save size={18} aria-hidden="true" />}>
          Lưu dữ liệu
        </Button>
      </div>
    </form>
  );
}
