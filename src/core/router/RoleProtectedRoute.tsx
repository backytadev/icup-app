import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth/auth.store';
import { UserRole } from '@/modules/user/enums/user-role.enum';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleProtectedRoute = ({ allowedRoles, children }: RoleProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to='/auth/login' replace />;
  }

  const hasPermission = user.roles.some((role: string) => allowedRoles.includes(role as UserRole));

  if (!hasPermission) {
    return <Navigate to='/404' replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
