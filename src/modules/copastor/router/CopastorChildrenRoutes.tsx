/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyCopastorInactivatePage = lazy(
  () => import('@/modules/copastor/pages/CopastorInactivatePage')
);
const LazyCopastorsSearchPageByTerm = lazy(
  () => import('@/modules/copastor/pages/CopastorsSearchPageByTerm')
);
const LazyCopastorsGeneralSearchPage = lazy(
  () => import('@/modules/copastor/pages/CopastorsGeneralSearchPage')
);
const LazyCopastorUpdatePage = lazy(() => import('@/modules/copastor/pages/CopastorUpdatePage'));
const LazyCopastorCreatePage = lazy(() => import('@/modules/copastor/pages/CopastorCreatePage'));
const LazyCopastorOptionsPage = lazy(() => import('@/modules/copastor/pages/CopastorOptionsPage'));

export const CopastorChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyCopastorOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyCopastorCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyCopastorsGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyCopastorsSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyCopastorUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyCopastorInactivatePage />
      </LazyElement>
    ),
  },
];
