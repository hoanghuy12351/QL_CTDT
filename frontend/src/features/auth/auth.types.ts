export type AuthUser = {
  id: number;
  email: string;
  hoTen: string;
  vaiTro: string;
  trangThai: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginCredentials & {
  hoTen: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};
