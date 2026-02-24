import { create } from 'zustand';

export type LocaleKey = 'zh-CN' | 'en-US';

type AppState = {
  locale: LocaleKey;
  setLocale: (locale: LocaleKey) => void;
};

export const useAppStore = create<AppState>((set) => ({
  locale: 'zh-CN',
  setLocale: (locale) => set({ locale }),
}));
