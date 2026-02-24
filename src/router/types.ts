import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';

export type RouteMeta = {
  title: string;
  icon?: string;
  keepAlive?: boolean;
  tabClosable?: boolean;
  affix?: boolean;
  hidden?: boolean;
  hideInMenu?: boolean;
  hideInTabs?: boolean;
  access?: string | string[];
};

export type AppRoute = {
  path: string;
  component?: LazyExoticComponent<ComponentType<any>>;
  element?: ReactNode;
  children?: AppRoute[];
  meta: RouteMeta;
};
