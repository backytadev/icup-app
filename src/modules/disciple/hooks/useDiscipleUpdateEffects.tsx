/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

interface Options {
  id: string;
  data: DiscipleResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  discipleUpdateForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData>;
}

export const useDiscipleUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  discipleUpdateForm,
}: Options): void => {
  const residenceDistrict = discipleUpdateForm.watch('residenceDistrict');

  //* Set data
  useEffect(() => {
    discipleUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    discipleUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    discipleUpdateForm.setValue('gender', data?.member?.gender ?? '');
    discipleUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    discipleUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    discipleUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    discipleUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    discipleUpdateForm.setValue(
      'conversionDate',
      new Date(String(data?.member?.conversionDate).replace(/-/g, '/'))
    );
    discipleUpdateForm.setValue('email', data?.member?.email ?? '');
    discipleUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    discipleUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    discipleUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    discipleUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    discipleUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    discipleUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    discipleUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    discipleUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    discipleUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    discipleUpdateForm.setValue('theirFamilyGroup', data?.theirFamilyGroup?.id);
    discipleUpdateForm.setValue('recordStatus', data?.recordStatus);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    discipleUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/disciples/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
