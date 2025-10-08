import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/auth.store';

export const AuthGuard = () => {
  const { status } = useAuthStore();

  if (status === 'pending') return <div>Cargando...</div>;
  if (status !== 'authorized') return <Navigate to='/login' />;

  return <Outlet />;
};
