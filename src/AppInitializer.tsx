import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth/auth.store';
import { AppLoadingSpinner } from './shared/components/spinners/AppLoadingSpinner';

export const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const verifyTokenExists = useAuthStore((state) => state.verifyTokenExists);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await verifyTokenExists();
      setReady(true);
    };
    init();
  }, []);

  if (!ready) return <AppLoadingSpinner />;

  return <>{children}</>;
};
