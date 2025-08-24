/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';
import { LoadingSpinner } from '@/shared/components/spinner/LoadingSpinner';

//! Lazy load children routes
const LazyMinistriesSearchPageByTerm = lazy(
  () => import('@/modules/ministry/pages/MinistriesSearchPageByTerm')
);
const LazyMinistriesGeneralSearchPage = lazy(
  () => import('@/modules/ministry/pages/MinistriesGeneralSearchPage')
);
const LazyMinistryCreatePage = lazy(() => import('@/modules/ministry/pages/MinistryCreatePage'));
const LazyMinistryUpdatePage = lazy(() => import('@/modules/ministry/pages/MinistryUpdatePage'));
const LazyMinistryInactivatePage = lazy(
  () => import('@/modules/ministry/pages/MinistryInactivatePage')
);

export const MinistryChildrenRoutes: RouteObject[] = [
  {
    path: 'create',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyMinistryCreatePage />
      </Suspense>
    ),
  },
  {
    path: 'general-search',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyMinistriesGeneralSearchPage />
      </Suspense>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyMinistriesSearchPageByTerm />
      </Suspense>
    ),
  },
  {
    path: 'update',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyMinistryUpdatePage />
      </Suspense>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyMinistryInactivatePage />
      </Suspense>
    ),
  },
];
