import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { updateCalendarEvent, type UpdateEventOptions } from '@/modules/calendar-event/services/calendar-event.service';
import { type CalendarEventFormData, type CalendarEventResponse } from '@/modules/calendar-event/types';

interface Options {
  eventUpdateForm: UseFormReturn<CalendarEventFormData, any, CalendarEventFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  dialogClose: () => void;
  scrollToTop: () => void;
}

export const useCalendarEventUpdateMutation = ({
  setIsInputDisabled,
  setIsSubmitButtonDisabled,
  dialogClose,
  scrollToTop
}: Options): UseMutationResult<CalendarEventResponse, ErrorResponse, UpdateEventOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateCalendarEvent,
    messages: { success: 'Evento actualizado exitosamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];
              return typeof queryKey === 'string' && queryKey.includes('calendar-event');
            },
          });
        }, 700);

        scrollToTop();

        setTimeout(() => {
          dialogClose();
          setIsInputDisabled(false);
          setIsSubmitButtonDisabled(false);
        }, 1700);
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
        setIsSubmitButtonDisabled(false);
      },
    },
  });
};
