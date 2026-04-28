import type { AuthUserResponse } from "./auth.types.js";

type NguoiDungRecord = {
  nguoiDungId: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  trangThai: string;
};

export const mapAuthUser = (user: NguoiDungRecord): AuthUserResponse => ({
  id: user.nguoiDungId,
  email: user.email,
  hoTen: user.hoTen,
  vaiTro: user.vaiTro,
  trangThai: user.trangThai,
});
