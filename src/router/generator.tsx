import { JSX, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { KeepAlive } from 'react-activation';
import type { AppRoute } from './types';
import PageLoading from '@/components/PageLoading';

const KeepAliveWrapper = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const cacheKey = `${location.pathname}${location.search}`;
  return (
    <KeepAlive cacheKey={cacheKey} name={cacheKey}>
      {children}
    </KeepAlive>
  );
};

const renderElement = (route: AppRoute) => {
  if (route.element) {
    return route.element;
  }
  if (route.component) {
    const Component = route.component;
    const node = (
      <Suspense fallback={<PageLoading />}>
        <Component />
      </Suspense>
    );
    return route.meta.keepAlive ? <KeepAliveWrapper>{node}</KeepAliveWrapper> : node;
  }
  return null;
};

export const createRouteObjects = (routes: AppRoute[]): RouteObject[] =>
  routes.map((route) => ({
    path: route.path,
    element: renderElement(route) ?? undefined,
    children: route.children ? createRouteObjects(route.children) : undefined,
  }));
