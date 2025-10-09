/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

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
const LazySupervisorOptionsPage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorOptionsPage')
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
    path: 'general-search',
    element: (
      <LazyElement>
        <LazySupervisorsGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazySupervisorsSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazySupervisorUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazySupervisorInactivatePage />
      </LazyElement>
    ),
  },
];
