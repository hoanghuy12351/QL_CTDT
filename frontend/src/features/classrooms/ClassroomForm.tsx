import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import type { AdminSelectOption } from "../admin/crud/adminCrud.types";
import type { Classroom, ClassroomFormValues } from "./classroom.types";

type ClassroomFormProps = {
  initialData?: Classroom | null;
  campusOptions: AdminSelectOption[];
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: ClassroomFormValues) => void;
};

type ClassroomFormErrors = Partial<Record<keyof ClassroomFormValues, string>>;

const emptyValues: ClassroomFormValues = {
  campusId: "",
  code: "",
  name: "",
  capacity: "",
  roomType: "",
};

const roomTypeOptions = [
  { label: "Lý thuyết", value: "ly_thuyet" },
  { label: "Thực hành", value: "thuc_hanh" },
  { label: "Lab", value: "lab" },
  { label: "Đồ án", value: "do_an" },
  { label: "Online", value: "online" },
];

const validateClassroomForm = (values: ClassroomFormValues) => {
  const errors: ClassroomFormErrors = {};

  if (!values.campusId) {
    errors.campusId = "Cơ sở là bắt buộc";
  }

  if (!values.code.trim()) {
    errors.code = "Mã phòng là bắt buộc";
  }

  if (values.capacity && Number(values.capacity) < 0) {
    errors.capacity = "Sức chứa không được âm";
  }

  return errors;
};

export default function ClassroomForm({
  campusOptions,
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: ClassroomFormProps) {
  const initialValues = useMemo<ClassroomFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      campusId: String(initialData.campusId),
      code: initialData.code,
      name: initialData.name ?? "",
      capacity:
        initialData.capacity !== null ? String(initialData.capacity) : "",
      roomType: initialData.roomType ?? "",
    };
  }, [initialData]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ClassroomFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof ClassroomFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateClassroomForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      campusId: values.campusId,
      code: values.code.trim(),
      name: values.name.trim(),
      capacity: values.capacity.trim(),
      roomType: values.roomType,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <SelectInput
          disabled={isSubmitting}
          error={errors.campusId}
          label="Cơ sở"
          name="campusId"
          placeholder="Chọn cơ sở"
          required
          options={campusOptions}
          value={values.campusId}
          onChange={(event) => setFieldValue("campusId", event.target.value)}
        />

        <SelectInput
          disabled={isSubmitting}
          error={errors.roomType}
          label="Loại phòng"
          name="roomType"
          placeholder="Chọn loại phòng"
          options={roomTypeOptions}
          value={values.roomType}
          onChange={(event) => setFieldValue("roomType", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.code}
          label="Mã phòng *"
          name="code"
          placeholder="VD: A101"
          value={values.code}
          onChange={(event) => setFieldValue("code", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.name}
          label="Tên phòng"
          name="name"
          placeholder="VD: Phòng A101"
          value={values.name}
          onChange={(event) => setFieldValue("name", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.capacity}
          label="Sức chứa"
          min={0}
          name="capacity"
          type="number"
          value={values.capacity}
          onChange={(event) => setFieldValue("capacity", event.target.value)}
        />
      </div>

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
