import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/auth.store';
import { LoadingSpinner } from '@/shared/components/spinners/LoadingSpinner';

export const ProtectedRoute = () => {
  const authStatus = useAuthStore((state) => state.status);

  if (authStatus === 'pending') return <LoadingSpinner />;
  if (authStatus === 'unauthorized') return <Navigate to='/auth/login' replace />;

  return <Outlet />;
};
