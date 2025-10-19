/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';
import { MinistryMemberBlock } from '@/shared/interfaces/ministry-member-block.interface';
import { RelationType } from '@/shared/enums/relation-type.enum';

interface Options {
  pastorUpdateForm: UseFormReturn<PastorFormData, any, PastorFormData | undefined>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean;
  ministryBlocks: MinistryMemberBlock[];
}

export const usePastorUpdateSubmitButtonLogic = ({
  pastorUpdateForm,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isInputDisabled,
  ministryBlocks,
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
  const relationType = pastorUpdateForm.watch('relationType');
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

    //* Conditions for OnlyRelatedHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      !theirChurch
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      !isInputDisabled &&
      theirChurch &&
      relationType === RelationType.OnlyRelatedHierarchicalCover &&
      Object.values(pastorUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Conditions for RelatedBothMinistriesAndHierarchicalCover
    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      !isInputDisabled &&
      ((theirChurch &&
        relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
        ministryBlocks?.some(
          (item) =>
            !item.churchId ||
            !item.ministryId ||
            !item.ministryType ||
            item.ministryRoles.length === 0
        )) ||
        (!theirChurch &&
          relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
          ministryBlocks?.every(
            (item) =>
              item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
          ))) &&
      Object.values(pastorUpdateForm.formState.errors).length === 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      roles.includes(MemberRole.Disciple) &&
      !roles.includes(MemberRole.Preacher) &&
      !isInputDisabled &&
      theirChurch &&
      relationType === RelationType.RelatedBothMinistriesAndHierarchicalCover &&
      ministryBlocks?.every(
        (item) =>
          item.churchId && item.ministryId && item.ministryType && item.ministryRoles.length > 0
      ) &&
      Object.values(pastorUpdateForm.formState.errors).length === 0
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
