import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput, {
  type SelectOption,
} from "../../components/ui/SelectInput";
import TextareaInput from "../../components/ui/TextareaInput";
import TextInput from "../../components/ui/TextInput";
import {
  assignmentRoleLabels,
  assignmentStatusLabels,
} from "./teachingAssignment.mapper";
import type {
  AssignmentRole,
  AssignmentStatus,
  LecturerOption,
  TeachingAssignment,
  TeachingAssignmentFormValues,
  TeachingAssignmentRow,
} from "./teachingAssignment.types";

type TeachingAssignmentFormProps = {
  row: TeachingAssignmentRow;
  lecturers: LecturerOption[];
  initialData?: TeachingAssignment | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: TeachingAssignmentFormValues) => void;
};

const roleOptions: SelectOption[] = [
  { label: assignmentRoleLabels.chinh, value: "chinh" },
  { label: assignmentRoleLabels.tro_giang, value: "tro_giang" },
  { label: assignmentRoleLabels.thuc_hanh, value: "thuc_hanh" },
  { label: assignmentRoleLabels.huong_dan_do_an, value: "huong_dan_do_an" },
  {
    label: assignmentRoleLabels.huong_dan_thuc_tap,
    value: "huong_dan_thuc_tap",
  },
];

const statusOptions: SelectOption[] = [
  { label: assignmentStatusLabels.du_thao, value: "du_thao" },
  { label: assignmentStatusLabels.da_phan_cong, value: "da_phan_cong" },
  { label: assignmentStatusLabels.da_xac_nhan, value: "da_xac_nhan" },
  { label: assignmentStatusLabels.da_huy, value: "da_huy" },
];

const getDefaultRole = (groupType: string): AssignmentRole => {
  if (groupType === "thuc_hanh") return "thuc_hanh";
  if (groupType === "do_an" || groupType === "tot_nghiep")
    return "huong_dan_do_an";
  if (groupType === "thuc_tap") return "huong_dan_thuc_tap";

  return "chinh";
};

export default function TeachingAssignmentForm({
  initialData,
  isSubmitting = false,
  lecturers,
  onCancel,
  onSubmit,
  row,
}: TeachingAssignmentFormProps) {
  const lecturerOptions = useMemo<SelectOption[]>(
    () =>
      lecturers.map((lecturer) => ({
        value: String(lecturer.id),
        label: lecturer.code
          ? `${lecturer.code} - ${lecturer.name}`
          : lecturer.name,
      })),
    [lecturers],
  );

  const initialValues = useMemo<TeachingAssignmentFormValues>(
    () => ({
      lecturerId: initialData ? String(initialData.lecturerId) : "",
      role: initialData?.role ?? getDefaultRole(row.group.type),
      assignedPeriods: String(
        initialData?.assignedPeriods ?? row.group.periods ?? 0,
      ),
      classCoefficient: String(initialData?.classCoefficient ?? 1),
      status: initialData?.status ?? "da_phan_cong",
      note: initialData?.note ?? "",
    }),
    [initialData, row.group.periods, row.group.type],
  );

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TeachingAssignmentFormValues, string>>
  >({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setField = (
    field: keyof TeachingAssignmentFormValues,
    value: string,
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<
      Record<keyof TeachingAssignmentFormValues, string>
    > = {};

    if (!values.lecturerId) {
      nextErrors.lecturerId = "Vui lòng chọn giảng viên";
    }

    if (values.assignedPeriods === "" || Number(values.assignedPeriods) <= 0) {
      nextErrors.assignedPeriods = "Số tiết phải lớn hơn 0";
    }

    if (values.classCoefficient === "" || Number(values.classCoefficient) < 0) {
      nextErrors.classCoefficient = "Hệ số lớp không hợp lệ";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({ ...values, note: values.note.trim() });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <div className="font-semibold text-slate-900">{row.group.name}</div>
        <div className="mt-1">
          {row.group.className} / {row.group.courseName} / {row.group.typeLabel}
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <SelectInput
          label="Giảng viên *"
          error={errors.lecturerId}
          options={lecturerOptions}
          value={values.lecturerId}
          disabled={isSubmitting}
          onChange={(event) => setField("lecturerId", event.target.value)}
        />

        <SelectInput
          label="Vai trò"
          options={roleOptions}
          value={values.role}
          disabled={isSubmitting}
          onChange={(event) =>
            setField("role", event.target.value as AssignmentRole)
          }
        />

        <TextInput
          label="Số tiết phân công *"
          error={errors.assignedPeriods}
          min={0}
          step="0.5"
          type="number"
          disabled={isSubmitting}
          value={values.assignedPeriods}
          onChange={(event) => setField("assignedPeriods", event.target.value)}
        />

        <TextInput
          label="Hệ số lớp"
          error={errors.classCoefficient}
          min={0}
          step="0.1"
          type="number"
          disabled={isSubmitting}
          value={values.classCoefficient}
          onChange={(event) => setField("classCoefficient", event.target.value)}
        />

        <SelectInput
          label="Trạng thái"
          options={statusOptions}
          value={values.status}
          disabled={isSubmitting}
          onChange={(event) =>
            setField("status", event.target.value as AssignmentStatus)
          }
        />
      </div>

      <TextareaInput
        label="Ghi chú"
        disabled={isSubmitting}
        value={values.note}
        onChange={(event) => setField("note", event.target.value)}
      />

      {Number(values.assignedPeriods) > row.group.periods ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Số tiết phân công đang lớn hơn số tiết của nhóm ({row.group.periods}).
          Bạn vẫn có thể lưu nếu đây là nghiệp vụ có chủ đích.
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          Hủy
        </Button>

        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Save size={18} aria-hidden="true" />}
        >
          Lưu phân công
        </Button>
      </div>
    </form>
  );
}
