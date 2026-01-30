import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth/auth.store';
import { ToggleLayoutLogin } from '@/core/theme/ToggleLayoutLogin';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';
import { LoginBrandingPanel } from '@/modules/auth/components/LoginBrandingPanel';

export const AuthLayout = (): JSX.Element => {
  const authStatus = useAuthStore((state) => state.status);

  if (authStatus === 'pending') return <LoadingSpinner />;
  if (authStatus === 'authorized') return <Navigate to='/dashboard' replace />;

  return (
    <div className='animate-fadeIn h-screen overflow-hidden'>
      <div className='fixed top-4 right-4 z-50'>
        <ToggleLayoutLogin />
      </div>

      <div className='flex h-full'>
        <LoginBrandingPanel />

        <div className='w-full lg:w-1/2 h-full flex flex-col relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20' />

          <div className='lg:hidden absolute inset-0 overflow-hidden pointer-events-none'>
            <div className='absolute -top-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/15 to-indigo-500/10 blur-3xl' />
            <div className='absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-gradient-to-tl from-amber-400/10 to-orange-500/5 blur-3xl' />
          </div>

          <div className='flex-1 flex items-center justify-center px-4 py-6 sm:p-6 relative z-10 overflow-y-auto'>
            <Outlet />
          </div>

          <footer className='py-3 text-center relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm'>
            <p className='text-xs text-slate-500 dark:text-slate-400 font-inter'>
              &copy; {new Date().getFullYear()} ICUP - Iglesia Cristiana Unidos en su Presencia
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
