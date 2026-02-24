import { matchPath } from 'react-router-dom';
import type { AppRoute } from './types';

export const flattenRoutes = (routes: AppRoute[]): AppRoute[] => {
  const result: AppRoute[] = [];
  const walk = (list: AppRoute[]) => {
    list.forEach((route) => {
      result.push(route);
      if (route.children?.length) {
        walk(route.children);
      }
    });
  };
  walk(routes);
  return result;
};

export const findRouteByPath = (pathname: string, routes: AppRoute[]): AppRoute | undefined => {
  for (const route of routes) {
    if (matchPath({ path: route.path, end: true }, pathname)) {
      return route;
    }
    if (route.children?.length) {
      const childMatch = findRouteByPath(pathname, route.children);
      if (childMatch) {
        return childMatch;
      }
    }
  }
  return undefined;
};

export const findRouteChain = (pathname: string, routes: AppRoute[]): AppRoute[] => {
  for (const route of routes) {
    if (matchPath({ path: route.path, end: true }, pathname)) {
      return [route];
    }
    if (route.children?.length) {
      const childChain = findRouteChain(pathname, route.children);
      if (childChain.length > 0) {
        return [route, ...childChain];
      }
    }
  }
  return [];
};
