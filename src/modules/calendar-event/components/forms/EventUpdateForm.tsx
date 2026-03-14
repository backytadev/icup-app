/* eslint-disable @typescript-eslint/no-floating-promises */

import { FiCalendar } from 'react-icons/fi';

import { type CalendarEventResponse } from '@/modules/calendar-event/types/calendar-event-response.interface';
import { CalendarEventCategoryNames } from '@/modules/calendar-event/enums/calendar-event-category.enum';
import { useCalendarEventForm } from '@/modules/calendar-event/hooks/forms/useCalendarEventForm';
import { EventFormFields } from '@/modules/calendar-event/components/forms/EventFormFields';

import { cn } from '@/shared/lib/utils';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';

interface EventUpdateFormProps {
  id: string;
  data: CalendarEventResponse | undefined;
  dialogClose: () => void;
  scrollToTop: () => void;
}

export const EventUpdateForm = ({
  id,
  data,
  dialogClose,
  scrollToTop,
}: EventUpdateFormProps): JSX.Element => {
  const formReturn = useCalendarEventForm({ mode: 'update', id, data, dialogClose, scrollToTop });

  const {
    form,
    isSubmitButtonDisabled,
    isMessageErrorDisabled,
    isPending,
    handleSubmit,
  } = formReturn;

  const categoryName = data?.category
    ? (CalendarEventCategoryNames[data.category as keyof typeof CalendarEventCategoryNames] ?? data.category)
    : null;

  return (
    <div className='w-full lg:w-[980px] -mt-4 md:-mt-2'>

      {/* ── Gradient header ── */}
      <div className='relative overflow-hidden rounded-t-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 dark:from-orange-600 dark:via-amber-600 dark:to-orange-700 px-6 py-5'>
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/10' />
          <div className='absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5' />
        </div>
        <div className='relative z-10 flex items-start justify-between gap-3'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1.5'>
              <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                Actualización
              </span>
              <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/20 text-white rounded font-inter'>
                Evento
              </span>
              {categoryName && (
                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-white/15 text-teal-100 rounded font-inter'>
                  {categoryName}
                </span>
              )}
            </div>
            <h2 className='text-xl md:text-2xl font-bold text-white font-outfit leading-tight'>
              Modificar Evento
            </h2>
            <p className='text-white/80 text-[13px] md:text-[14px] font-inter mt-0.5 line-clamp-1'>
              {data?.title ?? ''}
            </p>
          </div>
          <div className='flex-shrink-0 p-2 bg-white/10 rounded-lg mt-1'>
            <FiCalendar className='w-5 h-5 text-white' />
          </div>
        </div>
      </div>

      {/* ── Form content ── */}
      <div className='bg-white dark:bg-slate-900 border border-t-0 border-slate-200/80 dark:border-slate-700/50 rounded-b-xl'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='w-full flex flex-col md:grid grid-cols-2 gap-x-8 gap-y-4 p-5 md:p-6'
          >
            <EventFormFields {...formReturn} />

            {/* Status */}
            {isMessageErrorDisabled ? (
              <p className='md:col-span-2 text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
                ❌ Datos incompletos, verifica los campos requeridos.
              </p>
            ) : (
              <p className='md:col-span-2 text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
                ¡Campos completados correctamente!
              </p>
            )}

            {/* Actions */}
            <div className='md:col-span-2 flex gap-3'>
              <Button
                type='submit'
                disabled={isSubmitButtonDisabled || isMessageErrorDisabled}
                className={cn(
                  'h-11 text-sm font-semibold w-[50%] mx-auto',
                  'bg-gradient-to-r from-emerald-500 to-green-600',
                  'hover:from-emerald-600 hover:to-green-700',
                  'text-white border-transparent',
                  isPending &&
                  'from-emerald-500 to-emerald-500 hover:from-emerald-500 hover:to-emerald-500 disabled:opacity-100',
                )}
              >
                {isPending ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
