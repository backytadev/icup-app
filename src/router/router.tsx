/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/promise-function-async */

import { lazy } from 'react';

import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Root } from '@/core/router/Root';
import { ProtectedRoute } from '@/core/router/ProtectedRoute';
import { RoleProtectedRoute } from '@/core/router/RoleProtectedRoute';

import { AuthLayout } from '@/layouts/AuthLayout';
import { LazyElement } from '@/shared/components/lazy/LazyElements';

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

//* Events
import { CalendarEventChildrenRoutes } from '@/modules/calendar-event/router/CalendarEventChildrenRoutes';

//* Metrics and charts
import { MetricsChildrenRoutes } from '@/modules/metrics/router/MetricsChildrenRoutes';

//* Users
import { UserRole } from '@/modules/user/enums/user-role.enum';
import { UserChildrenRoutes } from '@/modules/user/router/UserChildrenRoutes';

//* Auth
import { AuthChildrenRoutes } from '@/modules/auth/router/AuthChildrenRoutes';

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
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser]} />,
                children: ChurchChildrenRoutes,
              },
              {
                path: 'ministries',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser]} />,
                children: MinistryChildrenRoutes,
              },
              {
                path: 'pastors',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser]} />,
                children: PastorChildrenRoutes,
              },
              {
                path: 'copastors',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser]} />,
                children: CopastorChildrenRoutes,
              },
              {
                path: 'supervisors',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser, UserRole.User]} />,
                children: SupervisorChildrenRoutes,
              },
              {
                path: 'preachers',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser, UserRole.User]} />,
                children: PreacherChildrenRoutes,
              },
              {
                path: 'disciples',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser, UserRole.User]} />,
                children: DiscipleChildrenRoutes,
              },
              {
                path: 'family-groups',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser, UserRole.User]} />,
                children: FamilyGroupChildrenRoutes,
              },
              {
                path: 'zones',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser, UserRole.User]} />,
                children: ZoneChildrenRoutes,
              },
              {
                path: 'offerings',
                element: (
                  <RoleProtectedRoute
                    allowedRoles={[
                      UserRole.SuperUser,
                      UserRole.AdminUser,
                      UserRole.TreasurerUser,
                    ]}
                  >
                    <LazyElement>
                      <LazyOfferingOptionsPage />
                    </LazyElement>
                  </RoleProtectedRoute>
                ),
              },
              {
                path: 'metrics',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser, UserRole.MembershipUser, UserRole.TreasurerUser, UserRole.User]} />,
                children: MetricsChildrenRoutes,
              },
              {
                path: 'calendar-events',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser, UserRole.AdminUser]} />,
                children: CalendarEventChildrenRoutes,
              },
              {
                path: 'users',
                element: <RoleProtectedRoute allowedRoles={[UserRole.SuperUser]} />,
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
          <RoleProtectedRoute
            allowedRoles={[
              UserRole.SuperUser,
              UserRole.AdminUser,
              UserRole.TreasurerUser,

            ]}
          >
            <LazyElement>
              <LazyDashboardLayout />
            </LazyElement>
          </RoleProtectedRoute>
        ),
        children: OfferingIncomeChildrenRoutes,
      },
      {
        path: 'offerings/expenses',
        element: (
          <RoleProtectedRoute
            allowedRoles={[
              UserRole.SuperUser,
              UserRole.AdminUser,
              UserRole.TreasurerUser,
            ]}
          >
            <LazyElement>
              <LazyDashboardLayout />
            </LazyElement>
          </RoleProtectedRoute>
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
      <LazyElement>
        <LazyRedirectIfMatch />
      </LazyElement>
    ),
  },
  {
    path: '/404',
    element: (
      <LazyElement>
        <LazyNotFoundPage />,
      </LazyElement>
    ),
  },
]);
