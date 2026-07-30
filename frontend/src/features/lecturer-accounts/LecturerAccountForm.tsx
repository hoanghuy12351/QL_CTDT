import { useEffect, useMemo, useState } from "react";
import { KeyRound, Save, UserRound } from "lucide-react";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import type {
  AccountStatus,
  AvailableLecturerOption,
  LecturerAccount,
  LecturerAccountFormValues,
} from "./lecturerAccount.types";

type LecturerAccountFormProps = {
  initialData?: LecturerAccount | null;
  availableLecturers: AvailableLecturerOption[];
  selectedLecturer?: LecturerAccount | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: LecturerAccountFormValues) => void;
};

const accountStatusOptions: Array<{ label: string; value: AccountStatus }> = [
  { label: "Đang hoạt động", value: "hoat_dong" },
  { label: "Tạm khóa", value: "tam_khoa" },
  { label: "Bị khóa", value: "bi_khoa" },
];

const buildLecturerLabel = (
  lecturer: AvailableLecturerOption | LecturerAccount,
) => {
  const code = lecturer.maGiangVien ? `${lecturer.maGiangVien} - ` : "";
  const department = lecturer.boMon?.tenBoMon ? ` · ${lecturer.boMon.tenBoMon}` : "";
  return `${code}${lecturer.hoTen}${department}`;
};

export default function LecturerAccountForm({
  availableLecturers,
  initialData,
  isSubmitting = false,
  onCancel,
  onSubmit,
  selectedLecturer,
}: LecturerAccountFormProps) {
  const isEditing = Boolean(initialData?.taiKhoan);
  const fixedLecturer = initialData ?? selectedLecturer ?? null;

  const initialValues = useMemo(
    () => ({
      giangVienId: fixedLecturer?.giangVienId
        ? String(fixedLecturer.giangVienId)
        : "",
      email: initialData?.taiKhoan?.email ?? fixedLecturer?.email ?? "",
      password: "",
      trangThai: initialData?.taiKhoan?.trangThai ?? "hoat_dong",
    }),
    [fixedLecturer, initialData],
  );

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const setFieldValue = (name: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (!values.giangVienId) {
      nextErrors.giangVienId = "Vui lòng chọn hồ sơ giảng viên";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email đăng nhập là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Email không hợp lệ";
    }

    if (!isEditing && values.password.trim().length < 6) {
      nextErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    if (isEditing && values.password.trim() && values.password.trim().length < 6) {
      nextErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      giangVienId: Number(values.giangVienId),
      email: values.email.trim(),
      password: values.password.trim() || undefined,
      trangThai: values.trangThai as AccountStatus,
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm leading-6 text-brand-900">
        <div className="flex gap-3">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 ring-1 ring-brand-100">
            {isEditing ? (
              <KeyRound size={18} aria-hidden="true" />
            ) : (
              <UserRound size={18} aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="font-bold">
              {isEditing ? "Cập nhật tài khoản giảng viên" : "Tạo tài khoản đăng nhập cho giảng viên"}
            </p>
            <p className="mt-1 text-brand-800/80">
              Tài khoản được tạo với quyền Giảng viên và chỉ xem được phân công, lịch dạy của chính giảng viên đó.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Hồ sơ giảng viên <span className="text-red-500">*</span>
          </span>
          {fixedLecturer ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900">
              {buildLecturerLabel(fixedLecturer)}
            </div>
          ) : (
            <select
              className={[
                "min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition",
                "hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
                errors.giangVienId ? "border-red-300 focus:border-red-500 focus:ring-red-100" : "",
              ].join(" ")}
              disabled={isSubmitting}
              value={values.giangVienId}
              onChange={(event) => {
                const giangVienId = event.target.value;
                const lecturer = availableLecturers.find(
                  (item) => String(item.giangVienId) === giangVienId,
                );

                setValues((current) => ({
                  ...current,
                  giangVienId,
                  email: current.email || lecturer?.email || "",
                }));
                setErrors((current) => ({ ...current, giangVienId: "" }));
              }}
            >
              <option value="">Chọn giảng viên chưa có tài khoản</option>
              {availableLecturers.map((lecturer) => (
                <option key={lecturer.giangVienId} value={lecturer.giangVienId}>
                  {buildLecturerLabel(lecturer)}
                </option>
              ))}
            </select>
          )}
          {errors.giangVienId ? (
            <p className="text-sm text-red-600">{errors.giangVienId}</p>
          ) : null}
        </label>

        <TextInput
          disabled={isSubmitting}
          error={errors.email}
          label="Email đăng nhập *"
          name="email"
          placeholder="VD: giangvien@utehy.edu.vn"
          type="email"
          value={values.email}
          onChange={(event) => setFieldValue("email", event.target.value)}
        />

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Trạng thái tài khoản <span className="text-red-500">*</span>
          </span>
          <select
            className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition hover:border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            disabled={isSubmitting}
            value={values.trangThai}
            onChange={(event) => setFieldValue("trangThai", event.target.value)}
          >
            {accountStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <TextInput
          disabled={isSubmitting}
          error={errors.password}
          label={isEditing ? "Mật khẩu mới" : "Mật khẩu *"}
          name="password"
          placeholder={isEditing ? "Để trống nếu không đổi mật khẩu" : "Tối thiểu 6 ký tự"}
          type="password"
          value={values.password}
          onChange={(event) => setFieldValue("password", event.target.value)}
        />

        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          <p className="font-semibold text-slate-800">Lưu ý</p>
          <p>
            Khi đổi email đăng nhập, email trong hồ sơ giảng viên cũng được đồng bộ để tránh sai lệch thông tin.
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCancel}>
          Hủy
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          leftIcon={<Save size={18} aria-hidden="true" />}
        >
          {isEditing ? "Lưu thay đổi" : "Tạo tài khoản"}
        </Button>
      </div>
    </form>
  );
}
