import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import Button from "../../components/ui/Button";
import SelectInput from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import type { Semester, SemesterFormValues } from "./semester.types";

type SemesterFormProps = {
  initialData?: Semester | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: SemesterFormValues) => void;
};

type SemesterFormErrors = Partial<Record<keyof SemesterFormValues, string>>;

const emptyValues: SemesterFormValues = {
  code: "",
  name: "",
  startDate: "",
  endDate: "",
  status: "",
};

const statusOptions = [
  { label: "Dự thảo", value: "du_thao" },
  { label: "Đang áp dụng", value: "dang_ap_dung" },
  { label: "Đã đóng", value: "da_dong" },
];

const toDayMonthInputValue = (value: string | null) => {
  if (!value) return "";

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[3]}/${isoMatch[2]}`;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
};

const isValidDayMonth = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const date = new Date(Date.UTC(2000, month - 1, day));

  return (
    date.getUTCFullYear() === 2000 &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const normalizeDayMonth = (value: string) => {
  const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!match) return value.trim();
  return `${String(Number(match[1])).padStart(2, "0")}/${String(
    Number(match[2]),
  ).padStart(2, "0")}`;
};

const validateSemesterForm = (values: SemesterFormValues) => {
  const errors: SemesterFormErrors = {};

  if (!values.code.trim()) errors.code = "Mã học kỳ là bắt buộc";
  if (!values.name.trim()) errors.name = "Tên học kỳ là bắt buộc";

  if (!values.startDate.trim()) {
    errors.startDate = "Ngày bắt đầu là bắt buộc";
  } else if (!isValidDayMonth(values.startDate)) {
    errors.startDate = "Ngày bắt đầu phải có dạng ngày/tháng, ví dụ 01/09";
  }

  if (!values.endDate.trim()) {
    errors.endDate = "Ngày kết thúc là bắt buộc";
  } else if (!isValidDayMonth(values.endDate)) {
    errors.endDate = "Ngày kết thúc phải có dạng ngày/tháng, ví dụ 15/01";
  }

  return errors;
};

export default function SemesterForm({
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
}: SemesterFormProps) {
  const initialValues = useMemo<SemesterFormValues>(() => {
    if (!initialData) return emptyValues;

    return {
      code: initialData.code,
      name: initialData.name,
      startDate: toDayMonthInputValue(initialData.startDate),
      endDate: toDayMonthInputValue(initialData.endDate),
      status: initialData.status ?? "",
    };
  }, [initialData]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<SemesterFormErrors>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (field: keyof SemesterFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateSemesterForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      code: values.code.trim(),
      name: values.name.trim(),
      startDate: normalizeDayMonth(values.startDate),
      endDate: normalizeDayMonth(values.endDate),
      status: values.status,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Học kỳ chỉ lưu mốc ngày/tháng mẫu. Năm học thực tế sẽ lấy theo kế hoạch đào tạo.
      </div>

      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        <TextInput
          disabled={isSubmitting}
          error={errors.code}
          label="Mã học kỳ *"
          name="code"
          placeholder="VD: HK1"
          value={values.code}
          onChange={(event) => setFieldValue("code", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.name}
          label="Tên học kỳ *"
          name="name"
          placeholder="VD: Học kỳ 1"
          value={values.name}
          onChange={(event) => setFieldValue("name", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.startDate}
          label="Ngày bắt đầu *"
          name="startDate"
          placeholder="VD: 01/09"
          value={values.startDate}
          onChange={(event) => setFieldValue("startDate", event.target.value)}
        />

        <TextInput
          disabled={isSubmitting}
          error={errors.endDate}
          label="Ngày kết thúc *"
          name="endDate"
          placeholder="VD: 15/01"
          value={values.endDate}
          onChange={(event) => setFieldValue("endDate", event.target.value)}
        />

        <SelectInput
          disabled={isSubmitting}
          error={errors.status}
          label="Trạng thái"
          name="status"
          placeholder="Chọn trạng thái"
          options={statusOptions}
          value={values.status}
          onChange={(event) => setFieldValue("status", event.target.value)}
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
