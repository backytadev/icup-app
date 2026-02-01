import { useEffect } from 'react';
import { Toaster } from 'sonner';

import { MinistryModuleHeader, MinistryCreateForm } from '@/modules/ministry/components';

export const MinistryCreatePage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Registrar Ministerio - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <MinistryModuleHeader
          title='Registrar Nuevo Ministerio'
          description='Completa el formulario para crear un nuevo registro de ministerio en el sistema.'
          titleColor='green'
        />

        <MinistryCreateForm />

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Ministerio - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MinistryCreatePage;
