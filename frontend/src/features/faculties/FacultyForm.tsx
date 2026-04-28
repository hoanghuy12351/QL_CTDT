import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import type { Faculty, FacultyFormValues } from "./faculty.types";

type FacultyFormProps = {
  initialData?: Faculty | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: FacultyFormValues) => void;
};

type FacultyFormErrors = Partial<Record<keyof FacultyFormValues, string>>;

const emptyValues: FacultyFormValues = {
  code: "",
  name: "",
};

const validateFacultyForm = (values: FacultyFormValues) => {
  const errors: FacultyFormErrors = {};

  if (!values.code.trim()) {
    errors.code = "Mã khoa là bắt buộc";
  } else if (values.code.trim().length > 50) {
    errors.code = "Mã khoa không được vượt quá 50 ký tự";
  }

  if (!values.name.trim()) {
    errors.name = "Tên khoa là bắt buộc";
  } else if (values.name.trim().length > 255) {
    errors.name = "Tên khoa không được vượt quá 255 ký tự";
  }

  return errors;
};

export default function FacultyForm({
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: FacultyFormProps) {
  const initialValues = useMemo<FacultyFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      code: initialData.code,
      name: initialData.name,
    };
  }, [initialData]);

  const [values, setValues] = useState<FacultyFormValues>(initialValues);
  const [errors, setErrors] = useState<FacultyFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof FacultyFormValues, value: string) => {
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

    const nextErrors = validateFacultyForm(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      code: values.code.trim(),
      name: values.name.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <TextInput
          disabled={isSubmitting}
          error={errors.code}
          label="Mã khoa *"
          name="code"
          placeholder="VD: CNTT"
          value={values.code}
          onChange={(event) => setFieldValue("code", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.name}
          label="Tên khoa *"
          name="name"
          placeholder="VD: Khoa Công nghệ thông tin"
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
