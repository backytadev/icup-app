import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { FiHome } from 'react-icons/fi';

import { FamilyGroupCreateForm } from '@/modules/family-group/components/forms';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

export const FamilyGroupCreatePage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Registrar Grupo Familiar - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Nuevo Grupo Familiar'
          description='Completa el formulario para crear un nuevo registro de grupo familiar en el sistema.'
          titleColor='green'
          badge='Membresía'
          badgeColor='amber'
          icon={FiHome}
          accentColor='amber'
        />

        <FamilyGroupCreateForm />

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Grupo Familiar - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default FamilyGroupCreatePage;
