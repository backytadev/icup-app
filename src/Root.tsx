import { ThemeProvider } from '@/shared/components/toggle-theme/theme-provider';
import { Outlet } from 'react-router-dom';

export const Root = (): JSX.Element => {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Outlet />
    </ThemeProvider>
  );
};
