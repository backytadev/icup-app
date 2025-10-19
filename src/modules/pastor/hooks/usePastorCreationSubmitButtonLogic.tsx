/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';
import { RelationType } from '@/shared/enums/relation-type.enum';

interface Options {
  pastorCreationForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  ministryBlocks: MinistryMemberBlock[];
}

export const usePastorCreationSubmitButtonLogic = ({
  isInputDisabled,
  pastorCreationForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  ministryBlocks,
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
  const relationType = pastorCreationForm.watch('relationType');

  //* Effects
  useEffect(() => {
    if (
      pastorCreationForm.formState.errors &&
      Object.values(pastorCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Conditions for OnlyRelatedHierarchicalCover
    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      roles.includes(MemberRole.Disciple) &&
      !theirChurch &&
      !isInputDisabled &&
      Object.values(pastorCreationForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      theirChurch &&
      !isInputDisabled &&
      roles.includes(MemberRole.Disciple) &&
      Object.values(pastorCreationForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Conditions for RelatedBothMinistriesAndHierarchicalCover
    if (
      ((!theirChurch &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.every(
          (item) =>
            item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
        )) ||
        (theirChurch &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.some(
            (item) =>
              !item.churchId ||
              !item.ministryId ||
              !item.ministryType ||
              item.ministryRoles.length === 0
          ))) &&
      roles.includes(MemberRole.Disciple) &&
      Object.values(pastorCreationForm.formState.errors).length === 0 &&
      !isInputDisabled
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      roles.includes(MemberRole.Disciple) &&
      theirChurch &&
      Object.values(pastorCreationForm.formState.errors).length === 0 &&
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
      !country ||
      !department ||
      !province ||
      !district ||
      !address ||
      !urbanSector ||
      !address ||
      !referenceAddress ||
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
    ministryBlocks,
  ]);

  useEffect(() => {
    pastorCreationForm.setValue('roles', [MemberRole.Pastor]);
  }, []);
};
