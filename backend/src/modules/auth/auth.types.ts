export type AuthUserResponse = {
  id: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  trangThai: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUserResponse;
};
