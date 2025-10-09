/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyDiscipleInactivatePage = lazy(
  () => import('@/modules/disciple/pages/DiscipleInactivatePage')
);
const LazyDisciplesSearchPageByTerm = lazy(
  () => import('@/modules/disciple/pages/DisciplesSearchPageByTerm')
);
const LazyDisciplesGeneralSearchPage = lazy(
  () => import('@/modules/disciple/pages/DisciplesGeneralSearchPage')
);
const LazyDiscipleCreatePage = lazy(() => import('@/modules/disciple/pages/DiscipleCreatePage'));
const LazyDiscipleUpdatePage = lazy(() => import('@/modules/disciple/pages/DiscipleUpdatePage'));
const LazyDiscipleOptionsPage = lazy(() => import('@/modules/disciple/pages/DiscipleOptionsPage'));

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
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyDisciplesGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyDisciplesSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyDiscipleUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyDiscipleInactivatePage />
      </LazyElement>
    ),
  },
];
