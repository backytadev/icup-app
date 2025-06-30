/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';
import { type FamilyGroupFormData } from '@/modules/family-group/interfaces/family-group-form-data.interface';

import { RecordStatus } from '@/shared/enums/record-status.enum';

interface Options {
  id: string;
  data: FamilyGroupResponse | undefined;
  setIsLoadingData: React.Dispatch<React.SetStateAction<boolean>>;
  familyGroupUpdateForm: UseFormReturn<FamilyGroupFormData, any, FamilyGroupFormData | undefined>;
  setIsInputTheirPreacherDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFamilyGroupUpdateEffects = ({
  id,
  data,
  setIsLoadingData,
  setIsInputTheirPreacherDisabled,
  familyGroupUpdateForm,
}: Options): void => {
  const district = familyGroupUpdateForm.watch('district');
  const theirZone = familyGroupUpdateForm.watch('theirZone');
  const theirPreacher = familyGroupUpdateForm.watch('theirPreacher');

  //* Set data
  useEffect(() => {
    familyGroupUpdateForm.setValue('familyGroupName', data?.familyGroupName ?? '');
    familyGroupUpdateForm.setValue('serviceTime', data?.serviceTime ?? '');
    familyGroupUpdateForm.setValue('country', data?.country ?? '');
    familyGroupUpdateForm.setValue('department', data?.department ?? '');
    familyGroupUpdateForm.setValue('province', data?.province ?? '');
    familyGroupUpdateForm.setValue('district', data?.district ?? '');
    familyGroupUpdateForm.setValue('urbanSector', data?.urbanSector ?? '');
    familyGroupUpdateForm.setValue('address', data?.address ?? '');
    familyGroupUpdateForm.setValue('referenceAddress', data?.referenceAddress ?? '');
    familyGroupUpdateForm.setValue('theirZone', data?.theirZone?.id);
    familyGroupUpdateForm.setValue('theirPreacher', data?.theirPreacher?.id);
    familyGroupUpdateForm.setValue('recordStatus', data?.recordStatus);

    const timeoutId = setTimeout(() => {
      setIsLoadingData(false);
    }, 1200);

    return () => {
      clearTimeout(timeoutId); // Limpiar el timeout cuando el componente se desmonte
    };
  }, []);

  //* Controller district and urban sector
  useEffect(() => {
    familyGroupUpdateForm.resetField('urbanSector', { keepError: true });
  }, [district]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/family-groups/update/${id}/edit`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);

  useEffect(() => {
    if (theirPreacher) {
      setIsInputTheirPreacherDisabled(true);
    }
  }, [theirPreacher]);

  useEffect(() => {
    if (theirZone && (!data?.theirPreacher?.id || data?.recordStatus === RecordStatus.Inactive)) {
      setIsInputTheirPreacherDisabled(false);
    }

    familyGroupUpdateForm.resetField('theirPreacher', {
      keepError: true,
    });
  }, [theirZone]);
};
