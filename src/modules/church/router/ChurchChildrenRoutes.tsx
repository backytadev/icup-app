/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { type RouteObject } from 'react-router-dom';
import { LoadingSpinner } from '@/shared/components/spinner/LoadingSpinner';

//! Lazy load children routes
const LazyChurchesSearchPageByTerm = lazy(
  () => import('@/modules/church/pages/ChurchesSearchPageByTerm')
);
const LazyChurchesGeneralSearchPage = lazy(
  () => import('@/modules/church/pages/ChurchesGeneralSearchPage')
);
const LazyChurchCreatePage = lazy(() => import('@/modules/church/pages/ChurchCreatePage'));
const LazyChurchUpdatePage = lazy(() => import('@/modules/church/pages/ChurchUpdatePage'));
const LazyChurchInactivatePage = lazy(() => import('@/modules/church/pages/ChurchInactivatePage'));

export const ChurchChildrenRoutes: RouteObject[] = [
  {
    path: 'create',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyChurchCreatePage />
      </Suspense>
    ),
  },
  {
    path: 'general-search',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyChurchesGeneralSearchPage />
      </Suspense>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyChurchesSearchPageByTerm />
      </Suspense>
    ),
  },
  {
    path: 'update',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyChurchUpdatePage />
      </Suspense>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyChurchInactivatePage />
      </Suspense>
    ),
  },
];
