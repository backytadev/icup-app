import { createContext, useContext } from 'react';
// import { useAuthStore } from '@/stores/auth/auth.store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // const auth = useAuthStore();

  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
