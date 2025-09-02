/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';

interface Options {
  discipleCreationForm: UseFormReturn<DiscipleFormData, any, DiscipleFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  setMinistryBlocks: React.Dispatch<React.SetStateAction<MinistryMemberBlock[]>>;
  ministryBlocks: MinistryMemberBlock[];
}

export const useDiscipleCreationSubmitButtonLogic = ({
  isInputDisabled,
  ministryBlocks,
  setMinistryBlocks,
  discipleCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
}: Options): void => {
  //* Watchers
  const relationType = discipleCreationForm.watch('relationType');
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
  const theirPastor = discipleCreationForm.watch('theirPastor');

  //* Effects
  useEffect(() => {
    //? Enabled
    if (
      discipleCreationForm.formState.errors &&
      Object.values(discipleCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      !theirFamilyGroup &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      roles.includes(MemberRole.Disciple) &&
      Object.values(discipleCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Disciple) &&
      !isInputDisabled &&
      Object.values(discipleCreationForm.formState.errors).length === 0 &&
      ((!theirPastor &&
        relationType === RelationType.OnlyRelatedMinistries &&
        ministryBlocks?.every(
          (item) =>
            item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
        )) ||
        (theirPastor &&
          relationType === RelationType.OnlyRelatedMinistries &&
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
      roles.includes(MemberRole.Disciple) &&
      Object.values(discipleCreationForm.formState.errors).length === 0 &&
      !isInputDisabled &&
      ((!theirFamilyGroup &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.every(
          (item) =>
            item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
        )) ||
        (theirFamilyGroup &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
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
      theirFamilyGroup &&
      !isInputDisabled &&
      roles.includes(MemberRole.Disciple) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      Object.values(discipleCreationForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      theirPastor &&
      relationType === RelationType.OnlyRelatedMinistries &&
      roles.includes(MemberRole.Disciple) &&
      Object.values(discipleCreationForm.formState.errors).length === 0 &&
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
      theirFamilyGroup &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      roles.includes(MemberRole.Disciple) &&
      Object.values(discipleCreationForm.formState.errors).length === 0 &&
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
      !relationType ||
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
    relationType,
    ministryBlocks,
    setMinistryBlocks,
  ]);

  useEffect(() => {
    discipleCreationForm.setValue('roles', [MemberRole.Disciple]);
  }, []);
};
