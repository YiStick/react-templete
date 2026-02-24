import type { MenuProps } from 'antd';
import type { AppRoute } from './types';
import type { AccessContext } from './permission';
import { hasAccess } from './permission';

type BuildOptions = {
  maxDepth?: number;
  depth?: number;
  menuType?: 'sub' | 'group';
};

const buildItem = (
  route: AppRoute,
  ctx?: AccessContext,
  options: BuildOptions = {},
): MenuProps['items'][number] | null => {
  if (route.meta.hideInMenu || route.meta.hidden) {
    return null;
  }
  if (!hasAccess(route.meta, ctx)) {
    return null;
  }
  const depth = options.depth ?? 1;
  const maxDepth = options.maxDepth ?? Number.POSITIVE_INFINITY;
  const menuType = options.menuType ?? 'sub';
  const nextDepth = depth + 1;
  const children = route.children
    ?.map((child) => buildItem(child, ctx, { ...options, depth: nextDepth }))
    .filter(Boolean) as MenuProps['items'];

  const canShowChildren = children && children.length > 0 && depth < maxDepth;
  if (menuType === 'group' && canShowChildren) {
    return {
      type: 'group',
      label: route.meta.title,
      children,
    };
  }

  return {
    key: route.path,
    label: route.meta.title,
    children: canShowChildren ? children : undefined,
  };
};

export const buildMenuItems = (
  routes: AppRoute[],
  ctx?: AccessContext,
  options?: BuildOptions,
): MenuProps['items'] =>
  routes.map((route) => buildItem(route, ctx, options)).filter(Boolean) as MenuProps['items'];

export const getMenuOpenKeys = (routes: AppRoute[], ctx?: AccessContext): string[] => {
  const keys: string[] = [];
  const walk = (list: AppRoute[]) => {
    list.forEach((route) => {
      if (route.meta.hideInMenu || route.meta.hidden) {
        return;
      }
      if (!hasAccess(route.meta, ctx)) {
        return;
      }
      if (route.children && route.children.length > 0) {
        keys.push(route.path);
        walk(route.children);
      }
    });
  };
  walk(routes);
  return keys;
};
