/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

interface Options {
  supervisorCreationForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
}

export const useSupervisorCreationSubmitButtonLogic = ({
  supervisorCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
}: Options): void => {
  //* Watchers
  const firstNames = supervisorCreationForm.watch('firstNames');
  const lastNames = supervisorCreationForm.watch('lastNames');
  const gender = supervisorCreationForm.watch('gender');
  const birthDate = supervisorCreationForm.watch('birthDate');
  const conversionDate = supervisorCreationForm.watch('conversionDate');
  const maritalStatus = supervisorCreationForm.watch('maritalStatus');
  const email = supervisorCreationForm.watch('email');
  const phoneNumber = supervisorCreationForm.watch('phoneNumber');
  const originCountry = supervisorCreationForm.watch('originCountry');
  const numberChildren = supervisorCreationForm.watch('numberChildren');
  const residenceCountry = supervisorCreationForm.watch('residenceCountry');
  const residenceDepartment = supervisorCreationForm.watch('residenceDepartment');
  const residenceProvince = supervisorCreationForm.watch('residenceProvince');
  const residenceDistrict = supervisorCreationForm.watch('residenceDistrict');
  const residenceUrbanSector = supervisorCreationForm.watch('residenceUrbanSector');
  const residenceAddress = supervisorCreationForm.watch('residenceAddress');
  const roles = supervisorCreationForm.watch('roles');
  const isDirectRelationToPastor = supervisorCreationForm.watch('isDirectRelationToPastor');
  const referenceAddress = supervisorCreationForm.watch('referenceAddress');
  const theirCopastor = supervisorCreationForm.watch('theirCopastor');
  const theirPastor = supervisorCreationForm.watch('theirPastor');

  //* Effects
  useEffect(() => {
    if (
      supervisorCreationForm.formState.errors &&
      Object.values(supervisorCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      isDirectRelationToPastor &&
      theirPastor &&
      roles.includes(MemberRole.Supervisor) &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (isDirectRelationToPastor && !theirPastor) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      !isDirectRelationToPastor &&
      theirCopastor &&
      roles.includes(MemberRole.Supervisor) &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (!isDirectRelationToPastor && !theirCopastor) {
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
      !residenceAddress ||
      !residenceUrbanSector ||
      !residenceAddress ||
      !referenceAddress ||
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    supervisorCreationForm.formState,
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
    isDirectRelationToPastor,
    referenceAddress,
    theirCopastor,
    theirPastor,
    roles,
  ]);

  useEffect(() => {
    supervisorCreationForm.setValue('roles', [MemberRole.Supervisor]);
  }, []);
};
