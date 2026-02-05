/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';

import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyChurchOptionsPage = lazy(() => import('@/modules/church/pages/ChurchOptionsPage'));
const LazyChurchCreatePage = lazy(() => import('@/modules/church/pages/ChurchCreatePage'));
const LazyChurchSearchPage = lazy(() => import('@/modules/church/pages/ChurchSearchPage'));

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
    path: 'search',
    element: (
      <LazyElement>
        <LazyChurchSearchPage />
      </LazyElement>
    ),
  },
];
