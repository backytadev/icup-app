/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

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

export const DiscipleChildrenRoutes = [
  {
    index: true,
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyDiscipleOptionsPage />
      </Suspense>
    ),
  },
  {
    path: 'create',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyDiscipleCreatePage />
      </Suspense>
    ),
  },
  {
    path: 'general-search',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyDisciplesGeneralSearchPage />
      </Suspense>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyDisciplesSearchPageByTerm />
      </Suspense>
    ),
  },
  {
    path: 'update',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyDiscipleUpdatePage />
      </Suspense>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyDiscipleInactivatePage />
      </Suspense>
    ),
  },
];
