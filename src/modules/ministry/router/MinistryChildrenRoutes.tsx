/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyMinistryOptionsPage = lazy(() => import('@/modules/ministry/pages/MinistryOptionsPage'));
const LazyMinistryCreatePage = lazy(() => import('@/modules/ministry/pages/MinistryCreatePage'));
const LazyMinistrySearchPage = lazy(() => import('@/modules/ministry/pages/MinistrySearchPage'));

export const MinistryChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyMinistryOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyMinistryCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyMinistrySearchPage />
      </LazyElement>
    ),
  },
];
