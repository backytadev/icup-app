import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createCalendarEvent } from '@/modules/calendar-event/services/calendar-event.service';
import { type CalendarEventFormData, type CalendarEventResponse } from '@/modules/calendar-event/types';

interface Options {
  eventCreationForm: UseFormReturn<CalendarEventFormData, any, CalendarEventFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useCalendarEventCreationMutation = ({
  eventCreationForm,
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
}: Options): UseMutationResult<CalendarEventResponse, ErrorResponse, CalendarEventFormData, unknown> => {
  return useMutationWrapper({
    mutationFn: createCalendarEvent,
    messages: { success: 'Evento creado exitosamente.' },
    redirectPath: '/calendar-events',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          eventCreationForm.reset();
        }, 1700);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      },
    },
  });
};
