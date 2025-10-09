/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyChurchesSearchPageByTerm = lazy(
  () => import('@/modules/church/pages/ChurchesSearchPageByTerm')
);
const LazyChurchesGeneralSearchPage = lazy(
  () => import('@/modules/church/pages/ChurchesGeneralSearchPage')
);
const LazyChurchCreatePage = lazy(() => import('@/modules/church/pages/ChurchCreatePage'));
const LazyChurchUpdatePage = lazy(() => import('@/modules/church/pages/ChurchUpdatePage'));
const LazyChurchOptionsPage = lazy(() => import('@/modules/church/pages/ChurchOptionsPage'));
const LazyChurchInactivatePage = lazy(() => import('@/modules/church/pages/ChurchInactivatePage'));

export const ChurchChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyChurchOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyChurchCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyChurchesGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyChurchesSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyChurchUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyChurchInactivatePage />
      </LazyElement>
    ),
  },
];
