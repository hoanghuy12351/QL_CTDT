import { create } from "zustand";
import type { AuthUser } from "./auth.types";
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "../../lib/storage";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

const getInitialUser = () => {
  const rawUser = getStorageItem(AUTH_USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    removeStorageItem(AUTH_USER_KEY);
    return null;
  }
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  accessToken: getStorageItem(AUTH_TOKEN_KEY),
  setSession: (user, accessToken) => {
    setStorageItem(AUTH_TOKEN_KEY, accessToken);
    setStorageItem(AUTH_USER_KEY, JSON.stringify(user));
    set({ user, accessToken });
  },
  clearSession: () => {
    removeStorageItem(AUTH_TOKEN_KEY);
    removeStorageItem(AUTH_USER_KEY);
    set({ user: null, accessToken: null });
  },
}));
