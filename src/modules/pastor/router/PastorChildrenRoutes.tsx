/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyPastorsSearchPageByTerm = lazy(
  () => import('@/modules/pastor/pages/PastorsSearchPageByTerm')
);
const LazyPastorsGeneralSearchPage = lazy(
  () => import('@/modules/pastor/pages/PastorsGeneralSearchPage')
);
const PastorCreatePage = lazy(() => import('@/modules/pastor/pages/PastorCreatePage'));
const LazyPastorUpdatePage = lazy(() => import('@/modules/pastor/pages/PastorUpdatePage'));
const LazyPastorOptionsPage = lazy(() => import('@/modules/pastor/pages/PastorOptionsPage'));
const LazyPastorInactivatePage = lazy(() => import('@/modules/pastor/pages/PastorInactivatePage'));

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
        <PastorCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyPastorsGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyPastorsSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyPastorUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyPastorInactivatePage />
      </LazyElement>
    ),
  },
];
