/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

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
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyOfferingsExpenseGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyOfferingsExpenseSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyOfferingExpenseUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyOfferingExpenseInactivatePage />
      </LazyElement>
    ),
  },
];
