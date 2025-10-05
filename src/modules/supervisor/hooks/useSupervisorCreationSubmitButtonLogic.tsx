/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

interface Options {
  supervisorCreationForm: UseFormReturn<SupervisorFormData, any, SupervisorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  ministryBlocks: MinistryMemberBlock[];
  isInputDisabled: boolean;
}

export const useSupervisorCreationSubmitButtonLogic = ({
  supervisorCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
  ministryBlocks,
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
  const referenceAddress = supervisorCreationForm.watch('referenceAddress');
  const theirCopastor = supervisorCreationForm.watch('theirCopastor');
  const theirPastor = supervisorCreationForm.watch('theirPastor');
  const theirPastorOnlyMinistries = supervisorCreationForm.watch('theirPastorOnlyMinistries');
  const theirPastorRelationDirect = supervisorCreationForm.watch('theirPastorRelationDirect');
  const relationType = supervisorCreationForm.watch('relationType');

  //* Effects
  useEffect(() => {
    if (
      supervisorCreationForm.formState.errors &&
      Object.values(supervisorCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Condicionales para RelationDirect
    if (
      relationType === RelationType.RelatedDirectToPastor &&
      roles.includes(MemberRole.Supervisor) &&
      theirPastorRelationDirect &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      relationType === RelationType.RelatedDirectToPastor &&
      roles.includes(MemberRole.Supervisor) &&
      !theirPastorRelationDirect &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Condicionales para OnlyRelatedHierarchicalCover
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      roles.includes(MemberRole.Supervisor) &&
      theirCopastor &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      roles.includes(MemberRole.Supervisor) &&
      !theirCopastor &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
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
      roles.includes(MemberRole.Supervisor) &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      theirPastorOnlyMinistries &&
      relationType === RelationType.OnlyRelatedMinistries &&
      roles.includes(MemberRole.Supervisor) &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
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
      ((!theirCopastor &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.every(
          (item) =>
            item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
        )) ||
        (theirCopastor &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.some(
            (item) =>
              !item.churchId ||
              !item.ministryId ||
              !item.ministryType ||
              item.ministryRoles.length === 0
          ))) &&
      roles.includes(MemberRole.Supervisor) &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      ) &&
      theirCopastor &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      roles.includes(MemberRole.Supervisor) &&
      Object.values(supervisorCreationForm.formState.errors).length === 0 &&
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
    referenceAddress,
    theirCopastor,
    theirPastor,
    roles,
  ]);

  useEffect(() => {
    supervisorCreationForm.setValue('roles', [MemberRole.Supervisor]);
  }, []);
};
