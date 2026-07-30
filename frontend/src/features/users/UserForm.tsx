import SelectInput, { type SelectOption } from "../../components/ui/SelectInput";
import TextInput from "../../components/ui/TextInput";
import type { UserFormValues } from "./user.types";

type UserFormProps = {
  values: UserFormValues;
  lecturerOptions: SelectOption[];
  isEdit?: boolean;
  onChange: (values: UserFormValues) => void;
};

const roleOptions: SelectOption[] = [
  { label: "Admin", value: "quan_tri" },
  { label: "Giảng viên", value: "giang_vien" },
];

const statusOptions: SelectOption[] = [
  { label: "Hoạt động", value: "hoat_dong" },
  { label: "Tạm khóa", value: "tam_khoa" },
  { label: "Bị khóa", value: "bi_khoa" },
];

export default function UserForm({
  values,
  lecturerOptions,
  isEdit = false,
  onChange,
}: UserFormProps) {
  const setField = <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => {
    onChange({
      ...values,
      [field]: value,
      ...(field === "vaiTro" && value !== "giang_vien"
        ? { giangVienId: "" }
        : {}),
    });
  };

  return (
    <div className="space-y-4">
      <TextInput
        label="Họ tên"
        name="hoTen"
        value={values.hoTen}
        onChange={(event) => setField("hoTen", event.target.value)}
        required
      />
      <TextInput
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={(event) => setField("email", event.target.value)}
        required
      />
      <TextInput
        label={isEdit ? "Mật khẩu mới" : "Mật khẩu"}
        name="password"
        type="password"
        value={values.password}
        placeholder={isEdit ? "Để trống nếu không đổi mật khẩu" : "Tối thiểu 6 ký tự"}
        onChange={(event) => setField("password", event.target.value)}
        required={!isEdit}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectInput
          label="Vai trò"
          name="vaiTro"
          options={roleOptions}
          value={values.vaiTro}
          onChange={(event) => setField("vaiTro", event.target.value as UserFormValues["vaiTro"])}
          required
        />
        <SelectInput
          label="Trạng thái"
          name="trangThai"
          options={statusOptions}
          value={values.trangThai}
          onChange={(event) => setField("trangThai", event.target.value as UserFormValues["trangThai"])}
          required
        />
      </div>
      {values.vaiTro === "giang_vien" ? (
        <SelectInput
          label="Liên kết hồ sơ giảng viên"
          name="giangVienId"
          options={lecturerOptions}
          value={values.giangVienId}
          placeholder="Chọn hồ sơ giảng viên"
          onChange={(event) => setField("giangVienId", event.target.value)}
        />
      ) : null}
    </div>
  );
}
