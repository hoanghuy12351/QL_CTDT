import { useEffect, useState, type FormEvent } from "react";
import { Link2 } from "lucide-react";
import Button from "../../components/ui/Button";
import type { SelectOption } from "../../components/ui/SelectInput";
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
    classIds: [],
    appliedAt: today,
    note: "",
  });
  const [classError, setClassError] = useState("");

  useEffect(() => {
    setClassError("");
  }, [values.classIds]);

  const toggleClass = (classId: string) => {
    setValues((current) => {
      const exists = current.classIds.includes(classId);
      return {
        ...current,
        classIds: exists
          ? current.classIds.filter((id) => id !== classId)
          : [...current.classIds, classId],
      };
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.classIds.length === 0) {
      setClassError("Chọn ít nhất một lớp áp dụng");
      return;
    }

    onSubmit({
      ...values,
      note: values.note.trim(),
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-x-4 gap-y-4 xl:grid-cols-[minmax(0,1fr)_240px]">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-slate-700">Lớp áp dụng *</span>
            <span className="text-xs font-semibold text-slate-500">
              Đã chọn {values.classIds.length}
            </span>
          </div>
          <div
            aria-invalid={Boolean(classError)}
            className={[
              "grid max-h-56 gap-2 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3",
              "sm:grid-cols-2 xl:grid-cols-3",
              classError ? "border-red-300" : "",
            ].join(" ")}
          >
            {classOptions.map((option) => {
              const value = String(option.value);
              const checked = values.classIds.includes(value);

              return (
                <label
                  key={value}
                  className={[
                    "flex min-h-10 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition",
                    checked
                      ? "border-brand-300 bg-brand-50 text-brand-900"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-200 hover:bg-brand-50/50",
                    isSubmitting ? "cursor-not-allowed opacity-70" : "",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-brand-700 focus:ring-brand-500"
                    checked={checked}
                    disabled={isSubmitting}
                    onChange={() => toggleClass(value)}
                  />
                  <span className="min-w-0 truncate">{option.label}</span>
                </label>
              );
            })}
          </div>
          {classError ? <p className="text-sm text-red-600">{classError}</p> : null}
        </div>

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
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Link2 size={16} aria-hidden="true" />}
        >
          Gán CTĐT và sinh tiến độ
        </Button>
      </div>
    </form>
  );
}
