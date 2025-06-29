/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type MemberRole } from '@/shared/enums/member-role.enum';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

interface Options {
  id: string;
  data: PreacherResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData>;
}

export const usePreacherUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  preacherUpdateForm,
}: Options): void => {
  const residenceDistrict = preacherUpdateForm.watch('residenceDistrict');
  const isDirectRelationToPastor = preacherUpdateForm.watch('isDirectRelationToPastor');

  //* Set data
  useEffect(() => {
    preacherUpdateForm.setValue('firstNames', data?.member?.firstNames ?? '');
    preacherUpdateForm.setValue('lastNames', data?.member?.lastNames ?? '');
    preacherUpdateForm.setValue('gender', data?.member?.gender ?? '');
    preacherUpdateForm.setValue('originCountry', data?.member?.originCountry ?? '');
    preacherUpdateForm.setValue(
      'birthDate',
      new Date(String(data?.member?.birthDate).replace(/-/g, '/'))
    );
    preacherUpdateForm.setValue('maritalStatus', data?.member?.maritalStatus ?? '');
    preacherUpdateForm.setValue('numberChildren', String(data?.member?.numberChildren) ?? '0');
    preacherUpdateForm.setValue(
      'conversionDate',
      new Date(String(data?.member?.conversionDate).replace(/-/g, '/'))
    );
    preacherUpdateForm.setValue('email', data?.member?.email ?? '');
    preacherUpdateForm.setValue('phoneNumber', data?.member?.phoneNumber ?? '');
    preacherUpdateForm.setValue('residenceCountry', data?.member?.residenceCountry ?? '');
    preacherUpdateForm.setValue('residenceDepartment', data?.member?.residenceDepartment ?? '');
    preacherUpdateForm.setValue('residenceProvince', data?.member?.residenceProvince ?? '');
    preacherUpdateForm.setValue('residenceDistrict', data?.member?.residenceDistrict ?? '');
    preacherUpdateForm.setValue('residenceUrbanSector', data?.member?.residenceUrbanSector ?? '');
    preacherUpdateForm.setValue('residenceAddress', data?.member?.residenceAddress ?? '');
    preacherUpdateForm.setValue('referenceAddress', data?.member?.referenceAddress ?? '');
    preacherUpdateForm.setValue('roles', data?.member?.roles as MemberRole[]);
    preacherUpdateForm.setValue('theirSupervisor', data?.theirSupervisor?.id ?? '');
    preacherUpdateForm.setValue('recordStatus', data?.recordStatus);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    preacherUpdateForm.resetField('residenceUrbanSector', {
      keepError: true,
    });
  }, [residenceDistrict]);

  //* Controller direct relation to pastor
  useEffect(() => {
    if (isDirectRelationToPastor) {
      preacherUpdateForm.resetField('theirCopastor', {
        keepError: true,
      });
    }

    if (!isDirectRelationToPastor) {
      preacherUpdateForm.resetField('theirPastor', {
        keepError: true,
      });
    }
  }, [isDirectRelationToPastor]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/preachers/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
