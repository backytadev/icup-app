/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyDiscipleCreatePage = lazy(() => import('@/modules/disciple/pages/DiscipleCreatePage'));
const LazyDiscipleOptionsPage = lazy(() => import('@/modules/disciple/pages/DiscipleOptionsPage'));
const LazyDiscipleSearchPage = lazy(() => import('@/modules/disciple/pages/DiscipleSearchPage'));

export const DiscipleChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyDiscipleOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyDiscipleCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyDiscipleSearchPage />
      </LazyElement>
    ),
  },
];
