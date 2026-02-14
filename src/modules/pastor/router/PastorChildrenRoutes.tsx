/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyPastorOptionsPage = lazy(() => import('@/modules/pastor/pages/PastorOptionsPage'));
const LazyPastorCreatePage = lazy(() => import('@/modules/pastor/pages/PastorCreatePage'));
const LazyPastorSearchPage = lazy(() => import('@/modules/pastor/pages/PastorSearchPage'));

export const PastorChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyPastorOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyPastorCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyPastorSearchPage />
      </LazyElement>
    ),
  },
];
