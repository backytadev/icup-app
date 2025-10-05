/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

//! Lazy load children routes
const LazyOfferingExpenseCreatePage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingExpenseCreatePage')
);
const LazyOfferingExpenseUpdatePage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingExpenseUpdatePage')
);
const LazyOfferingExpenseInactivatePage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingExpenseInactivatePage')
);
const LazyOfferingsExpenseSearchPageByTerm = lazy(
  () => import('@/modules/offering/expense/pages/OfferingsExpenseSearchPageByTerm')
);
const LazyOfferingsExpenseGeneralSearchPage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingsExpenseGeneralSearchPage')
);

export const OfferingExpenseChildrenRoutes = [
  {
    path: 'create',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyOfferingExpenseCreatePage />
      </Suspense>
    ),
  },
  {
    path: 'general-search',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyOfferingsExpenseGeneralSearchPage />
      </Suspense>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyOfferingsExpenseSearchPageByTerm />
      </Suspense>
    ),
  },
  {
    path: 'update',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyOfferingExpenseUpdatePage />
      </Suspense>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyOfferingExpenseInactivatePage />
      </Suspense>
    ),
  },
];
