/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type ZoneResponse } from '@/modules/zone/interfaces/zone-response.interface';
import { type ZoneFormData } from '@/modules/zone/interfaces/zone-form-data.interface';

interface Options {
  id: string;
  data: ZoneResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  zoneUpdateForm: UseFormReturn<ZoneFormData, any, ZoneFormData>;
}

export const useUpdateZoneEffects = ({
  id,
  data,
  setIsLoadingData,
  zoneUpdateForm,
}: Options): void => {
  //* Set data
  useEffect(() => {
    zoneUpdateForm.setValue('zoneName', data?.zoneName ?? '');
    zoneUpdateForm.setValue('country', data?.country ?? '');
    zoneUpdateForm.setValue('department', data?.department ?? '');
    zoneUpdateForm.setValue('province', data?.province ?? '');
    zoneUpdateForm.setValue('district', data?.district ?? '');
    zoneUpdateForm.setValue('theirSupervisor', data?.theirSupervisor?.id);
    zoneUpdateForm.setValue('recordStatus', data?.recordStatus);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/zones/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
