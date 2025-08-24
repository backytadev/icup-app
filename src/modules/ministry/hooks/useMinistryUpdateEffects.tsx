/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MinistryServiceTime } from '@/modules/ministry/enums/ministry-service-time.enum';
import { type MinistryResponse } from '@/modules/ministry/interfaces/ministry-response.interface';
import { type MinistryFormData } from '@/modules/ministry/interfaces/ministry-form-data.interface';

interface Options {
  id: string;
  data: MinistryResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  ministryUpdateForm: UseFormReturn<MinistryFormData, any, MinistryFormData | undefined>;
}

export const useMinistryUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  ministryUpdateForm,
}: Options): void => {
  //* Set data
  useEffect(() => {
    ministryUpdateForm.setValue('customMinistryName', data?.customMinistryName!);
    ministryUpdateForm.setValue(
      'foundingDate',
      new Date(String(data?.foundingDate).replace(/-/g, '/') as any)
    );
    ministryUpdateForm.setValue('ministryType', data?.ministryType ?? '');
    ministryUpdateForm.setValue('serviceTimes', data?.serviceTimes as MinistryServiceTime[]);
    ministryUpdateForm.setValue('email', data?.email ?? '');
    ministryUpdateForm.setValue('phoneNumber', data?.phoneNumber ?? '');
    ministryUpdateForm.setValue('country', data?.country ?? '');
    ministryUpdateForm.setValue('department', data?.department ?? '');
    ministryUpdateForm.setValue('province', data?.province ?? '');
    ministryUpdateForm.setValue('district', data?.district ?? '');
    ministryUpdateForm.setValue('urbanSector', data?.urbanSector ?? '');
    ministryUpdateForm.setValue('address', data?.address ?? '');
    ministryUpdateForm.setValue('referenceAddress', data?.referenceAddress ?? '');
    ministryUpdateForm.setValue('theirPastor', data?.theirPastor?.id);
    ministryUpdateForm.setValue('recordStatus', data?.recordStatus);

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
      url.pathname = `/ministries/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
