/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyUserSearchPage = lazy(() => import('@/modules/user/pages/UserSearchPage'));
const LazyUserCreatePage = lazy(() => import('@/modules/user/pages/UserCreatePage'));
const LazyUserOptionsPage = lazy(() => import('@/modules/user/pages/UserOptionsPage'));

export const UserChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyUserOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyUserCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyUserSearchPage />
      </LazyElement>
    ),
  },
];
