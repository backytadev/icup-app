import { useEffect } from 'react';

import { LoginFormCard } from '@/modules/auth/components/LoginFormCard';
import { TestCredentialsCard } from '@/modules/auth/components/TestCredentialsCard';

export const LoginPage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Iniciar Sesión - IcupApp';
  }, []);

  return (
    <div className='w-full min-h-full flex flex-col items-center justify-center px-4 py-6 lg:py-0'>
      <LoginFormCard />

      <div className='mt-6 w-full max-w-md'>
        <TestCredentialsCard />
      </div>
    </div>
  );
};
