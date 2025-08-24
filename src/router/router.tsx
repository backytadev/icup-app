/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy, Suspense } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import { Root } from '@/Root';

import { AuthLayout } from '@/layouts/AuthLayout';

import { LoadingSpinner } from '@/shared/components/spinner/LoadingSpinner';

//? Routers by module
//* Members
import { ChurchChildrenRoutes } from '@/modules/church/router/ChurchChildrenRoutes';
import { MinistryChildrenRoutes } from '@/modules/ministry/router/MinistryChildrenRoutes';
import { PastorChildrenRoutes } from '@/modules/pastor/router/PastorChildrenRoutes';
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

const LazyDashboardLayout = lazy(() => import('@/layouts/DashboardLayout'));

//! Lazy Load (Pages)
//* NotFound page
const LazyNotFoundPage = lazy(() => import('@/shared/pages/NotFoundPage'));

//! Lazy Load (Options Pages)
//* Dashboard, Member and church module
const LazyRedirectIfMatch = lazy(() => import('@/router/RedirectIfMatch'));
const LazySupervisorOptionsPage = lazy(
  () => import('@/modules/supervisor/pages/SupervisorOptionsPage')
);

const LazyDashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));
const LazyPastorOptionsPage = lazy(() => import('@/modules/pastor/pages/PastorOptionsPage'));
const LazyChurchOptionsPage = lazy(() => import('@/modules/church/pages/ChurchOptionsPage'));
const LazyMinistryOptionsPage = lazy(() => import('@/modules/ministry/pages/MinistryOptionsPage'));
const LazyCopastorOptionsPage = lazy(() => import('@/modules/copastor/pages/CopastorOptionsPage'));
const LazyPreacherOptionsPage = lazy(() => import('@/modules/preacher/pages/PreacherOptionsPage'));
const LazyDiscipleOptionsPage = lazy(() => import('@/modules/disciple/pages/DiscipleOptionsPage'));

//* Zone and Family group
const FamilyGroupOptionsPage = lazy(
  () => import('@/modules/family-group/pages/FamilyGroupOptionsPage')
);
const ZoneOptionsPage = lazy(() => import('@/modules/zone/pages/ZoneOptionsPage'));

//* Offerings
const OfferingOptionsPage = lazy(
  () => import('@/modules/offering/shared/pages/OfferingOptionsPage')
);
const OfferingIncomeOptionsPage = lazy(
  () => import('@/modules/offering/income/pages/OfferingIncomeOptionsPage')
);
const OfferingExpenseOptionsPage = lazy(
  () => import('@/modules/offering/expense/pages/OfferingExpenseOptionsPage')
);

//* Metrics
const MetricsOptionsPage = lazy(() => import('@/modules/metrics/pages/MetricsOptionsPage'));

//* User
const UserOptionsPage = lazy(() => import('@/modules/user/pages/UserOptionsPage'));

//? Browser router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: [
          // * Main pages by module
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazyDashboardPage />
              </Suspense>
            ),
          },
          {
            path: 'churches',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazyChurchOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'ministries',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazyMinistryOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'pastors',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazyPastorOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'copastors',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazyCopastorOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'supervisors',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazySupervisorOptionsPage />
              </Suspense>
            ),
          },
          {
            path: '/preachers',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazyPreacherOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'disciples',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <LazyDiscipleOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'family-groups',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <FamilyGroupOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'zones',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <ZoneOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'offerings',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <OfferingOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'offerings/income',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <OfferingIncomeOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'offerings/expenses',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <OfferingExpenseOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'metrics',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <MetricsOptionsPage />
              </Suspense>
            ),
          },
          {
            path: 'users',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <UserOptionsPage />
              </Suspense>
            ),
          },
        ],
      },

      //? Children routes and pages by module
      //* Members
      {
        path: 'churches',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: ChurchChildrenRoutes,
      },
      {
        path: 'ministries',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: MinistryChildrenRoutes,
      },
      {
        path: 'disciples',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: DiscipleChildrenRoutes,
      },
      {
        path: 'pastors',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: PastorChildrenRoutes,
      },
      {
        path: 'copastors',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: CopastorChildrenRoutes,
      },
      {
        path: 'supervisors',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: SupervisorChildrenRoutes,
      },
      {
        path: 'preachers',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: PreacherChildrenRoutes,
      },
      {
        path: 'family-groups',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: FamilyGroupChildrenRoutes,
      },
      {
        path: 'zones',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: ZoneChildrenRoutes,
      },

      //* Offering income
      {
        path: 'offerings/income',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: OfferingIncomeChildrenRoutes,
      },

      //* Offering expenses
      {
        path: 'offerings/expenses',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: OfferingExpenseChildrenRoutes,
      },

      //* Users
      {
        path: 'users',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: UserChildrenRoutes,
      },

      //* Metrics and charts
      {
        path: 'metrics',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LazyDashboardLayout />
          </Suspense>
        ),
        children: MetricsChildrenRoutes,
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
