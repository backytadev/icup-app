/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

interface Options {
  preacherCreationForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  ministryBlocks: MinistryMemberBlock[];
  isInputDisabled: boolean;
}

export const usePreacherCreationSubmitButtonLogic = ({
  preacherCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
  ministryBlocks,
}: Options): void => {
  //* Watchers
  const firstNames = preacherCreationForm.watch('firstNames');
  const lastNames = preacherCreationForm.watch('lastNames');
  const gender = preacherCreationForm.watch('gender');
  const birthDate = preacherCreationForm.watch('birthDate');
  const conversionDate = preacherCreationForm.watch('conversionDate');
  const maritalStatus = preacherCreationForm.watch('maritalStatus');
  const email = preacherCreationForm.watch('email');
  const phoneNumber = preacherCreationForm.watch('phoneNumber');
  const originCountry = preacherCreationForm.watch('originCountry');
  const numberChildren = preacherCreationForm.watch('numberChildren');
  const residenceCountry = preacherCreationForm.watch('residenceCountry');
  const residenceDepartment = preacherCreationForm.watch('residenceDepartment');
  const residenceProvince = preacherCreationForm.watch('residenceProvince');
  const residenceDistrict = preacherCreationForm.watch('residenceDistrict');
  const residenceUrbanSector = preacherCreationForm.watch('residenceUrbanSector');
  const residenceAddress = preacherCreationForm.watch('residenceAddress');
  const roles = preacherCreationForm.watch('roles');
  const referenceAddress = preacherCreationForm.watch('referenceAddress');
  const theirSupervisor = preacherCreationForm.watch('theirSupervisor');
  const theirPastorOnlyMinistries = preacherCreationForm.watch('theirPastorOnlyMinistries');
  const relationType = preacherCreationForm.watch('relationType');

  //* Effects
  useEffect(() => {
    if (
      preacherCreationForm.formState.errors &&
      Object.values(preacherCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Condicionales para OnlyRelatedHierarchicalCover
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      !theirSupervisor &&
      roles.includes(MemberRole.Preacher) &&
      Object.values(preacherCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      roles.includes(MemberRole.Preacher) &&
      theirSupervisor &&
      !isInputDisabled &&
      Object.values(preacherCreationForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Condicionales para OnlyRelatedMinistries
    if (
      ((!theirPastorOnlyMinistries &&
        relationType === RelationType.OnlyRelatedMinistries &&
        ministryBlocks?.every(
          (item) =>
            item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
        )) ||
        (theirPastorOnlyMinistries &&
          relationType === RelationType.OnlyRelatedMinistries &&
          ministryBlocks?.some(
            (item) =>
              !item.churchId ||
              !item.ministryId ||
              !item.ministryType ||
              item.ministryRoles.length === 0
          )) ||
        (!theirPastorOnlyMinistries &&
          relationType === RelationType.OnlyRelatedMinistries &&
          ministryBlocks?.some(
            (item) =>
              !item.churchId ||
              !item.ministryId ||
              !item.ministryType ||
              item.ministryRoles.length === 0
          ))) &&
      roles.includes(MemberRole.Preacher) &&
      !isInputDisabled &&
      Object.values(preacherCreationForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      relationType === RelationType.OnlyRelatedMinistries &&
      theirPastorOnlyMinistries &&
      roles.includes(MemberRole.Preacher) &&
      Object.values(preacherCreationForm.formState.errors).length === 0 &&
      !isInputDisabled &&
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      )
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Condicionales para RelatedBothMinistriesAndHierarchicalCover
    if (
      ((!theirSupervisor &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.every(
          (item) =>
            item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
        )) ||
        (theirSupervisor &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.some(
            (item) =>
              !item.churchId ||
              !item.ministryId ||
              !item.ministryType ||
              item.ministryRoles.length === 0
          ))) &&
      roles.includes(MemberRole.Preacher) &&
      Object.values(preacherCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      theirSupervisor &&
      roles.includes(MemberRole.Preacher) &&
      Object.values(preacherCreationForm.formState.errors).length === 0 &&
      !isInputDisabled &&
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      )
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
      roles.length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }
  }, [
    preacherCreationForm.formState,
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
    theirPastorOnlyMinistries,
    roles,
    relationType,
    ministryBlocks,
  ]);

  useEffect(() => {
    preacherCreationForm.setValue('roles', [MemberRole.Preacher]);
  }, []);
};
