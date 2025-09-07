/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';

interface Options {
  preacherUpdateForm: UseFormReturn<PreacherFormData, any, PreacherFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  isRelationSelectDisabled: boolean;
  ministryBlocks: MinistryMemberBlock[];
}

export const usePreacherUpdateSubmitButtonLogic = ({
  preacherUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isRelationSelectDisabled,
  isInputDisabled,
  ministryBlocks,
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
  const theirPastorOnlyMinistries = preacherUpdateForm.watch('theirPastorOnlyMinistries');
  const theirPastorRelationDirect = preacherUpdateForm.watch('theirPastorRelationDirect');
  const relationType = preacherUpdateForm.watch('relationType');

  //* Effects
  useEffect(() => {
    //? Enabled
    if (
      preacherUpdateForm.formState.errors &&
      Object.values(preacherUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (!isDirectRelationToPastor && roles.includes(MemberRole.Supervisor) && !theirCopastor) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      isDirectRelationToPastor &&
      roles.includes(MemberRole.Supervisor) &&
      !theirPastorRelationDirect
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      !roles.includes(MemberRole.Supervisor) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      !theirSupervisor
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      !roles.includes(MemberRole.Supervisor) &&
      relationType === RelationType.OnlyRelatedMinistries &&
      ((theirPastorOnlyMinistries &&
        ministryBlocks?.some(
          (item) =>
            !item.churchId ||
            !item.ministryId ||
            !item.ministryType ||
            item.ministryRoles.length === 0
        )) ||
        (!theirPastorOnlyMinistries &&
          ministryBlocks?.every(
            (item) =>
              item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
          )) ||
        (!theirPastorOnlyMinistries &&
          ministryBlocks?.some(
            (item) =>
              !item.churchId ||
              !item.ministryId ||
              !item.ministryType ||
              item.ministryRoles.length === 0
          )))
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      !roles.includes(MemberRole.Supervisor) &&
      !isInputDisabled &&
      ((theirSupervisor &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.some(
          (item) =>
            !item.churchId ||
            !item.ministryId ||
            !item.ministryType ||
            item.ministryRoles.length === 0
        )) ||
        (!theirSupervisor &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.every(
            (item) =>
              item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
          ))) &&
      Object.values(preacherUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Supervisor) &&
      !roles.includes(MemberRole.Preacher) &&
      !theirCopastor
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //? Disabled
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

    if (
      isDirectRelationToPastor &&
      roles.includes(MemberRole.Supervisor) &&
      theirPastorRelationDirect &&
      Object.values(preacherUpdateForm.formState.errors).length === 0 &&
      !isRelationSelectDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      !roles.includes(MemberRole.Supervisor) &&
      !isInputDisabled &&
      theirSupervisor &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      Object.values(preacherUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      !roles.includes(MemberRole.Supervisor) &&
      !isInputDisabled &&
      theirSupervisor &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      ) &&
      Object.values(preacherUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      roles.includes(MemberRole.Preacher) &&
      !roles.includes(MemberRole.Supervisor) &&
      theirPastorOnlyMinistries &&
      !isInputDisabled &&
      relationType === RelationType.OnlyRelatedMinistries &&
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      ) &&
      Object.values(preacherUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      roles.includes(MemberRole.Supervisor) &&
      theirCopastor &&
      Object.values(preacherUpdateForm.formState.errors).length === 0 &&
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
    theirPastorRelationDirect,
    theirPastorOnlyMinistries,
    isDirectRelationToPastor,
    roles,
    recordStatus,
  ]);
};
