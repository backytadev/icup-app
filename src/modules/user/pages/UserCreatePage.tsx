import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { FcManager } from 'react-icons/fc';

import { UserCreateForm } from '@/modules/user/components/forms';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

export const UserCreatePage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Registrar Usuario - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Nuevo Usuario'
          description='Completa el formulario para crear un nuevo registro de usuario en el sistema.'
          titleColor='green'
          badge='Administración'
          badgeColor='amber'
          icon={FcManager}
          accentColor='amber'
        />

        <UserCreateForm />

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Usuario - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UserCreatePage;
