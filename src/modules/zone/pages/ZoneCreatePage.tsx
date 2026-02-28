import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { FcFlowChart } from 'react-icons/fc';

import { ZoneCreateForm } from '@/modules/zone/components/forms';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

export const ZoneCreatePage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Registrar Zona - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Nueva Zona'
          description='Completa el formulario para crear un nuevo registro de zona en el sistema.'
          titleColor='green'
          badge='Membresía'
          badgeColor='orange'
          icon={FcFlowChart}
          accentColor='orange'
        />

        <ZoneCreateForm />

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Zona - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ZoneCreatePage;
