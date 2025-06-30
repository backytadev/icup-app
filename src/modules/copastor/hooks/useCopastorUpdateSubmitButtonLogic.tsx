/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';

interface Options {
  copastorUpdateForm: UseFormReturn<CopastorFormData, any, CopastorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  isRelationSelectDisabled: boolean;
}

export const useCopastorUpdateSubmitButtonLogic = ({
  isInputDisabled,
  copastorUpdateForm,
  setIsSubmitButtonDisabled,
  isRelationSelectDisabled,
  setIsMessageErrorDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = copastorUpdateForm.watch('firstNames');
  const lastNames = copastorUpdateForm.watch('lastNames');
  const gender = copastorUpdateForm.watch('gender');
  const birthDate = copastorUpdateForm.watch('birthDate');
  const originCountry = copastorUpdateForm.watch('originCountry');
  const maritalStatus = copastorUpdateForm.watch('maritalStatus');
  const numberChildren = copastorUpdateForm.watch('numberChildren');
  const conversionDate = copastorUpdateForm.watch('conversionDate');
  const email = copastorUpdateForm.watch('email');
  const phoneNumber = copastorUpdateForm.watch('phoneNumber');
  const residenceCountry = copastorUpdateForm.watch('residenceCountry');
  const residenceDepartment = copastorUpdateForm.watch('residenceDepartment');
  const residenceProvince = copastorUpdateForm.watch('residenceProvince');
  const residenceDistrict = copastorUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = copastorUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = copastorUpdateForm.watch('residenceAddress');
  const referenceAddress = copastorUpdateForm.watch('referenceAddress');
  const roles = copastorUpdateForm.watch('roles');
  const recordStatus = copastorUpdateForm.watch('recordStatus');

  const theirPastor = copastorUpdateForm.watch('theirPastor');
  const theirChurch = copastorUpdateForm.watch('theirChurch');

  //* Effects
  useEffect(() => {
    if (
      copastorUpdateForm.formState.errors &&
      Object.values(copastorUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Copastor) &&
      theirPastor &&
      Object.values(copastorUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (roles.includes(MemberRole.Copastor) && !theirPastor) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (roles.includes(MemberRole.Pastor) && !theirChurch) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Pastor) &&
      theirChurch &&
      Object.values(copastorUpdateForm.formState.errors).length === 0 &&
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
    copastorUpdateForm.formState,
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
    theirChurch,
    roles,
    recordStatus,
  ]);
};
