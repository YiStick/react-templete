import type { RouteMeta } from './types';

export type AccessContext = {
  permissions: string[];
};

export const hasAccess = (meta: RouteMeta, ctx?: AccessContext): boolean => {
  if (!meta.access) {
    return true;
  }
  if (!ctx || ctx.permissions.length === 0) {
    return true;
  }
  const required = Array.isArray(meta.access) ? meta.access : [meta.access];
  return required.every((item) => ctx.permissions.includes(item));
};
