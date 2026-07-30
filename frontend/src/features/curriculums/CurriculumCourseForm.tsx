import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import { CORE_CURRICULUM_SEMESTERS } from "./curriculum.helpers";
import type { CurriculumCourse, CurriculumCourseFormValues } from "./curriculum.types";

type CurriculumCourseFormProps = {
  initialData?: CurriculumCourse | null;
  isSubmitting?: boolean;
  courseOptions: SelectOption[];
  defaultSemester?: string;
  getDefaultOrder?: (semester: string) => string;
  onCancel?: () => void;
  onSemesterChange?: (semester: string) => void;
  onSubmit: (values: CurriculumCourseFormValues) => void;
};

type FormErrors = Partial<Record<keyof CurriculumCourseFormValues, string>>;

const semesterOptions: SelectOption[] = CORE_CURRICULUM_SEMESTERS.map((semester) => ({
  value: String(semester),
  label: `Ky ${semester}`,
}));

const buildEmptyValues = (
  defaultSemester = "1",
  getDefaultOrder?: (semester: string) => string,
): CurriculumCourseFormValues => ({
  courseId: "",
  semester: defaultSemester,
  required: "true",
  order: getDefaultOrder?.(defaultSemester) ?? "",
  note: "",
});

const validateForm = (values: CurriculumCourseFormValues) => {
  const errors: FormErrors = {};

  if (!values.courseId) errors.courseId = "Hoc phan la bat buoc";
  if (!values.semester || Number(values.semester) < 1 || Number(values.semester) > 8) {
    errors.semester = "Hoc ky du kien khong hop le";
  }
  if (values.order.trim() && Number(values.order) < 1) {
    errors.order = "Vi tri phai lon hon 0";
  }

  return errors;
};

export default function CurriculumCourseForm({
  courseOptions,
  defaultSemester = "1",
  getDefaultOrder,
  initialData,
  isSubmitting = false,
  onCancel,
  onSemesterChange,
  onSubmit,
}: CurriculumCourseFormProps) {
  const initialValues = useMemo<CurriculumCourseFormValues>(() => {
    if (!initialData) return buildEmptyValues(defaultSemester, getDefaultOrder);

    return {
      courseId: String(initialData.courseId),
      semester: String(initialData.semester),
      required: String(initialData.required),
      order: String(initialData.order || ""),
      note: initialData.note,
    };
  }, [defaultSemester, getDefaultOrder, initialData]);

  const [values, setValues] = useState<CurriculumCourseFormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof CurriculumCourseFormValues, value: string) => {
    if (field === "semester") {
      onSemesterChange?.(value);
    }

    setValues((current) => ({
      ...current,
      [field]: value,
      ...(!initialData && field === "semester"
        ? { order: getDefaultOrder?.(value) ?? "" }
        : {}),
    }));
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
      setValues(buildEmptyValues(values.semester, getDefaultOrder));
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <SelectInput
            disabled={isSubmitting || Boolean(initialData)}
            error={errors.courseId}
            label="Hoc phan *"
            name="courseId"
            options={courseOptions}
            value={values.courseId}
            onChange={(event) => setFieldValue("courseId", event.target.value)}
          />
        </div>
        <SelectInput
          disabled={isSubmitting}
          error={errors.semester}
          label="Hoc ky du kien *"
          name="semester"
          options={semesterOptions}
          value={values.semester}
          onChange={(event) => setFieldValue("semester", event.target.value)}
        />
        <SelectInput
          disabled={isSubmitting}
          label="Tinh chat"
          name="required"
          options={[
            { label: "Bat buoc", value: "true" },
            { label: "Tu chon", value: "false" },
          ]}
          value={values.required}
          onChange={(event) => setFieldValue("required", event.target.value)}
        />
        <TextInput
          disabled={isSubmitting}
          error={errors.order}
          label="Vi tri trong ky"
          min={1}
          name="order"
          type="number"
          value={values.order}
          onChange={(event) => setFieldValue("order", event.target.value)}
        />
      </div>

      <TextareaInput
        disabled={isSubmitting}
        label="Ghi chu hoc phan"
        name="note"
        value={values.note}
        onChange={(event) => setFieldValue("note", event.target.value)}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
            Huy
          </Button>
        ) : null}
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={
            initialData ? <Save size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />
          }
        >
          {initialData ? "Luu hoc phan" : "Them hoc phan"}
        </Button>
      </div>
    </form>
  );
}
