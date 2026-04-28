import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import type { CurriculumCourse, CurriculumCourseFormValues } from "./curriculum.types";

type CurriculumCourseFormProps = {
  initialData?: CurriculumCourse | null;
  isSubmitting?: boolean;
  courseOptions: SelectOption[];
  onCancel?: () => void;
  onSubmit: (values: CurriculumCourseFormValues) => void;
};

type FormErrors = Partial<Record<keyof CurriculumCourseFormValues, string>>;

const emptyValues: CurriculumCourseFormValues = {
  courseId: "",
  semester: "1",
  progress: "ca_ky",
  required: "true",
  order: "0",
  note: "",
};

const validateForm = (values: CurriculumCourseFormValues) => {
  const errors: FormErrors = {};

  if (!values.courseId) errors.courseId = "Học phần là bắt buộc";
  if (!values.semester || Number(values.semester) < 1) {
    errors.semester = "Học kỳ dự kiến không hợp lệ";
  }

  return errors;
};

export default function CurriculumCourseForm({
  courseOptions,
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: CurriculumCourseFormProps) {
  const initialValues = useMemo<CurriculumCourseFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      courseId: String(initialData.courseId),
      semester: String(initialData.semester),
      progress: initialData.progress,
      required: String(initialData.required),
      order: String(initialData.order),
      note: initialData.note,
    };
  }, [initialData]);

  const [values, setValues] = useState<CurriculumCourseFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof CurriculumCourseFormValues, value: string) => {
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
      note: values.note.trim(),
    });

    if (!initialData) {
      setValues(emptyValues);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <SelectInput
            disabled={isSubmitting || Boolean(initialData)}
            error={errors.courseId}
            label="Học phần *"
            name="courseId"
            options={courseOptions}
            value={values.courseId}
            onChange={(event) => setFieldValue("courseId", event.target.value)}
          />
        </div>
        <TextInput
          disabled={isSubmitting}
          error={errors.semester}
          label="Học kỳ dự kiến *"
          min={1}
          name="semester"
          type="number"
          value={values.semester}
          onChange={(event) => setFieldValue("semester", event.target.value)}
        />
        <SelectInput
          disabled={isSubmitting}
          label="Tiến độ"
          name="progress"
          options={[
            { label: "Tiến độ 1", value: "tien_do_1" },
            { label: "Tiến độ 2", value: "tien_do_2" },
            { label: "Cả kỳ", value: "ca_ky" },
          ]}
          value={values.progress}
          onChange={(event) => setFieldValue("progress", event.target.value)}
        />
        <SelectInput
          disabled={isSubmitting}
          label="Tính chất"
          name="required"
          options={[
            { label: "Bắt buộc", value: "true" },
            { label: "Tự chọn", value: "false" },
          ]}
          value={values.required}
          onChange={(event) => setFieldValue("required", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          label="Thứ tự"
          min={0}
          name="order"
          type="number"
          value={values.order}
          onChange={(event) => setFieldValue("order", event.target.value)}
        />
      </div>

      <TextareaInput
        disabled={isSubmitting}
        label="Ghi chú học phần"
        name="note"
        value={values.note}
        onChange={(event) => setFieldValue("note", event.target.value)}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
            Hủy
          </Button>
        ) : null}
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={initialData ? <Save size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
        >
          {initialData ? "Lưu học phần" : "Thêm học phần"}
        </Button>
      </div>
    </form>
  );
}
