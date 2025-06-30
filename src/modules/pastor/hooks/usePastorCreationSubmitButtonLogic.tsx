/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';

interface Options {
  pastorCreationForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
}

export const usePastorCreationSubmitButtonLogic = ({
  isInputDisabled,
  pastorCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = pastorCreationForm.watch('firstNames');
  const lastNames = pastorCreationForm.watch('lastNames');
  const gender = pastorCreationForm.watch('gender');
  const birthDate = pastorCreationForm.watch('birthDate');
  const conversionDate = pastorCreationForm.watch('conversionDate');
  const maritalStatus = pastorCreationForm.watch('maritalStatus');
  const email = pastorCreationForm.watch('email');
  const phoneNumber = pastorCreationForm.watch('phoneNumber');
  const originCountry = pastorCreationForm.watch('originCountry');
  const numberChildren = pastorCreationForm.watch('numberChildren');
  const country = pastorCreationForm.watch('residenceCountry');
  const department = pastorCreationForm.watch('residenceDepartment');
  const province = pastorCreationForm.watch('residenceProvince');
  const district = pastorCreationForm.watch('residenceDistrict');
  const urbanSector = pastorCreationForm.watch('residenceUrbanSector');
  const address = pastorCreationForm.watch('residenceAddress');
  const roles = pastorCreationForm.watch('roles');
  const referenceAddress = pastorCreationForm.watch('referenceAddress');
  const theirChurch = pastorCreationForm.watch('theirChurch');

  //* Effects
  useEffect(() => {
    if (
      pastorCreationForm.formState.errors &&
      Object.values(pastorCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirChurch &&
      roles.includes(MemberRole.Pastor) &&
      Object.values(pastorCreationForm.formState.errors).length === 0 &&
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
      !country ||
      !department ||
      !province ||
      !district ||
      !address ||
      !urbanSector ||
      !address ||
      !referenceAddress ||
      !theirChurch ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    pastorCreationForm.formState,
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
    country,
    department,
    province,
    district,
    address,
    urbanSector,
    referenceAddress,
    theirChurch,
    roles,
  ]);

  useEffect(() => {
    pastorCreationForm.setValue('roles', [MemberRole.Pastor]);
  }, []);
};
