/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';

import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Root } from '../Root';

import { AuthLayout } from '@/layouts/AuthLayout';

import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

//? Routers by module
//* Members
import { ChurchChildrenRoutes } from '@/modules/church/router/ChurchChildrenRoutes';
import { PastorChildrenRoutes } from '@/modules/pastor/router/PastorChildrenRoutes';
import { MinistryChildrenRoutes } from '@/modules/ministry/router/MinistryChildrenRoutes';
import { CopastorChildrenRoutes } from '@/modules/copastor/router/CopastorChildrenRoutes';
import { PreacherChildrenRoutes } from '@/modules/preacher/router/PreacherChildrenRoutes';
import { DiscipleChildrenRoutes } from '@/modules/disciple/router/DiscipleChildrenRoutes';
import { SupervisorChildrenRoutes } from '@/modules/supervisor/router/SupervisorChildrenRoutes';

//* Family groups and zones
import { ZoneChildrenRoutes } from '@/modules/zone/router/ZoneChildrenRoutes';
import { FamilyGroupChildrenRoutes } from '@/modules/family-group/router/FamilyGroupChildrenRoutes';

//* Offering
import { OfferingIncomeChildrenRoutes } from '@/modules/offering/income/router/OfferingIncomeChildrenRoutes';
import { OfferingExpenseChildrenRoutes } from '@/modules/offering/expense/router/OfferingExpenseChildrenRoutes';

//* Metrics and charts
import { MetricsChildrenRoutes } from '@/modules/metrics/router/MetricsChildrenRoutes';

//* Users
import { UserChildrenRoutes } from '@/modules/user/router/UserChildrenRoutes';

//* Auth
import { AuthChildrenRoutes } from '@/modules/auth/router/AuthChildrenRoutes';
import { LazyElement } from '@/router/helpers/LazyElements';
import { ProtectedRoute } from '@/ProtectedRoute';

//! Lazy Load (Pages)
//* NotFound page
const LazyNotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'));

//! Lazy Load (Options Pages)
//* Dashboard, Member and church module
const LazyDashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));
const LazyRedirectIfMatch = lazy(() => import('@/router/helpers/RedirectIfMatch'));
const LazyDashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));

//* Offerings
const LazyOfferingOptionsPage = lazy(
  () => import('@/modules/offering/shared/pages/OfferingOptionsPage')
);

//? Browser router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Navigate to='/auth/login' replace />,
      },

      //* Protected
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            element: (
              <LazyElement>
                <LazyDashboardLayout />
              </LazyElement>
            ),
            children: [
              {
                path: 'dashboard',
                element: (
                  <LazyElement>
                    <LazyDashboardPage />
                  </LazyElement>
                ),
              },
              {
                path: 'churches',
                children: ChurchChildrenRoutes,
              },
              {
                path: 'ministries',
                children: MinistryChildrenRoutes,
              },
              {
                path: 'pastors',
                children: PastorChildrenRoutes,
              },
              {
                path: 'copastors',
                children: CopastorChildrenRoutes,
              },
              {
                path: 'supervisors',
                children: SupervisorChildrenRoutes,
              },
              {
                path: 'preachers',
                children: PreacherChildrenRoutes,
              },

              {
                path: 'disciples',
                children: DiscipleChildrenRoutes,
              },
              {
                path: 'family-groups',
                children: FamilyGroupChildrenRoutes,
              },
              {
                path: 'zones',
                children: ZoneChildrenRoutes,
              },
              {
                path: 'offerings',
                element: (
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyOfferingOptionsPage />
                  </Suspense>
                ),
              },
              {
                path: 'metrics',
                children: MetricsChildrenRoutes,
              },
              {
                path: 'users',
                children: UserChildrenRoutes,
              },
            ],
          },
        ],
      },

      //* Offerings (children)
      {
        path: '/offerings/income',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: OfferingIncomeChildrenRoutes,
      },
      {
        path: 'offerings/expenses',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: OfferingExpenseChildrenRoutes,
      },

      //* Auth
      { path: 'auth', element: <AuthLayout />, children: AuthChildrenRoutes },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyRedirectIfMatch />
      </Suspense>
    ),
  },
  {
    path: '/404',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LazyNotFoundPage />,
      </Suspense>
    ),
  },
]);
