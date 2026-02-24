import { create } from 'zustand';
import { appRoutes } from '@/router/routes';
import { flattenRoutes, findRouteByPath } from '@/router/utils';
import type { AppRoute } from '@/router/types';

const MAX_TABS = 20;

export type TabItem = {
  key: string;
  path: string;
  search: string;
  title: string;
  lastActive: number;
  closable: boolean;
  affix?: boolean;
};

type TabsState = {
  tabs: TabItem[];
  activeKey: string;
  syncWithRoute: (pathname: string, search: string) => void;
  closeTab: (key: string) => string | undefined;
  closeLeft: (key: string) => string | undefined;
  closeRight: (key: string) => string | undefined;
  closeOthers: (key: string) => string | undefined;
  closeAll: () => string | undefined;
};

const routeList = flattenRoutes(appRoutes);

const buildFullPath = (pathname: string, search?: string) => `${pathname}${search ?? ''}`;

const buildTabFromRoute = (
  route: AppRoute,
  pathname: string,
  search: string,
  now: number,
): TabItem | null => {
  if (route.meta.hideInTabs) {
    return null;
  }
  return {
    key: buildFullPath(pathname, search),
    path: pathname,
    search,
    title: route.meta.title,
    lastActive: now,
    closable: route.meta.tabClosable !== false && !route.meta.affix,
    affix: route.meta.affix,
  };
};

const getAffixTabs = (): TabItem[] => {
  const now = Date.now();
  return routeList
    .filter((route) => route.meta.affix)
    .map((route) => buildTabFromRoute(route, route.path, '', now))
    .filter(Boolean) as TabItem[];
};

const enforceLimit = (tabs: TabItem[], activeKey: string): TabItem[] => {
  if (tabs.length <= MAX_TABS) {
    return tabs;
  }
  const removable = tabs.filter((tab) => !tab.affix && tab.key !== activeKey);
  if (removable.length === 0) {
    return tabs.slice(0, MAX_TABS);
  }
  const sorted = [...removable].sort((a, b) => a.lastActive - b.lastActive);
  const removeCount = tabs.length - MAX_TABS;
  const removeKeys = new Set(sorted.slice(0, removeCount).map((tab) => tab.key));
  return tabs.filter((tab) => !removeKeys.has(tab.key));
};

const initialTabs = getAffixTabs();
const initialActiveKey = initialTabs[0]?.key ?? '';

export const useTabsStore = create<TabsState>((set, get) => ({
  tabs: initialTabs,
  activeKey: initialActiveKey,
  syncWithRoute: (pathname, search) => {
    const route = findRouteByPath(pathname, appRoutes);
    if (!route) {
      return;
    }

    set((state) => {
      const now = Date.now();
      const fullPath = buildFullPath(pathname, search);
      const existingIndex = state.tabs.findIndex((tab) => tab.key === fullPath);
      let nextTabs = [...state.tabs];

      if (existingIndex >= 0) {
        nextTabs[existingIndex] = {
          ...nextTabs[existingIndex],
          lastActive: now,
        };
      } else {
        const newTab = buildTabFromRoute(route, pathname, search, now);
        if (!newTab) {
          return state;
        }
        nextTabs.push(newTab);
        nextTabs = enforceLimit(nextTabs, fullPath);
      }

      return {
        tabs: nextTabs,
        activeKey: fullPath,
      };
    });
  },
  closeTab: (key) => {
    const { tabs, activeKey } = get();
    if (tabs.length <= 1) {
      return activeKey;
    }
    const targetIndex = tabs.findIndex((tab) => tab.key === key);
    const target = tabs[targetIndex];
    if (!target || !target.closable) {
      return activeKey;
    }
    let nextActive: string | undefined = activeKey;
    set((state) => {
      const remaining = state.tabs.filter((tab) => tab.key !== key);
      if (state.activeKey === key) {
        const nextIndex = Math.max(targetIndex - 1, 0);
        nextActive = remaining[nextIndex]?.key ?? remaining[0]?.key;
      }
      return {
        tabs: remaining,
        activeKey: nextActive ?? remaining[0]?.key ?? '',
      };
    });
    return nextActive;
  },
  closeLeft: (key) => {
    let nextActive: string | undefined = key;
    set((state) => {
      const index = state.tabs.findIndex((tab) => tab.key === key);
      if (index <= 0) {
        return state;
      }
      const leftTabs = state.tabs.slice(0, index);
      const rightTabs = state.tabs.slice(index);
      const preservedLeft = leftTabs.filter((tab) => !tab.closable);
      const remaining = [...preservedLeft, ...rightTabs];
      if (remaining.length === 0) {
        return state;
      }
      nextActive = remaining.find((tab) => tab.key === state.activeKey)?.key ?? remaining[0]?.key;
      return {
        tabs: remaining,
        activeKey: nextActive ?? '',
      };
    });
    return nextActive;
  },
  closeRight: (key) => {
    let nextActive: string | undefined = key;
    set((state) => {
      const index = state.tabs.findIndex((tab) => tab.key === key);
      if (index === -1 || index === state.tabs.length - 1) {
        return state;
      }
      const leftTabs = state.tabs.slice(0, index + 1);
      const rightTabs = state.tabs.slice(index + 1);
      const preservedRight = rightTabs.filter((tab) => !tab.closable);
      const remaining = [...leftTabs, ...preservedRight];
      if (remaining.length === 0) {
        return state;
      }
      nextActive = remaining.find((tab) => tab.key === state.activeKey)?.key ?? remaining[0]?.key;
      return {
        tabs: remaining,
        activeKey: nextActive ?? '',
      };
    });
    return nextActive;
  },
  closeOthers: (key) => {
    let nextActive: string | undefined = key;
    set((state) => {
      const target = state.tabs.find((tab) => tab.key === key);
      if (!target) {
        return state;
      }
      const preserved = state.tabs.filter((tab) => !tab.closable || tab.key === key);
      if (preserved.length === 0) {
        return state;
      }
      nextActive = preserved.find((tab) => tab.key === state.activeKey)?.key ?? key;
      return {
        tabs: preserved,
        activeKey: nextActive ?? '',
      };
    });
    return nextActive;
  },
  closeAll: () => {
    let nextActive: string | undefined;
    set((state) => {
      const preserved = state.tabs.filter((tab) => !tab.closable);
      let remaining = preserved;
      if (remaining.length === 0 && state.tabs.length > 0) {
        remaining = [state.tabs[0]];
      }
      nextActive = remaining[0]?.key;
      return {
        tabs: remaining,
        activeKey: nextActive ?? '',
      };
    });
    return nextActive;
  },
}));
