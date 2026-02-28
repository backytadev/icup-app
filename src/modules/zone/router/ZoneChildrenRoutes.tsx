/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyZoneOptionsPage = lazy(() => import('@/modules/zone/pages/ZoneOptionsPage'));
const LazyZoneCreatePage = lazy(() => import('@/modules/zone/pages/ZoneCreatePage'));
const LazyZoneSearchPage = lazy(() => import('@/modules/zone/pages/ZoneSearchPage'));

export const ZoneChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyZoneOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyZoneCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyZoneSearchPage />
      </LazyElement>
    ),
  },
];
