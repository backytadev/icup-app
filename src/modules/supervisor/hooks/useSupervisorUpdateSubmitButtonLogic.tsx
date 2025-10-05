/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { RelationType } from '@/shared/enums/relation-type.enum';

interface Options {
  isInputDisabled: boolean;
  ministryBlocks: MinistryMemberBlock[];
  supervisorUpdateForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSupervisorUpdateSubmitButtonLogic = ({
  supervisorUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
  ministryBlocks,
}: Options): void => {
  //* Watchers
  const firstNames = supervisorUpdateForm.watch('firstNames');
  const lastNames = supervisorUpdateForm.watch('lastNames');
  const gender = supervisorUpdateForm.watch('gender');
  const birthDate = supervisorUpdateForm.watch('birthDate');
  const originCountry = supervisorUpdateForm.watch('originCountry');
  const maritalStatus = supervisorUpdateForm.watch('maritalStatus');
  const numberChildren = supervisorUpdateForm.watch('numberChildren');
  const conversionDate = supervisorUpdateForm.watch('conversionDate');
  const email = supervisorUpdateForm.watch('email');
  const phoneNumber = supervisorUpdateForm.watch('phoneNumber');
  const residenceCountry = supervisorUpdateForm.watch('residenceCountry');
  const residenceDepartment = supervisorUpdateForm.watch('residenceDepartment');
  const residenceProvince = supervisorUpdateForm.watch('residenceProvince');
  const residenceDistrict = supervisorUpdateForm.watch('residenceDistrict');
  const residenceUrbanSector = supervisorUpdateForm.watch('residenceUrbanSector');
  const residenceAddress = supervisorUpdateForm.watch('residenceAddress');
  const referenceAddress = supervisorUpdateForm.watch('referenceAddress');
  const roles = supervisorUpdateForm.watch('roles');
  const recordStatus = supervisorUpdateForm.watch('recordStatus');
  const theirCopastor = supervisorUpdateForm.watch('theirCopastor');
  const theirPastor = supervisorUpdateForm.watch('theirPastor');
  const theirPastorOnlyMinistries = supervisorUpdateForm.watch('theirPastorOnlyMinistries');
  const theirPastorRelationDirect = supervisorUpdateForm.watch('theirPastorRelationDirect');
  const relationType = supervisorUpdateForm.watch('relationType');

  //* Effects
  useEffect(() => {
    if (
      supervisorUpdateForm.formState.errors &&
      Object.values(supervisorUpdateForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Condicionales para RelationDirect
    if (
      relationType === RelationType.RelatedDirectToPastor &&
      roles.includes(MemberRole.Supervisor) &&
      theirPastorRelationDirect &&
      Object.values(supervisorUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      relationType === RelationType.RelatedDirectToPastor &&
      roles.includes(MemberRole.Supervisor) &&
      !theirPastorRelationDirect &&
      Object.values(supervisorUpdateForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Condicionales para OnlyRelatedHierarchicalCover
    if (
      roles.includes(MemberRole.Supervisor) &&
      !roles.includes(MemberRole.Copastor) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      !theirCopastor
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Supervisor) &&
      !roles.includes(MemberRole.Copastor) &&
      !isInputDisabled &&
      theirCopastor &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      Object.values(supervisorUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Condicionales para OnlyRelatedMinistries
    if (
      roles.includes(MemberRole.Supervisor) &&
      !roles.includes(MemberRole.Copastor) &&
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
      roles.includes(MemberRole.Supervisor) &&
      !roles.includes(MemberRole.Copastor) &&
      theirPastorOnlyMinistries &&
      !isInputDisabled &&
      relationType === RelationType.OnlyRelatedMinistries &&
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      ) &&
      Object.values(supervisorUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Condicionales para RelatedBothMinistriesAndHierarchicalCover
    if (
      roles.includes(MemberRole.Supervisor) &&
      !roles.includes(MemberRole.Copastor) &&
      !isInputDisabled &&
      ((theirCopastor &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.some(
          (item) =>
            !item.churchId ||
            !item.ministryId ||
            !item.ministryType ||
            item.ministryRoles.length === 0
        )) ||
        (!theirCopastor &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.every(
            (item) =>
              item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
          ))) &&
      Object.values(supervisorUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Supervisor) &&
      !roles.includes(MemberRole.Copastor) &&
      !isInputDisabled &&
      theirCopastor &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      ) &&
      Object.values(supervisorUpdateForm.formState.errors).length === 0
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
    supervisorUpdateForm.formState,
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
    theirCopastor,
    theirPastor,
    roles,
    recordStatus,
  ]);
};
