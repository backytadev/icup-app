/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyPreacherSearchPage = lazy(
  () => import('@/modules/preacher/pages/PreacherSearchPage')
);
const LazyPreacherCreatePage = lazy(() => import('@/modules/preacher/pages/PreacherCreatePage'));
const LazyPreacherOptionsPage = lazy(() => import('@/modules/preacher/pages/PreacherOptionsPage'));

export const PreacherChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyPreacherOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyPreacherCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyPreacherSearchPage />
      </LazyElement>
    ),
  },
];
