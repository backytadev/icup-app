import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth/auth.store';

import { Sidebar } from '@/core/layout/sidebar/Sidebar';
import { SidebarMobile } from '@/core/layout/sidebar/SidebarMobile';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

export const DashboardLayout = (): JSX.Element | null => {
  const authStatus = useAuthStore((state) => state.status);

  if (authStatus === 'pending') return <LoadingSpinner />;
  if (authStatus === 'unauthorized') return <Navigate to='/auth/login' replace />;

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 antialiased selection:bg-blue-600 selection:text-white'>
      <SidebarMobile />

      <div className='flex'>
        <Sidebar />

        <main className='flex-1 w-full min-h-screen'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
