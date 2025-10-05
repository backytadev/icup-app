/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

//! Lazy load children routes
const LazySupervisorUpdatePage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorUpdatePage')
);
const LazySupervisorCreatePage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorCreatePage')
);
const LazySupervisorInactivatePage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorInactivatePage')
);
const LazySupervisorsSearchPageByTerm = lazy(
  () => import('@/modules/supervisor/pages/SupervisorsSearchPageByTerm')
);
const LazySupervisorsGeneralSearchPage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorsGeneralSearchPage')
);

export const SupervisorChildrenRoutes = [
  {
    path: 'create',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazySupervisorCreatePage />
      </Suspense>
    ),
  },
  {
    path: 'general-search',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazySupervisorsGeneralSearchPage />
      </Suspense>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazySupervisorsSearchPageByTerm />
      </Suspense>
    ),
  },
  {
    path: 'update',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazySupervisorUpdatePage />
      </Suspense>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazySupervisorInactivatePage />
      </Suspense>
    ),
  },
];
