/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyOfferingExpenseCreatePage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingExpenseCreatePage')
);
const LazyOfferingExpenseSearchPage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingExpenseSearchPage')
);
const LazyOfferingExpenseOptionsPage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingExpenseOptionsPage')
);

export const OfferingExpenseChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyOfferingExpenseOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'create',
    element: (
      <LazyElement>
        <LazyOfferingExpenseCreatePage />
      </LazyElement>
    ),
  },
  {
    path: 'search',
    element: (
      <LazyElement>
        <LazyOfferingExpenseSearchPage />
      </LazyElement>
    ),
  },
];
