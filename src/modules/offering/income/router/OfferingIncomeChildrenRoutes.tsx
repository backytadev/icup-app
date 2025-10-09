/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyOfferingIncomeCreatePage = lazy(
  () => import('@/modules/offering/income/pages/OfferingIncomeCreatePage')
);
const LazyOfferingIncomeUpdatePage = lazy(
  () => import('@/modules/offering/income/pages/OfferingIncomeUpdatePage')
);
const LazyOfferingIncomeInactivatePage = lazy(
  () => import('@/modules/offering/income/pages/OfferingIncomeInactivatePage')
);
const LazyOfferingsIncomeSearchPageByTerm = lazy(
  () => import('@/modules/offering/income/pages/OfferingsIncomeSearchPageByTerm')
);
const LazyOfferingsIncomeGeneralSearchPage = lazy(
  () => import('@/modules/offering/income/pages/OfferingsIncomeGeneralSearchPage')
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
    path: 'general-search',
    element: (
      <LazyElement>
        <LazyOfferingsIncomeGeneralSearchPage />
      </LazyElement>
    ),
  },
  {
    path: 'search-by-term',
    element: (
      <LazyElement>
        <LazyOfferingsIncomeSearchPageByTerm />
      </LazyElement>
    ),
  },
  {
    path: 'update',
    element: (
      <LazyElement>
        <LazyOfferingIncomeUpdatePage />
      </LazyElement>
    ),
  },
  {
    path: 'inactivate',
    element: (
      <LazyElement>
        <LazyOfferingIncomeInactivatePage />
      </LazyElement>
    ),
  },
];
