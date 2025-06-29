/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

interface Options {
  discipleCreationForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
}

export const useDiscipleCreationSubmitButtonLogic = ({
  isInputDisabled,
  discipleCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = discipleCreationForm.watch('firstNames');
  const lastNames = discipleCreationForm.watch('lastNames');
  const gender = discipleCreationForm.watch('gender');
  const birthDate = discipleCreationForm.watch('birthDate');
  const conversionDate = discipleCreationForm.watch('conversionDate');
  const maritalStatus = discipleCreationForm.watch('maritalStatus');
  const email = discipleCreationForm.watch('email');
  const phoneNumber = discipleCreationForm.watch('phoneNumber');
  const originCountry = discipleCreationForm.watch('originCountry');
  const numberChildren = discipleCreationForm.watch('numberChildren');
  const residenceCountry = discipleCreationForm.watch('residenceCountry');
  const residenceDepartment = discipleCreationForm.watch('residenceDepartment');
  const residenceProvince = discipleCreationForm.watch('residenceProvince');
  const residenceDistrict = discipleCreationForm.watch('residenceDistrict');
  const residenceUrbanSector = discipleCreationForm.watch('residenceUrbanSector');
  const residenceAddress = discipleCreationForm.watch('residenceAddress');
  const roles = discipleCreationForm.watch('roles');
  const referenceAddress = discipleCreationForm.watch('referenceAddress');
  const theirFamilyGroup = discipleCreationForm.watch('theirFamilyGroup');

  //* Effects
  useEffect(() => {
    if (
      discipleCreationForm.formState.errors &&
      Object.values(discipleCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirFamilyGroup &&
      roles.includes(MemberRole.Disciple) &&
      Object.values(discipleCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
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
      !residenceAddress ||
      !residenceUrbanSector ||
      !residenceAddress ||
      !referenceAddress ||
      !theirFamilyGroup ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    discipleCreationForm.formState,
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
    roles,
  ]);

  useEffect(() => {
    discipleCreationForm.setValue('roles', [MemberRole.Disciple]);
  }, []);
};
