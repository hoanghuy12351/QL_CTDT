import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import TextareaInput from "../../components/ui/TextareaInput";
import type { Campus, CampusFormValues } from "./campus.types";

type CampusFormProps = {
  initialData?: Campus | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: CampusFormValues) => void;
};

type CampusFormErrors = Partial<Record<keyof CampusFormValues, string>>;

const emptyValues: CampusFormValues = { code: "", name: "", address: "" };

const validateCampusForm = (values: CampusFormValues) => {
  const errors: CampusFormErrors = {};
  if (!values.code.trim()) errors.code = "Mã cơ sở là bắt buộc";
  if (!values.name.trim()) errors.name = "Tên cơ sở là bắt buộc";
  return errors;
};

export default function CampusForm({
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: CampusFormProps) {
  const initialValues = useMemo<CampusFormValues>(() => {
    if (!initialData) return emptyValues;
    return {
      code: initialData.code,
      name: initialData.name,
      address: initialData.address ?? "",
    };
  }, [initialData]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<CampusFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof CampusFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateCampusForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSubmit({
      code: values.code.trim(),
      name: values.name.trim(),
      address: values.address.trim(),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <TextInput disabled={isSubmitting} error={errors.code} label="Mã cơ sở *" name="code" placeholder="VD: CS1" value={values.code} onChange={(event) => setFieldValue("code", event.target.value)} />
        <TextInput disabled={isSubmitting} error={errors.name} label="Tên cơ sở *" name="name" placeholder="VD: Cơ sở Mỹ Hào" value={values.name} onChange={(event) => setFieldValue("name", event.target.value)} />
        <div className="md:col-span-2">
          <TextareaInput disabled={isSubmitting} error={errors.address} label="Địa chỉ" name="address" placeholder="Địa chỉ cơ sở" value={values.address} onChange={(event) => setFieldValue("address", event.target.value)} />
        </div>
      </div>
      <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>Hủy</Button>
        <Button type="submit" isLoading={isSubmitting} leftIcon={<Save size={18} aria-hidden="true" />}>Lưu dữ liệu</Button>
      </div>
    </form>
  );
}
