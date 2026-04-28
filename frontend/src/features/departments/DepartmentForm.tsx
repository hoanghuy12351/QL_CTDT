import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import type { Faculty } from "../faculties/faculty.types";
import type { Department, DepartmentFormValues } from "./department.types";

type DepartmentFormProps = {
  initialData?: Department | null;
  faculties: Faculty[];
  isLoadingFaculties?: boolean;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: DepartmentFormValues) => void;
};

type DepartmentFormErrors = Partial<Record<keyof DepartmentFormValues, string>>;

const emptyValues: DepartmentFormValues = {
  facultyId: "",
  code: "",
  name: "",
};

const validateDepartmentForm = (values: DepartmentFormValues) => {
  const errors: DepartmentFormErrors = {};

  if (!values.facultyId) {
    errors.facultyId = "Khoa là bắt buộc";
  }

  if (!values.code.trim()) {
    errors.code = "Mã bộ môn là bắt buộc";
  } else if (values.code.trim().length > 50) {
    errors.code = "Mã bộ môn không được vượt quá 50 ký tự";
  }

  if (!values.name.trim()) {
    errors.name = "Tên bộ môn là bắt buộc";
  } else if (values.name.trim().length > 255) {
    errors.name = "Tên bộ môn không được vượt quá 255 ký tự";
  }

  return errors;
};

export default function DepartmentForm({
  faculties,
  initialData,
  isLoadingFaculties = false,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: DepartmentFormProps) {
  const facultyOptions = useMemo(
    () =>
      faculties.map((faculty) => ({
        label: `${faculty.code} - ${faculty.name}`,
        value: faculty.id,
      })),
    [faculties],
  );

  const initialValues = useMemo<DepartmentFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      facultyId: String(initialData.facultyId),
      code: initialData.code,
      name: initialData.name,
    };
  }, [initialData]);

  const [values, setValues] = useState<DepartmentFormValues>(initialValues);
  const [errors, setErrors] = useState<DepartmentFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof DepartmentFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateDepartmentForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      facultyId: values.facultyId,
      code: values.code.trim(),
      name: values.name.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <SelectInput
          disabled={isSubmitting || isLoadingFaculties}
          error={errors.facultyId}
          label="Khoa"
          name="facultyId"
          placeholder={
            isLoadingFaculties ? "Đang tải danh sách khoa..." : "Chọn khoa"
          }
          required
          options={facultyOptions}
          value={values.facultyId}
          onChange={(event) => setFieldValue("facultyId", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.code}
          label="Mã bộ môn *"
          name="code"
          placeholder="VD: CNPM"
          value={values.code}
          onChange={(event) => setFieldValue("code", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.name}
          label="Tên bộ môn *"
          name="name"
          placeholder="VD: Công nghệ phần mềm"
          value={values.name}
          onChange={(event) => setFieldValue("name", event.target.value)}
        />
      </div>

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
          Lưu dữ liệu
        </Button>
      </div>
    </form>
  );
}
