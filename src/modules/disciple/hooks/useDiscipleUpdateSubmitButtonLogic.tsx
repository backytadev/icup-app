/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

interface Options {
  discipleUpdateForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  isRelationSelectDisabled: boolean;
}

export const useDiscipleUpdateSubmitButtonLogic = ({
  discipleUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
  isRelationSelectDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = discipleUpdateForm.watch('firstNames');
  const lastNames = discipleUpdateForm.watch('lastNames');
  const gender = discipleUpdateForm.watch('gender');
  const birthDate = discipleUpdateForm.watch('birthDate');
  const originCountry = discipleUpdateForm.watch('originCountry');
  const maritalStatus = discipleUpdateForm.watch('maritalStatus');
  const numberChildren = discipleUpdateForm.watch('numberChildren');
  const conversionDate = discipleUpdateForm.watch('conversionDate');
  const email = discipleUpdateForm.watch('email');
  const phoneNumber = discipleUpdateForm.watch('phoneNumber');
  const residenceCountry = discipleUpdateForm.watch('residenceCountry');
  const residenceDepartment = discipleUpdateForm.watch('residenceDepartment');
  const residenceProvince = discipleUpdateForm.watch('residenceProvince');
  const residenceDistrict = discipleUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = discipleUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = discipleUpdateForm.watch('residenceAddress');
  const referenceAddress = discipleUpdateForm.watch('referenceAddress');
  const roles = discipleUpdateForm.watch('roles');
  const recordStatus = discipleUpdateForm.watch('recordStatus');
  const theirFamilyGroup = discipleUpdateForm.watch('theirFamilyGroup');
  const theirSupervisor = discipleUpdateForm.watch('theirSupervisor');

  //* Effects
  useEffect(() => {
    if (
      discipleUpdateForm.formState.errors &&
      Object.values(discipleUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      theirFamilyGroup &&
      Object.values(discipleUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      !theirFamilyGroup
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (roles.includes(MemberRole.Preacher) && !theirSupervisor) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      theirSupervisor &&
      Object.values(discipleUpdateForm.formState.errors).length === 0 &&
      !isRelationSelectDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
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
    discipleUpdateForm.formState,
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
    theirFamilyGroup,
    theirSupervisor,
    roles,
    recordStatus,
  ]);
};
