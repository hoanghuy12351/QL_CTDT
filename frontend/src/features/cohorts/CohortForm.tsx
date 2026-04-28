import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import type { Cohort, CohortFormValues } from "./cohort.types";

type CohortFormProps = {
  initialData?: Cohort | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: CohortFormValues) => void;
};

type CohortFormErrors = Partial<Record<keyof CohortFormValues, string>>;

const emptyValues: CohortFormValues = {
  code: "",
  name: "",
  startYear: "",
  endYear: "",
};

const validateCohortForm = (values: CohortFormValues) => {
  const errors: CohortFormErrors = {};

  if (!values.code.trim()) errors.code = "Mã khóa học là bắt buộc";
  if (!values.name.trim()) errors.name = "Tên khóa học là bắt buộc";
  if (!values.startYear.trim()) errors.startYear = "Năm bắt đầu là bắt buộc";
  if (!values.endYear.trim()) errors.endYear = "Năm kết thúc là bắt buộc";

  const startYear = Number(values.startYear);
  const endYear = Number(values.endYear);

  if (values.startYear && Number.isNaN(startYear)) {
    errors.startYear = "Năm bắt đầu không hợp lệ";
  }

  if (values.endYear && Number.isNaN(endYear)) {
    errors.endYear = "Năm kết thúc không hợp lệ";
  }

  if (!errors.startYear && !errors.endYear && startYear > endYear) {
    errors.endYear = "Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu";
  }

  return errors;
};

export default function CohortForm({
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: CohortFormProps) {
  const initialValues = useMemo<CohortFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      code: initialData.code,
      name: initialData.name,
      startYear: String(initialData.startYear),
      endYear: String(initialData.endYear),
    };
  }, [initialData]);

  const [values, setValues] = useState<CohortFormValues>(initialValues);
  const [errors, setErrors] = useState<CohortFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof CohortFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCohortForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      code: values.code.trim(),
      name: values.name.trim(),
      startYear: values.startYear.trim(),
      endYear: values.endYear.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <TextInput
          disabled={isSubmitting}
          error={errors.code}
          label="Mã khóa học *"
          name="code"
          placeholder="VD: K18"
          value={values.code}
          onChange={(event) => setFieldValue("code", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          error={errors.name}
          label="Tên khóa học *"
          name="name"
          placeholder="VD: Khóa 2018-2022"
          value={values.name}
          onChange={(event) => setFieldValue("name", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          error={errors.startYear}
          label="Năm bắt đầu *"
          min={2000}
          name="startYear"
          type="number"
          value={values.startYear}
          onChange={(event) => setFieldValue("startYear", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          error={errors.endYear}
          label="Năm kết thúc *"
          min={2000}
          name="endYear"
          type="number"
          value={values.endYear}
          onChange={(event) => setFieldValue("endYear", event.target.value)}
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
