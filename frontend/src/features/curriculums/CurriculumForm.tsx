import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import type { Curriculum, CurriculumFormValues } from "./curriculum.types";

type CurriculumFormProps = {
  initialData?: Curriculum | null;
  isSubmitting?: boolean;
  majorOptions: SelectOption[];
  specializationOptions: SelectOption[];
  cohortOptions: SelectOption[];
  onCancel: () => void;
  onSubmit: (values: CurriculumFormValues) => void;
};

type CurriculumFormErrors = Partial<Record<keyof CurriculumFormValues, string>>;

const emptyValues: CurriculumFormValues = {
  code: "",
  name: "",
  majorId: "",
  specializationId: "",
  cohortId: "",
  totalCredits: "",
  educationLevel: "Đại học",
  trainingType: "Chính quy",
  status: "du_thao",
  description: "",
};

const validateForm = (values: CurriculumFormValues) => {
  const errors: CurriculumFormErrors = {};

  if (!values.code.trim()) errors.code = "Mã CTĐT là bắt buộc";
  if (!values.name.trim()) errors.name = "Tên chương trình là bắt buộc";
  if (!values.majorId) errors.majorId = "Ngành là bắt buộc";
  if (values.totalCredits && Number(values.totalCredits) < 0) {
    errors.totalCredits = "Tổng tín chỉ không hợp lệ";
  }

  return errors;
};

export default function CurriculumForm({
  cohortOptions,
  initialData,
  isSubmitting = false,
  majorOptions,
  onCancel,
  onSubmit,
  specializationOptions,
}: CurriculumFormProps) {
  const initialValues = useMemo<CurriculumFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      code: initialData.code,
      name: initialData.name,
      majorId: String(initialData.majorId),
      specializationId: initialData.specializationId
        ? String(initialData.specializationId)
        : "",
      cohortId: initialData.cohortId ? String(initialData.cohortId) : "",
      totalCredits: initialData.totalCredits ? String(initialData.totalCredits) : "",
      educationLevel: initialData.educationLevel,
      trainingType: initialData.trainingType,
      status: initialData.status,
      description: initialData.description,
    };
  }, [initialData]);

  const [values, setValues] = useState<CurriculumFormValues>(initialValues);
  const [errors, setErrors] = useState<CurriculumFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof CurriculumFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...values,
      code: values.code.trim(),
      name: values.name.trim(),
      educationLevel: values.educationLevel.trim(),
      trainingType: values.trainingType.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <TextInput
          disabled={isSubmitting}
          error={errors.code}
          label="Mã CTĐT *"
          name="code"
          placeholder="VD: CTDT-CNTT-K22"
          value={values.code}
          onChange={(event) => setFieldValue("code", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          error={errors.name}
          label="Tên chương trình *"
          name="name"
          placeholder="VD: Công nghệ thông tin K22"
          value={values.name}
          onChange={(event) => setFieldValue("name", event.target.value)}
        />
        <SelectInput
          disabled={isSubmitting}
          error={errors.majorId}
          label="Ngành *"
          name="majorId"
          options={majorOptions}
          value={values.majorId}
          onChange={(event) => setFieldValue("majorId", event.target.value)}
        />
        <SelectInput
          disabled={isSubmitting}
          label="Chuyên ngành"
          name="specializationId"
          options={specializationOptions}
          placeholder="Không chọn"
          value={values.specializationId}
          onChange={(event) => setFieldValue("specializationId", event.target.value)}
        />
        <SelectInput
          disabled={isSubmitting}
          label="Khóa học"
          name="cohortId"
          options={cohortOptions}
          placeholder="Không chọn"
          value={values.cohortId}
          onChange={(event) => setFieldValue("cohortId", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          error={errors.totalCredits}
          label="Tổng tín chỉ"
          min={0}
          name="totalCredits"
          type="number"
          value={values.totalCredits}
          onChange={(event) => setFieldValue("totalCredits", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          label="Trình độ đào tạo"
          name="educationLevel"
          value={values.educationLevel}
          onChange={(event) => setFieldValue("educationLevel", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          label="Hình thức đào tạo"
          name="trainingType"
          value={values.trainingType}
          onChange={(event) => setFieldValue("trainingType", event.target.value)}
        />
        <SelectInput
          disabled={isSubmitting}
          label="Trạng thái"
          name="status"
          options={[
            { label: "Dự thảo", value: "du_thao" },
            { label: "Đang áp dụng", value: "dang_ap_dung" },
            { label: "Lưu trữ", value: "luu_tru" },
          ]}
          value={values.status}
          onChange={(event) =>
            setFieldValue("status", event.target.value as CurriculumFormValues["status"])
          }
        />
      </div>

      <TextareaInput
        disabled={isSubmitting}
        label="Ghi chú"
        name="description"
        placeholder="Phạm vi áp dụng, điều kiện hoặc lưu ý khi triển khai CTĐT"
        value={values.description}
        onChange={(event) => setFieldValue("description", event.target.value)}
      />

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
