import { useEffect } from 'react';

import { Toaster } from 'sonner';

import { ChurchModuleHeader } from '@/modules/church/components/shared';
import { ChurchFormCard } from '@/modules/church/components/shared';
import { ChurchCreateForm } from '@/modules/church/components/forms';

export const ChurchCreatePage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Registrar Iglesia - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        {/* Header */}
        <ChurchModuleHeader
          title='Registrar Nueva Iglesia'
          description='Completa el formulario para crear un nuevo registro de iglesia o anexo en el sistema.'
          titleColor='green'
        />

        {/* Form Card */}
        <ChurchFormCard
          title='Información de la Iglesia'
          description='Por favor completa todos los campos requeridos para registrar la nueva iglesia.'
        >
          <ChurchCreateForm />
        </ChurchFormCard>

        {/* Footer */}
        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Iglesia - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ChurchCreatePage;
