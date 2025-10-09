/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyZonesGeneralSearchPage = lazy(
  () => import('@/modules/zone/pages/ZonesGeneralSearchPage')
);
const LazyZoneCreatePage = lazy(() => import('@/modules/zone/pages/ZoneCreatePage'));
const LazyZoneUpdatePage = lazy(() => import('@/modules/zone/pages/ZoneUpdatePage'));
const LazyZoneOptionsPage = lazy(() => import('@/modules/zone/pages/ZoneOptionsPage'));
const LazyZoneInactivatePage = lazy(() => import('@/modules/zone/pages/ZoneInactivatePage'));
const LazyZonesSearchPageByTerm = lazy(() => import('@/modules/zone/pages/ZonesSearchPageByTerm'));

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
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyZonesGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyZonesSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyZoneUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyZoneInactivatePage />
      </LazyElement>
    ),
  },
];
