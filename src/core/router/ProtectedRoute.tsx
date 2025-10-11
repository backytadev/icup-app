import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/auth.store';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

export const ProtectedRoute = () => {
  const authStatus = useAuthStore((state) => state.status);
  const authToken = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (authToken && user && authStatus === 'pending') return <LoadingSpinner />;
  if (!authToken && !user) return <Navigate to='/auth/login' replace />;
  if (authStatus === 'unauthorized') return <Navigate to='/auth/login' replace />;

  return <Outlet />;
};
