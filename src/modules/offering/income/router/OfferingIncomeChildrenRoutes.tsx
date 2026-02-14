/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyOfferingIncomeCreatePage = lazy(
  () => import('@/modules/offering/income/pages/OfferingIncomeCreatePage')
);
const LazyOfferingIncomeSearchPage = lazy(
  () => import('@/modules/offering/income/pages/OfferingIncomeSearchPage')
);
const LazyOfferingIncomeOptionsPage = lazy(
  () => import('@/modules/offering/income/pages/OfferingIncomeOptionsPage')
);

export const OfferingIncomeChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyOfferingIncomeOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyOfferingIncomeCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyOfferingIncomeSearchPage />
      </LazyElement>
    ),
  },
];
