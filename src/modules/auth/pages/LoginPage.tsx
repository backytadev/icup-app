import { useEffect } from 'react';

import { LoginFormCard } from '@/modules/auth/components/LoginFormCard';
import { TestCredentialsCard } from '@/modules/auth/components/TestCredentialsCard';
import { Toaster } from 'sonner';

export const LoginPage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Iniciar Sesión - IcupApp';
  }, []);

  return (
    <div className='w-full flex flex-col items-center'>
      <Toaster position='top-center' richColors />
      <LoginFormCard />

      <div className='mt-5 w-full max-w-md'>
        <TestCredentialsCard />
      </div>
    </div>
  );
};
