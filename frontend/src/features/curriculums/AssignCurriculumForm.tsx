import { useEffect, useState, type FormEvent } from "react";
import { Link2 } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import type { AssignCurriculumFormValues } from "./curriculum.types";

type AssignCurriculumFormProps = {
  classOptions: SelectOption[];
  isSubmitting?: boolean;
  onSubmit: (values: AssignCurriculumFormValues) => void;
};

const today = new Date().toISOString().slice(0, 10);

export default function AssignCurriculumForm({
  classOptions,
  isSubmitting = false,
  onSubmit,
}: AssignCurriculumFormProps) {
  const [values, setValues] = useState<AssignCurriculumFormValues>({
    classId: "",
    appliedAt: today,
    note: "",
  });
  const [classError, setClassError] = useState("");

  useEffect(() => {
    setClassError("");
  }, [values.classId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.classId) {
      setClassError("Lớp áp dụng là bắt buộc");
      return;
    }

    onSubmit({
      ...values,
      note: values.note.trim(),
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-x-4 gap-y-4 md:grid-cols-2 xl:grid-cols-3">
        <SelectInput
          disabled={isSubmitting}
          error={classError}
          label="Lớp áp dụng *"
          name="classId"
          options={classOptions}
          value={values.classId}
          onChange={(event) =>
            setValues((current) => ({ ...current, classId: event.target.value }))
          }
        />
        <TextInput
          disabled={isSubmitting}
          label="Ngày áp dụng"
          name="appliedAt"
          type="date"
          value={values.appliedAt}
          onChange={(event) =>
            setValues((current) => ({ ...current, appliedAt: event.target.value }))
          }
        />
      </div>

      <TextareaInput
        disabled={isSubmitting}
        label="Ghi chú"
        name="note"
        value={values.note}
        onChange={(event) =>
          setValues((current) => ({ ...current, note: event.target.value }))
        }
      />

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Link2 size={16} aria-hidden="true" />}>
          Gán CTĐT và sinh tiến độ
        </Button>
      </div>
    </form>
  );
}
