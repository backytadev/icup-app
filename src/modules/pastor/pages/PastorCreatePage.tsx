import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { FcPodiumWithSpeaker } from 'react-icons/fc';

import { PastorCreateForm } from '@/modules/pastor/components/forms/PastorCreateForm';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

export const PastorCreatePage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Modulo Pastor - Crear';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Pastor'
          description='Ingresa los datos del nuevo pastor para registrarlo en el sistema.'
          badge='Membresía'
          badgeColor='purple'
          icon={FcPodiumWithSpeaker}
          accentColor='purple'
        />

        <PastorCreateForm />

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Pastor - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PastorCreatePage;
