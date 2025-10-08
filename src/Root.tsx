import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/core/theme/theme-provider';

export const Root = (): JSX.Element => {
  const { pathname } = useLocation();

  if (pathname === '/') {
    return <Navigate to='/auth/login' />;
  }

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Outlet />
    </ThemeProvider>
  );
};
