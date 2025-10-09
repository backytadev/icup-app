/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

//! Lazy load children routes
const LazyOfferingIncomeMetrics = lazy(
  () => import('@/modules/metrics/pages/OfferingIncomeMetrics')
);
const LazyOfferingExpenseMetrics = lazy(
  () => import('@/modules/metrics/pages/OfferingExpenseMetrics')
);
const LazyFinancialBalanceComparisonMetrics = lazy(
  () => import('@/modules/metrics/pages/FinancialBalanceComparisonMetrics')
);
const LazyMemberMetrics = lazy(() => import('@/modules/metrics/pages/MemberMetrics'));
const LazyFamilyGroupMetrics = lazy(() => import('@/modules/metrics/pages/FamilyGroupMetrics'));
const LazyMetricsOptionsPage = lazy(() => import('@/modules/metrics/pages/MetricsOptionsPage'));

export const MetricsChildrenRoutes: RouteObject[] = [
  {
    index: true,
    element: (
      <LazyElement>
        <LazyMetricsOptionsPage />
      </LazyElement>
    ),
  },
  {
    path: 'member',
    element: (
      <LazyElement>
        <LazyMemberMetrics />
      </LazyElement>
    ),
  },
  {
    path: 'family-group',
    element: (
      <LazyElement>
        <LazyFamilyGroupMetrics />
      </LazyElement>
    ),
  },
  {
    path: 'offering-income',
    element: (
      <LazyElement>
        <LazyOfferingIncomeMetrics />
      </LazyElement>
    ),
  },
  {
    path: 'offering-expense',
    element: (
      <LazyElement>
        <LazyOfferingExpenseMetrics />
      </LazyElement>
    ),
  },
  {
    path: 'offering-comparative',
    element: (
      <LazyElement>
        <LazyFinancialBalanceComparisonMetrics />
      </LazyElement>
    ),
  },
];
