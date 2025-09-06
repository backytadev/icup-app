/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';

interface Options {
  copastorCreationForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
}

export const useCopastorCreationSubmitButtonLogic = ({
  copastorCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = copastorCreationForm.watch('firstNames');
  const lastNames = copastorCreationForm.watch('lastNames');
  const gender = copastorCreationForm.watch('gender');
  const birthDate = copastorCreationForm.watch('birthDate');
  const conversionDate = copastorCreationForm.watch('conversionDate');
  const maritalStatus = copastorCreationForm.watch('maritalStatus');
  const email = copastorCreationForm.watch('email');
  const phoneNumber = copastorCreationForm.watch('phoneNumber');
  const originCountry = copastorCreationForm.watch('originCountry');
  const numberChildren = copastorCreationForm.watch('numberChildren');
  const residenceCountry = copastorCreationForm.watch('residenceCountry');
  const residenceDepartment = copastorCreationForm.watch('residenceDepartment');
  const residenceProvince = copastorCreationForm.watch('residenceProvince');
  const residenceDistrict = copastorCreationForm.watch('residenceDistrict');
  const residenceUrbanSector = copastorCreationForm.watch('residenceUrbanSector');
  const residenceAddress = copastorCreationForm.watch('residenceAddress');
  const roles = copastorCreationForm.watch('roles');
  const referenceAddress = copastorCreationForm.watch('referenceAddress');
  const theirPastor = copastorCreationForm.watch('theirPastor');

  //* Effects
  useEffect(() => {
    if (
      copastorCreationForm.formState.errors &&
      Object.values(copastorCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirPastor &&
      roles.includes(MemberRole.Copastor) &&
      Object.values(copastorCreationForm.formState.errors).length === 0 &&
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
      !theirPastor ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    copastorCreationForm.formState,
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
    theirPastor,
    roles,
  ]);

  useEffect(() => {
    copastorCreationForm.setValue('roles', [MemberRole.Copastor]);
  }, []);
};
