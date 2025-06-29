/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { type UseQueryResult } from '@tanstack/react-query';

import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';
import { type FamilyGroupPreacherUpdateFormData } from '@/modules/family-group/interfaces/family-group-preacher-update-form-data.interface';

import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';

interface Options {
  id: string;
  data: FamilyGroupResponse | undefined;
  preachersQuery: UseQueryResult<PreacherResponse[], Error>;
  familyGroupPreacherUpdateForm: UseFormReturn<
    FamilyGroupPreacherUpdateFormData,
    any,
    FamilyGroupPreacherUpdateFormData
  >;
}

export const useFamilyGroupPreacherUpdateEffects = ({
  id,
  data,
  familyGroupPreacherUpdateForm,
  preachersQuery,
}: Options): void => {
  //* Watchers
  const newTheirPreacher = familyGroupPreacherUpdateForm.watch('newTheirPreacher');

  //* Set data
  useEffect(() => {
    familyGroupPreacherUpdateForm.setValue(
      'currentTheirPreacher',
      data?.theirPreacher?.id
        ? `${data?.theirPreacher?.firstNames} ${data?.theirPreacher?.lastNames}`
        : '❌ Sin Predicador'
    );
    familyGroupPreacherUpdateForm.setValue(
      'currentFamilyGroup',
      data?.familyGroupName ? data?.familyGroupName : '❌ Sin Grupo Familiar'
    );
  }, []);

  useEffect(() => {
    if (newTheirPreacher) {
      const familyGroupByPreacher = preachersQuery?.data?.find(
        (preacher) => newTheirPreacher === preacher.id
      );
      familyGroupPreacherUpdateForm.setValue(
        'newFamilyGroup',
        familyGroupByPreacher?.theirFamilyGroup?.id
          ? familyGroupByPreacher?.theirFamilyGroup?.familyGroupName
          : '❌ No existe grupo familiar'
      );
    }
  }, [newTheirPreacher]);

  //* Generate dynamic url
  useEffect(() => {
    const originalUrl = window.location.href;

    if (id) {
      const url = new URL(window.location.href);
      url.pathname = `/family-groups/update/${id}/exchange-preacher`;

      window.history.replaceState({}, '', url);
    }

    return () => {
      window.history.replaceState({}, '', originalUrl);
    };
  }, [id]);
};
