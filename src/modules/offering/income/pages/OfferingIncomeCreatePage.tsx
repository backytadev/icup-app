import { GiReceiveMoney } from 'react-icons/gi';
import { Toaster } from 'sonner';

import { OfferingIncomeCreateForm } from '@/modules/offering/income/components';
import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

export const OfferingIncomeCreatePage = (): JSX.Element => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />

      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Nuevo Ingreso'
          description='Completa el formulario para crear un nuevo registro de ingreso de ofrenda en el sistema.'
          titleColor='green'
          badge='Ofrenda'
          badgeColor='amber'
          icon={GiReceiveMoney}
          accentColor='amber'
        />

        <OfferingIncomeCreateForm />

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Iglesia - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default OfferingIncomeCreatePage;
