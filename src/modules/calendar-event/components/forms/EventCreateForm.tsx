import { cn } from '@/shared/lib/utils';

import { useCalendarEventForm } from '@/modules/calendar-event/hooks/forms/useCalendarEventForm';
import { EventFormFields } from '@/modules/calendar-event/components/forms/EventFormFields';

import { Form } from '@/shared/components/ui/form';
import { Button } from '@/shared/components/ui/button';

export const EventCreateForm = (): JSX.Element => {
  const formReturn = useCalendarEventForm({ mode: 'create' });

  const {
    form,
    isSubmitButtonDisabled,
    isMessageErrorDisabled,
    isPending,
    handleSubmit,
  } = formReturn;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='w-full flex flex-col md:grid grid-cols-2 gap-x-8 gap-y-4 p-5 md:p-6'
      >
        <EventFormFields {...formReturn} />

        {/* Status */}
        {isMessageErrorDisabled ? (
          <p className='md:col-span-2 text-center text-red-500 text-[12.5px] md:text-[13px] font-bold'>
            ❌ Datos incompletos, completa todos los campos requeridos para crear el evento.
          </p>
        ) : (
          <p className='md:col-span-2 text-center text-green-500 text-[12.5px] md:text-[13px] font-bold'>
            ¡Campos completados correctamente!
          </p>
        )}

        {/* Submit */}
        <div className='md:col-span-2 flex justify-center'>
          <Button
            disabled={isSubmitButtonDisabled || isMessageErrorDisabled}
            type='submit'
            className={cn(
              'w-full md:w-[20rem] text-sm h-11 font-semibold transition-all duration-300',
              'bg-gradient-to-r from-emerald-500 to-green-600',
              'hover:from-emerald-600 hover:to-green-700',
              'hover:shadow-lg hover:shadow-emerald-500/25',
              isPending &&
              'from-emerald-500 to-emerald-500 hover:from-emerald-500 hover:to-emerald-500 disabled:opacity-100 text-white',
            )}
          >
            {isPending ? 'Procesando...' : 'Registrar Evento'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
