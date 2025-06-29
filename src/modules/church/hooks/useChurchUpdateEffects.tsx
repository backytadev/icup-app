/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type ChurchServiceTime } from '@/modules/church/enums/church-service-time.enum';
import { type ChurchResponse } from '@/modules/church/interfaces/church-response.interface';
import { type ChurchFormData } from '@/modules/church/interfaces/church-form-data.interface';

interface Options {
  id: string;
  data: ChurchResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  churchUpdateForm: UseFormReturn<ChurchFormData, any, ChurchFormData>;
}

export const useChurchUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  churchUpdateForm,
}: Options): void => {
  //* Set data
  useEffect(() => {
    churchUpdateForm.setValue('churchName', data?.churchName!);
    churchUpdateForm.setValue('abbreviatedChurchName', data?.abbreviatedChurchName!);
    churchUpdateForm.setValue(
      'foundingDate',
      new Date(String(data?.foundingDate).replace(/-/g, '/') as any)
    );
    churchUpdateForm.setValue('serviceTimes', data?.serviceTimes as ChurchServiceTime[]);
    churchUpdateForm.setValue('email', data?.email ?? '');
    churchUpdateForm.setValue('phoneNumber', data?.phoneNumber ?? '');
    churchUpdateForm.setValue('country', data?.country ?? '');
    churchUpdateForm.setValue('department', data?.department ?? '');
    churchUpdateForm.setValue('province', data?.province ?? '');
    churchUpdateForm.setValue('district', data?.district ?? '');
    churchUpdateForm.setValue('urbanSector', data?.urbanSector ?? '');
    churchUpdateForm.setValue('address', data?.address ?? '');
    churchUpdateForm.setValue('referenceAddress', data?.referenceAddress ?? '');
    churchUpdateForm.setValue('isAnexe', data?.isAnexe);
    churchUpdateForm.setValue('theirMainChurch', data?.theirMainChurch?.id);
    churchUpdateForm.setValue('recordStatus', data?.recordStatus);

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
      url.pathname = `/churches/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
