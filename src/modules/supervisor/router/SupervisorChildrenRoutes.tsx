/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazySupervisorOptionsPage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorOptionsPage')
);
const LazySupervisorCreatePage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorCreatePage')
);
const LazySupervisorSearchPage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorSearchPage')
);

export const SupervisorChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazySupervisorOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazySupervisorCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazySupervisorSearchPage />
      </LazyElement>
    ),
  },
];
