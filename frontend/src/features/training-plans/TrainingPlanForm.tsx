import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import type { TrainingPlan, TrainingPlanFormValues } from "./trainingPlan.types";

type TrainingPlanFormProps = {
  initialData?: TrainingPlan | null;
  schoolYearOptions: SelectOption[];
  facultyOptions: SelectOption[];
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: TrainingPlanFormValues) => void;
};

const emptyValues: TrainingPlanFormValues = {
  code: "",
  name: "",
  schoolYearId: "",
  facultyId: "",
  status: "du_thao",
  note: "",
};

export default function TrainingPlanForm({
  facultyOptions,
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
  schoolYearOptions,
}: TrainingPlanFormProps) {
  const initialValues = useMemo<TrainingPlanFormValues>(() => {
    if (!initialData) return emptyValues;
    return {
      code: initialData.code,
      name: initialData.name,
      schoolYearId: String(initialData.schoolYearId),
      facultyId: String(initialData.facultyId),
      status: initialData.status,
      note: initialData.note,
    };
  }, [initialData]);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TrainingPlanFormValues, string>>>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setField = (field: keyof TrainingPlanFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!values.code.trim()) nextErrors.code = "Mã kế hoạch là bắt buộc";
    if (!values.name.trim()) nextErrors.name = "Tên kế hoạch là bắt buộc";
    if (!values.schoolYearId) nextErrors.schoolYearId = "Năm học là bắt buộc";
    if (!values.facultyId) nextErrors.facultyId = "Khoa là bắt buộc";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({ ...values, code: values.code.trim(), name: values.name.trim(), note: values.note.trim() });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <TextInput label="Mã kế hoạch *" error={errors.code} disabled={isSubmitting} value={values.code} onChange={(event) => setField("code", event.target.value)} />
        <TextInput label="Tên kế hoạch *" error={errors.name} disabled={isSubmitting} value={values.name} onChange={(event) => setField("name", event.target.value)} />
        <SelectInput label="Năm học *" error={errors.schoolYearId} disabled={isSubmitting} options={schoolYearOptions} value={values.schoolYearId} onChange={(event) => setField("schoolYearId", event.target.value)} />
        <SelectInput label="Khoa *" error={errors.facultyId} disabled={isSubmitting} options={facultyOptions} value={values.facultyId} onChange={(event) => setField("facultyId", event.target.value)} />
        <SelectInput
          label="Trạng thái"
          disabled={isSubmitting}
          options={[
            { label: "Dự thảo", value: "du_thao" },
            { label: "Đã duyệt", value: "da_duyet" },
            { label: "Đang thực hiện", value: "dang_thuc_hien" },
            { label: "Đã đóng", value: "da_dong" },
          ]}
          value={values.status}
          onChange={(event) => setField("status", event.target.value)}
        />
      </div>
      <TextareaInput label="Ghi chú" disabled={isSubmitting} value={values.note} onChange={(event) => setField("note", event.target.value)} />
      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Save size={18} aria-hidden="true" />}>Lưu dữ liệu</Button>
      </div>
    </form>
  );
}
