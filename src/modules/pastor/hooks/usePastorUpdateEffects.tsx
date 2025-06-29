/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';

interface Options {
  id: string;
  data: PastorResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  pastorUpdateForm: UseFormReturn<PastorFormData, any, PastorFormData>;
}

export const usePastorUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  pastorUpdateForm,
}: Options): void => {
  const residenceDistrict = pastorUpdateForm.watch('residenceDistrict');

  //* Set data
  useEffect(() => {
    pastorUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    pastorUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    pastorUpdateForm.setValue('gender', data?.member?.gender ?? '');
    pastorUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    pastorUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    pastorUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    pastorUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    pastorUpdateForm.setValue(
      'conversionDate',
      new Date(String(data?.member?.conversionDate).replace(/-/g, '/'))
    );
    pastorUpdateForm.setValue('email', data?.member?.email ?? '');
    pastorUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    pastorUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    pastorUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    pastorUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    pastorUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    pastorUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    pastorUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    pastorUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    pastorUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    pastorUpdateForm.setValue('theirChurch', data?.theirChurch?.id);
    pastorUpdateForm.setValue('recordStatus', data?.recordStatus);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    pastorUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/pastors/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
