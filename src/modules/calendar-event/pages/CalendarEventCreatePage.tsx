import { useEffect } from 'react';

import { Toaster } from 'sonner';
import { FiCalendar } from 'react-icons/fi';

import { EventCreateForm } from '@/modules/calendar-event/components/forms/EventCreateForm';

import { ModuleHeader } from '@/shared/components/page-header/ModuleHeader';

export const CalendarEventCreatePage = (): JSX.Element => {
  useEffect(() => {
    document.title = 'Crear Evento - IcupApp';
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Toaster position='top-center' richColors />
      <div className='max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
        <ModuleHeader
          title='Registrar Nuevo Evento'
          description='Completa el formulario para crear un nuevo registro de evento en el sistema.'
          titleColor='teal'
          badge='Eventos'
          badgeColor='teal'
          icon={FiCalendar}
          accentColor='teal'
        />

        <div className='w-full max-w-[1220px] mx-auto'>
          <div className='bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/50 rounded-xl'>
            <EventCreateForm />
          </div>
        </div>

        <footer className='pt-4 pb-2 text-center'>
          <p className='text-xs text-slate-400 dark:text-slate-500 font-inter'>
            Modulo Eventos - ICUP App &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CalendarEventCreatePage;
