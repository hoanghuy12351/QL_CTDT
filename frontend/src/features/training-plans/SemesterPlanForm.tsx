import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CalendarPlus } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import type { SemesterPlanFormValues, TrainingPlan } from "./trainingPlan.types";

type SemesterPlanFormProps = {
  trainingPlan: TrainingPlan;
  semesterOptions: SelectOption[];
  isSubmitting?: boolean;
  onSubmit: (values: SemesterPlanFormValues) => void;
};

export default function SemesterPlanForm({
  isSubmitting = false,
  onSubmit,
  semesterOptions,
  trainingPlan,
}: SemesterPlanFormProps) {
  const defaultName = useMemo(
    () => `${trainingPlan.name} - học kỳ`,
    [trainingPlan.name],
  );
  const [values, setValues] = useState<SemesterPlanFormValues>({
    trainingPlanId: String(trainingPlan.id),
    semesterId: "",
    name: defaultName,
    status: "du_thao",
    note: "",
  });
  const [semesterError, setSemesterError] = useState("");

  useEffect(() => {
    setValues((current) => ({
      ...current,
      trainingPlanId: String(trainingPlan.id),
      name: current.name || defaultName,
    }));
  }, [defaultName, trainingPlan.id]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.semesterId) {
      setSemesterError("Học kỳ là bắt buộc");
      return;
    }

    onSubmit({ ...values, name: values.name.trim() || defaultName, note: values.note.trim() });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectInput
          label="Học kỳ *"
          disabled={isSubmitting}
          error={semesterError}
          options={semesterOptions}
          value={values.semesterId}
          onChange={(event) => {
            setValues((current) => ({ ...current, semesterId: event.target.value }));
            setSemesterError("");
          }}
        />
        <TextInput label="Tên kế hoạch học kỳ" disabled={isSubmitting} value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} />
        <SelectInput
          label="Trạng thái"
          disabled={isSubmitting}
          options={[
            { label: "Dự thảo", value: "du_thao" },
            { label: "Đang thực hiện", value: "dang_thuc_hien" },
            { label: "Đã đóng", value: "da_dong" },
          ]}
          value={values.status}
          onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as SemesterPlanFormValues["status"] }))}
        />
      </div>
      <TextareaInput label="Ghi chú" disabled={isSubmitting} value={values.note} onChange={(event) => setValues((current) => ({ ...current, note: event.target.value }))} />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} leftIcon={<CalendarPlus size={16} aria-hidden="true" />}>
          Tạo kế hoạch học kỳ
        </Button>
      </div>
    </form>
  );
}
