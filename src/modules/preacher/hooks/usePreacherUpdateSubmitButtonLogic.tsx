/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

interface Options {
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  isRelationSelectDisabled: boolean;
}

export const usePreacherUpdateSubmitButtonLogic = ({
  preacherUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isRelationSelectDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = preacherUpdateForm.watch('firstNames');
  const lastNames = preacherUpdateForm.watch('lastNames');
  const gender = preacherUpdateForm.watch('gender');
  const birthDate = preacherUpdateForm.watch('birthDate');
  const originCountry = preacherUpdateForm.watch('originCountry');
  const maritalStatus = preacherUpdateForm.watch('maritalStatus');
  const numberChildren = preacherUpdateForm.watch('numberChildren');
  const conversionDate = preacherUpdateForm.watch('conversionDate');
  const email = preacherUpdateForm.watch('email');
  const phoneNumber = preacherUpdateForm.watch('phoneNumber');
  const residenceCountry = preacherUpdateForm.watch('residenceCountry');
  const residenceDepartment = preacherUpdateForm.watch('residenceDepartment');
  const residenceProvince = preacherUpdateForm.watch('residenceProvince');
  const residenceDistrict = preacherUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = preacherUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = preacherUpdateForm.watch('residenceAddress');
  const referenceAddress = preacherUpdateForm.watch('referenceAddress');
  const roles = preacherUpdateForm.watch('roles');
  const recordStatus = preacherUpdateForm.watch('recordStatus');
  const isDirectRelationToPastor = preacherUpdateForm.watch('isDirectRelationToPastor');

  const theirSupervisor = preacherUpdateForm.watch('theirSupervisor');
  const theirCopastor = preacherUpdateForm.watch('theirCopastor');
  const theirPastor = preacherUpdateForm.watch('theirPastor');

  //* Effects
  useEffect(() => {
    if (
      preacherUpdateForm.formState.errors &&
      Object.values(preacherUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      theirSupervisor &&
      Object.values(preacherUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      !isDirectRelationToPastor &&
      theirCopastor &&
      roles.includes(MemberRole.Supervisor) &&
      Object.values(preacherUpdateForm.formState.errors).length === 0 &&
      !isRelationSelectDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!isDirectRelationToPastor && roles.includes(MemberRole.Supervisor) && !theirCopastor) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      isDirectRelationToPastor &&
      roles.includes(MemberRole.Supervisor) &&
      theirPastor &&
      Object.values(preacherUpdateForm.formState.errors).length === 0 &&
      !isRelationSelectDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (isDirectRelationToPastor && roles.includes(MemberRole.Supervisor) && !theirPastor) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      !firstNames ||
      !lastNames ||
      !gender ||
      !birthDate ||
      !conversionDate ||
      !maritalStatus ||
      !originCountry ||
      !numberChildren ||
      !residenceCountry ||
      !residenceDepartment ||
      !residenceProvince ||
      !residenceDistrict ||
      !residenceUrbanSector ||
      !residenceAddress ||
      !referenceAddress ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    preacherUpdateForm.formState,
    firstNames,
    lastNames,
    gender,
    conversionDate,
    birthDate,
    maritalStatus,
    email,
    phoneNumber,
    originCountry,
    numberChildren,
    residenceCountry,
    residenceDepartment,
    residenceProvince,
    residenceDistrict,
    residenceAddress,
    residenceUrbanSector,
    referenceAddress,
    theirSupervisor,
    theirCopastor,
    theirPastor,
    isDirectRelationToPastor,
    roles,
    recordStatus,
  ]);
};
