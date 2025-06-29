/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';

interface Options {
  id: string;
  data: CopastorResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  copastorUpdateForm: UseFormReturn<CopastorFormData, any, CopastorFormData>;
}

export const useCopastorUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  copastorUpdateForm,
}: Options): void => {
  const residenceDistrict = copastorUpdateForm.watch('residenceDistrict');

  //* Set data
  useEffect(() => {
    copastorUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    copastorUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    copastorUpdateForm.setValue('gender', data?.member?.gender ?? '');
    copastorUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    copastorUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    copastorUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    copastorUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    copastorUpdateForm.setValue(
      'conversionDate',
      new Date(String(data?.member?.conversionDate).replace(/-/g, '/'))
    );
    copastorUpdateForm.setValue('email', data?.member?.email ?? '');
    copastorUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    copastorUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    copastorUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    copastorUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    copastorUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    copastorUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    copastorUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    copastorUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    copastorUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    copastorUpdateForm.setValue('theirPastor', data?.theirPastor?.id);
    copastorUpdateForm.setValue('recordStatus', data?.recordStatus);

    setTimeout(() => {
      setIsLoadingData(false);
    }, 1000);
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    copastorUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/copastors/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
