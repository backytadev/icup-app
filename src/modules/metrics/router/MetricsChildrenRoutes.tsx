/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/shared/components/spinner/LoadingSpinner';

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

export const MetricsChildrenRoutes = [
  {
    path: 'member',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyMemberMetrics />
      </Suspense>
    ),
  },
  {
    path: 'family-group',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyFamilyGroupMetrics />
      </Suspense>
    ),
  },
  {
    path: 'offering-income',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyOfferingIncomeMetrics />
      </Suspense>
    ),
  },
  {
    path: 'offering-expense',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyOfferingExpenseMetrics />
      </Suspense>
    ),
  },
  {
    path: 'offering-comparative',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyFinancialBalanceComparisonMetrics />
      </Suspense>
    ),
  },
];
