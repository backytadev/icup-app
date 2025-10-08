import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/core/theme/theme-provider';

export const Root = (): JSX.Element => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Outlet />
    </ThemeProvider>
  );
};
