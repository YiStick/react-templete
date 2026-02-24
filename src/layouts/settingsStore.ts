import { create } from 'zustand';
import { layoutSettings, type LayoutSettings } from './layoutConfig';

type LayoutStore = {
  settings: LayoutSettings;
  setSettings: (patch: Partial<LayoutSettings>) => void;
  setMenuSettings: (patch: Partial<LayoutSettings['menu']>) => void;
  resetSettings: () => void;
};

const cloneSettings = (): LayoutSettings => ({
  ...layoutSettings,
  menu: {
    ...layoutSettings.menu,
  },
});

export const useLayoutStore = create<LayoutStore>((set) => ({
  settings: cloneSettings(),
  setSettings: (patch) =>
    set((state) => {
      const nextMenu = {
        ...state.settings.menu,
        ...patch.menu,
      };
      const nextSiderMenuType =
        patch.siderMenuType ?? patch.menu?.type ?? state.settings.siderMenuType;
      if (nextSiderMenuType) {
        nextMenu.type = nextSiderMenuType;
      }
      return {
        settings: {
          ...state.settings,
          ...patch,
          siderMenuType: nextSiderMenuType,
          menu: nextMenu,
        },
      };
    }),
  setMenuSettings: (patch) =>
    set((state) => ({
      settings: {
        ...state.settings,
        siderMenuType: patch.type ?? state.settings.siderMenuType,
        menu: {
          ...state.settings.menu,
          ...patch,
        },
      },
    })),
  resetSettings: () => set({ settings: cloneSettings() }),
}));
