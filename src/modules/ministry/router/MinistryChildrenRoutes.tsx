/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyMinistriesSearchPageByTerm = lazy(
  () => import('@/modules/ministry/pages/MinistriesSearchPageByTerm')
);
const LazyMinistriesGeneralSearchPage = lazy(
  () => import('@/modules/ministry/pages/MinistriesGeneralSearchPage')
);
const LazyMinistryCreatePage = lazy(() => import('@/modules/ministry/pages/MinistryCreatePage'));
const LazyMinistryUpdatePage = lazy(() => import('@/modules/ministry/pages/MinistryUpdatePage'));
const LazyMinistryOptionsPage = lazy(() => import('@/modules/ministry/pages/MinistryOptionsPage'));
const LazyMinistryInactivatePage = lazy(
  () => import('@/modules/ministry/pages/MinistryInactivatePage')
);

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
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyMinistriesGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyMinistriesSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyMinistryUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyMinistryInactivatePage />
      </LazyElement>
    ),
  },
];
