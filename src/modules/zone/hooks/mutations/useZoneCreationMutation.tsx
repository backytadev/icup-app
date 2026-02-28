import { type UseFormReturn } from 'react-hook-form';
import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { createZone } from '@/modules/zone/services/zone.service';
import { type ZoneResponse, type ZoneFormData } from '@/modules/zone/types';

interface Options {
  zoneCreationForm: UseFormReturn<ZoneFormData, any, ZoneFormData | undefined>;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useZoneCreationMutation = ({
  zoneCreationForm,
  setIsInputDisabled,
}: Options): UseMutationResult<ZoneResponse, ErrorResponse, ZoneFormData, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: createZone,
    messages: { success: 'Zona creada exitosamente.' },
    redirectPath: '/zones',
    successDelay: 1600,
    callbacks: {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('zone');
          },
        });

        zoneCreationForm.reset();
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
