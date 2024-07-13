import { createBrowserRouter } from 'react-router-dom';

import { Root } from '@/Root';
import { DashboardLayout, AuthLayout } from '@/layouts';

// Direct pages
import { DashboardPage } from '@/app/dashboard/pages';
import { ChurchOptionsPage } from '@/app/church/pages';
import { DiscipleOptionsPage } from '@/app/disciple/pages';
import { PastorOptionsPage } from '@/app/pastor/pages';
import { CopastorOptionsPage } from '@/app/copastor/pages';
import { SupervisorOptionsPage } from '@/app/supervisor/pages';
import { PreacherOptionsPage } from '@/app/preacher/pages';
// import { LeaderOptionsPage } from '@/app/leader/pages';
import { FamilyGroupOptionsPage } from '@/app/family-group/pages';
import { OfferingOptionsPage } from '@/app/offering/pages';
import { OfferingIncomeOptionsPage } from '@/app/offering/income/pages';
import { OfferingExpensesOptionsPage } from '@/app/offering/expenses/pages';
import { MetricsOptionsPage } from '@/app/metrics/pages';
import { UserOptionsPage } from '@/app/user/pages';

// Routers by module
import { ChurchChildrenRoutes } from '@/app/church/router';
import { DiscipleChildrenRoutes } from '@/app/disciple/router';
import { PastorChildrenRoutes } from '@/app/pastor/router';
import { CopastorChildrenRoutes } from '@/app/copastor/router';
import { SupervisorChildrenRoutes } from '@/app/supervisor/router';
import { PreacherChildrenRoutes } from '@/app/preacher/router';
// import { LeaderChildrenRoutes } from '@/app/leader/router';
import { FamilyGroupChildrenRoutes } from '@/app/family-group/router';
import { OfferingIncomeChildrenRoutes } from '@/app/offering/income/router';
import { OfferingExpensesChildrenRoutes } from '@/app/offering/expenses/router';
import { UserChildrenRoutes } from '@/app/user/router';
import { MetricsChildrenRoutes } from '@/app/metrics/router';
import { AuthChildrenRoutes } from '@/auth/router';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          // Main modules pages
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/churches', element: <ChurchOptionsPage /> },
          { path: '/disciples', element: <DiscipleOptionsPage /> },
          { path: '/pastors', element: <PastorOptionsPage /> },
          { path: '/copastors', element: <CopastorOptionsPage /> },
          { path: '/supervisors', element: <SupervisorOptionsPage /> },
          { path: '/preachers', element: <PreacherOptionsPage /> },
          // { path: '/leaders', element: <LeaderOptionsPage /> },
          { path: '/family-groups', element: <FamilyGroupOptionsPage /> },
          { path: '/offerings', element: <OfferingOptionsPage /> },
          { path: '/offerings/income', element: <OfferingIncomeOptionsPage /> },
          { path: '/offerings/expenses', element: <OfferingExpensesOptionsPage /> },
          { path: '/metrics', element: <MetricsOptionsPage /> },
          { path: '/users', element: <UserOptionsPage /> },
        ],
      },
      // Specific routes for each type of module
      { path: '/churches', element: <DashboardLayout />, children: ChurchChildrenRoutes },
      { path: '/disciples', element: <DashboardLayout />, children: DiscipleChildrenRoutes },
      { path: '/pastors', element: <DashboardLayout />, children: PastorChildrenRoutes },
      { path: '/copastors', element: <DashboardLayout />, children: CopastorChildrenRoutes },
      { path: '/supervisors', element: <DashboardLayout />, children: SupervisorChildrenRoutes },
      { path: '/preachers', element: <DashboardLayout />, children: PreacherChildrenRoutes },
      // { path: '/leaders', element: <DashboardLayout />, children: LeaderChildrenRoutes },
      { path: '/family-groups', element: <DashboardLayout />, children: FamilyGroupChildrenRoutes },

      // Routes offering (income)
      {
        path: '/offerings/income',
        element: <DashboardLayout />,
        children: OfferingIncomeChildrenRoutes,
      },

      // Routes offering (expenses)
      {
        path: '/offerings/expenses',
        element: <DashboardLayout />,
        children: OfferingExpensesChildrenRoutes,
      },

      // Routes user
      { path: '/users', element: <DashboardLayout />, children: UserChildrenRoutes },

      // Routes metrics
      { path: '/metrics', element: <DashboardLayout />, children: MetricsChildrenRoutes },

      /// Auth Routes
      { path: '/auth', element: <AuthLayout />, children: AuthChildrenRoutes },
    ],
  },
]);
