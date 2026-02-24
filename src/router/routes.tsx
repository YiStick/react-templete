import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { AppRoute } from './types';

export const appRoutes: AppRoute[] = [
  {
    path: '/dashboard',
    component: lazy(() => import('@/pages/Dashboard')),
    meta: {
      title: '工作台',
      icon: 'DashboardOutlined',
      keepAlive: true,
      tabClosable: false,
      affix: true,
    },
  },
  {
    path: '/list',
    meta: {
      title: '列表管理',
      icon: 'UnorderedListOutlined',
      hideInTabs: true,
      tabClosable: false,
    },
    children: [
      {
        path: '/list',
        element: <Navigate to="/list/index" replace />,
        meta: {
          title: '列表页',
          hideInMenu: true,
          hideInTabs: true,
          tabClosable: false,
        },
      },
      {
        path: '/list/index',
        component: lazy(() => import('@/pages/List')),
        meta: {
          title: '列表页',
          keepAlive: true,
          tabClosable: true,
        },
      },
      {
        path: '/list/detail/:id',
        component: lazy(() => import('@/pages/List/Detail')),
        meta: {
          title: '列表详情',
          hidden: true,
          keepAlive: false,
          tabClosable: true,
        },
      },
    ],
  },
  {
    path: '/form/long',
    component: lazy(() => import('@/pages/LongForm')),
    meta: {
      title: '长表单',
      icon: 'FormOutlined',
      keepAlive: false,
      tabClosable: true,
    },
  },
  {
    path: '/profile',
    component: lazy(() => import('@/pages/Profile')),
    meta: {
      title: '个人页',
      icon: 'UserOutlined',
      keepAlive: true,
      tabClosable: true,
    },
  },
];

const redirectRoute: AppRoute = {
  path: '/',
  element: <Navigate to="/dashboard" replace />,
  meta: {
    title: 'Root',
    hideInMenu: true,
    hideInTabs: true,
    tabClosable: false,
  },
};

const notFoundRoute: AppRoute = {
  path: '*',
  component: lazy(() => import('@/pages/NotFound')),
  meta: {
    title: 'Not Found',
    hideInMenu: true,
    tabClosable: false,
  },
};

export const routeEntries: AppRoute[] = [redirectRoute, ...appRoutes, notFoundRoute];
