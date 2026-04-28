import { useMemo, useState, type FormEvent } from "react";
import { Wand2 } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import type { OpenedClassCourse, QuickGroupFormValues } from "./teachingGroup.types";

type QuickGroupFormProps = {
  classCourse: OpenedClassCourse;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: QuickGroupFormValues) => void;
};

export default function QuickGroupForm({
  classCourse,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: QuickGroupFormProps) {
  const suggestedPracticeGroups = useMemo(() => {
    if (classCourse.practicePeriods <= 0) return 0;
    return Math.max(Math.ceil(classCourse.classSize / 30), 1);
  }, [classCourse.classSize, classCourse.practicePeriods]);
  const [values, setValues] = useState<QuickGroupFormValues>({
    createTheoryGroup: classCourse.theoryPeriods > 0 ? "true" : "false",
    practiceGroupCount: String(suggestedPracticeGroups),
    maxPracticeGroupSize: "30",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{classCourse.classCode}</span>
        <span className="mx-2 text-slate-300">/</span>
        <span>{classCourse.courseName}</span>
        <span className="mx-2 text-slate-300">/</span>
        <span>Sĩ số {classCourse.classSize}</span>
      </div>

      <div className="grid gap-x-6 gap-y-5 md:grid-cols-3">
        <SelectInput
          label="Tạo nhóm LT"
          disabled={isSubmitting || classCourse.theoryPeriods <= 0}
          options={[
            { label: "Có", value: "true" },
            { label: "Không", value: "false" },
          ]}
          value={values.createTheoryGroup}
          onChange={(event) =>
            setValues((current) => ({ ...current, createTheoryGroup: event.target.value }))
          }
        />
        <TextInput
          label="Số nhóm TH"
          disabled={isSubmitting || classCourse.practicePeriods <= 0}
          min={0}
          type="number"
          value={values.practiceGroupCount}
          onChange={(event) =>
            setValues((current) => ({ ...current, practiceGroupCount: event.target.value }))
          }
        />
        <TextInput
          label="Sĩ số tối đa nhóm TH"
          disabled={isSubmitting || classCourse.practicePeriods <= 0}
          min={1}
          type="number"
          value={values.maxPracticeGroupSize}
          onChange={(event) =>
            setValues((current) => ({ ...current, maxPracticeGroupSize: event.target.value }))
          }
        />
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Nếu dòng lớp - học phần đã có nhóm cùng mã như LT hoặc TH1, backend sẽ chặn để tránh tạo trùng.
      </div>

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Wand2 size={18} aria-hidden="true" />}>
          Tạo nhóm nhanh
        </Button>
      </div>
    </form>
  );
}
