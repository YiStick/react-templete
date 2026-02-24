import { create } from 'zustand';

export type AuthState = {
  permissions: string[];
  setPermissions: (permissions: string[]) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  permissions: [],
  setPermissions: (permissions) => set({ permissions }),
}));
