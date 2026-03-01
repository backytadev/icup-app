/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyCopastorOptionsPage = lazy(() => import('@/modules/copastor/pages/CopastorOptionsPage'));
const LazyCopastorCreatePage = lazy(() => import('@/modules/copastor/pages/CopastorCreatePage'));
const LazyCopastorSearchPage = lazy(() => import('@/modules/copastor/pages/CopastorSearchPage'));

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
    path: 'search',
    element: (
      <LazyElement>
        <LazyCopastorSearchPage />
      </LazyElement>
    ),
  },
];
