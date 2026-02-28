import { type UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { type ErrorResponse } from '@/shared/interfaces/error-response.interface';
import { useMutationWrapper } from '@/shared/hooks';

import { type ZoneResponse } from '@/modules/zone/types';
import {
  updateZone,
  type UpdateZoneOptions,
} from '@/modules/zone/services/zone.service';

interface Options {
  dialogClose: () => void;
  scrollToTop: () => void;
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useZoneSupervisorUpdateMutation = ({
  dialogClose,
  scrollToTop,
  setIsInputDisabled,
}: Options): UseMutationResult<ZoneResponse, ErrorResponse, UpdateZoneOptions, unknown> => {
  const queryClient = useQueryClient();

  return useMutationWrapper({
    mutationFn: updateZone,
    messages: { success: 'Supervisor intercambiado correctamente.' },
    successDelay: 1500,
    errorDelay: 1500,
    callbacks: {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('zone');
          },
        });

        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0];
            return typeof queryKey === 'string' && queryKey.includes('supervisor');
          },
        });

        scrollToTop();
        dialogClose();
      },
      onErrorCallback: () => {
        setIsInputDisabled(false);
      },
    },
  });
};
