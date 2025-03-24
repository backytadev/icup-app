/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth/auth.store';

import { SideMenu } from '@/shared/components/side-menu/SideMenu';
import { ToggleLayout } from '@/shared/components/toggle-theme/ToggleLayout';
import { LoadingSpinner } from '@/shared/components/spinner/LoadingSpinner';

export const DashboardLayout = (): JSX.Element => {
  //* States
  const authStatus = useAuthStore((state) => state.status);

  if (authStatus === 'pending') {
    return <LoadingSpinner />;
  }

  if (authStatus === 'unauthorized') {
    return <Navigate to='/auth/login' />;
  }

  return (
    <div className='light:bg-slate-500 w-full h-auto antialiased light:text-slate-900 selection:bg-blue-900 selection:text-white'>
      <div className='flex flex-col md:flex-row md:relative md:w-full md:min-h-full relative'>
        <SideMenu />

        <div className='w-full px-4 py-0 relative'>
          <ToggleLayout />

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
