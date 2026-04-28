import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import type { OpenedClassCourse, TeachingGroup, TeachingGroupFormValues } from "./teachingGroup.types";

type TeachingGroupFormProps = {
  classCourse?: OpenedClassCourse | null;
  initialData?: TeachingGroup | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: TeachingGroupFormValues) => void;
};

const buildInitialValues = (
  classCourse?: OpenedClassCourse | null,
  initialData?: TeachingGroup | null,
): TeachingGroupFormValues => {
  if (initialData) {
    return {
      code: initialData.code,
      name: initialData.name,
      type: initialData.type,
      classSize: String(initialData.classSize),
      periods: String(initialData.periods),
      note: initialData.note,
    };
  }

  return {
    code: "LT",
    name: "Lý thuyết",
    type: "ly_thuyet",
    classSize: String(classCourse?.classSize ?? 0),
    periods: String(classCourse?.theoryPeriods ?? 0),
    note: "",
  };
};

export default function TeachingGroupForm({
  classCourse,
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: TeachingGroupFormProps) {
  const initialValues = useMemo(
    () => buildInitialValues(classCourse, initialData),
    [classCourse, initialData],
  );
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TeachingGroupFormValues, string>>>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setField = (field: keyof TeachingGroupFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleTypeChange = (value: string) => {
    if (value === "thuc_hanh") {
      setValues((current) => ({
        ...current,
        type: "thuc_hanh",
        code: current.code === "LT" ? "TH1" : current.code,
        name: current.name === "Lý thuyết" ? "Thực hành 1" : current.name,
        periods: String(classCourse?.practicePeriods ?? current.periods),
      }));
      return;
    }

    setValues((current) => ({
      ...current,
      type: "ly_thuyet",
      code: current.code.startsWith("TH") ? "LT" : current.code,
      name: current.name.startsWith("Thực hành") ? "Lý thuyết" : current.name,
      periods: String(classCourse?.theoryPeriods ?? current.periods),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};

    if (!values.name.trim()) nextErrors.name = "Tên nhóm là bắt buộc";
    if (!values.classSize || Number(values.classSize) < 0) nextErrors.classSize = "Sĩ số không hợp lệ";
    if (!values.periods || Number(values.periods) < 0) nextErrors.periods = "Số tiết không hợp lệ";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      ...values,
      code: values.code.trim(),
      name: values.name.trim(),
      note: values.note.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {classCourse ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{classCourse.classCode}</span>
          <span className="mx-2 text-slate-300">/</span>
          <span>{classCourse.courseName}</span>
        </div>
      ) : null}

      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <SelectInput
          label="Loại nhóm"
          disabled={isSubmitting || Boolean(initialData)}
          options={[
            { label: "Lý thuyết", value: "ly_thuyet" },
            { label: "Thực hành", value: "thuc_hanh" },
          ]}
          value={values.type}
          onChange={(event) => handleTypeChange(event.target.value)}
        />
        <TextInput label="Mã nhóm" disabled={isSubmitting} value={values.code} onChange={(event) => setField("code", event.target.value)} />
        <TextInput label="Tên nhóm *" error={errors.name} disabled={isSubmitting} value={values.name} onChange={(event) => setField("name", event.target.value)} />
        <TextInput label="Sĩ số dự kiến *" error={errors.classSize} min={0} type="number" disabled={isSubmitting} value={values.classSize} onChange={(event) => setField("classSize", event.target.value)} />
        <TextInput label="Số tiết *" error={errors.periods} min={0} type="number" disabled={isSubmitting} value={values.periods} onChange={(event) => setField("periods", event.target.value)} />
      </div>

      <TextareaInput label="Ghi chú" disabled={isSubmitting} value={values.note} onChange={(event) => setField("note", event.target.value)} />

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Save size={18} aria-hidden="true" />}>
          Lưu nhóm
        </Button>
      </div>
    </form>
  );
}
