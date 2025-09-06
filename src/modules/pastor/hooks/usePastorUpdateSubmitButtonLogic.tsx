/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';

interface Options {
  pastorUpdateForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
}

export const usePastorUpdateSubmitButtonLogic = ({
  pastorUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = pastorUpdateForm.watch('firstNames');
  const lastNames = pastorUpdateForm.watch('lastNames');
  const gender = pastorUpdateForm.watch('gender');
  const birthDate = pastorUpdateForm.watch('birthDate');
  const originCountry = pastorUpdateForm.watch('originCountry');
  const maritalStatus = pastorUpdateForm.watch('maritalStatus');
  const numberChildren = pastorUpdateForm.watch('numberChildren');
  const conversionDate = pastorUpdateForm.watch('conversionDate');
  const email = pastorUpdateForm.watch('email');
  const phoneNumber = pastorUpdateForm.watch('phoneNumber');
  const residenceCountry = pastorUpdateForm.watch('residenceCountry');
  const residenceDepartment = pastorUpdateForm.watch('residenceDepartment');
  const residenceProvince = pastorUpdateForm.watch('residenceProvince');
  const residenceDistrict = pastorUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = pastorUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = pastorUpdateForm.watch('residenceAddress');
  const referenceAddress = pastorUpdateForm.watch('referenceAddress');
  const roles = pastorUpdateForm.watch('roles');
  const recordStatus = pastorUpdateForm.watch('recordStatus');
  const theirChurch = pastorUpdateForm.watch('theirChurch');

  //* Effects
  useEffect(() => {
    if (
      pastorUpdateForm.formState.errors &&
      Object.values(pastorUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirChurch &&
      roles.includes(MemberRole.Pastor) &&
      Object.values(pastorUpdateForm.formState.errors).length === 0 &&
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
      !residenceUrbanSector ||
      !residenceAddress ||
      !referenceAddress ||
      !theirChurch ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    pastorUpdateForm.formState,
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
    theirChurch,
    roles,
    recordStatus,
  ]);
};
