/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { OfferingIncomeCreationType } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import { OfferingIncomeCreationCategory } from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { OfferingIncomeCreationSubType } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';

import { type OfferingIncomeFormData } from '@/modules/offering/income/interfaces/offering-income-form-data.interface';

interface Options {
  isInputDisabled: boolean;
  isDropZoneDisabled: boolean;
  isDeleteFileButtonDisabled: boolean;
  offeringIncomeCreationForm: UseFormReturn<
    OfferingIncomeFormData,
    any,
    OfferingIncomeFormData | undefined
  >;
  setIsDropZoneDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useOfferingIncomeCreationSubmitButtonLogic = ({
  isDropZoneDisabled,
  isDeleteFileButtonDisabled,
  isInputDisabled,
  offeringIncomeCreationForm,
  setIsDropZoneDisabled,
  setIsMessageErrorDisabled,
  setIsSubmitButtonDisabled,
}: Options): void => {
  //* Watchers
  const type = offeringIncomeCreationForm.watch('type');
  const subType = offeringIncomeCreationForm.watch('subType');
  const category = offeringIncomeCreationForm.watch('category');
  const isNewExternalDonor = offeringIncomeCreationForm.watch('isNewExternalDonor');
  const externalDonorId = offeringIncomeCreationForm.watch('externalDonorId');
  const externalDonorFirstNames = offeringIncomeCreationForm.watch('externalDonorFirstNames');
  const externalDonorLastNames = offeringIncomeCreationForm.watch('externalDonorLastNames');
  const externalDonorGender = offeringIncomeCreationForm.watch('externalDonorGender');
  const amount = offeringIncomeCreationForm.watch('amount');
  const shift = offeringIncomeCreationForm.watch('shift');
  const currency = offeringIncomeCreationForm.watch('currency');
  const date = offeringIncomeCreationForm.watch('date');
  const comments = offeringIncomeCreationForm.watch('comments');
  const fileNames = offeringIncomeCreationForm.watch('fileNames');
  const memberType = offeringIncomeCreationForm.watch('memberType');
  const memberId = offeringIncomeCreationForm.watch('memberId');
  const churchId = offeringIncomeCreationForm.watch('churchId');
  const zoneId = offeringIncomeCreationForm.watch('zoneId');
  const familyGroupId = offeringIncomeCreationForm.watch('familyGroupId');

  //* Effects
  useEffect(() => {
    if (
      offeringIncomeCreationForm.formState.errors &&
      Object.values(offeringIncomeCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Income adjustment
    if (
      type === OfferingIncomeCreationType.IncomeAdjustment &&
      !subType &&
      !category &&
      amount &&
      currency &&
      date &&
      comments &&
      churchId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.IncomeAdjustment &&
      (!churchId || !amount || !currency || !date || !comments)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Sunday service
    if (
      churchId &&
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.OfferingBox &&
      subType === OfferingIncomeCreationSubType.SundayService &&
      amount &&
      date &&
      currency &&
      shift &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.OfferingBox &&
      subType === OfferingIncomeCreationSubType.SundayService &&
      (!churchId || !date || !amount || !currency || !shift)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //? Sunday School
    //* Sunday School (external donation)
    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   isNewExternalDonor &&
    //   externalDonorFirstNames &&
    //   externalDonorLastNames &&
    //   externalDonorGender &&
    //   amount &&
    //   date &&
    //   currency &&
    //   churchId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   !isNewExternalDonor &&
    //   externalDonorId &&
    //   !externalDonorFirstNames &&
    //   !externalDonorLastNames &&
    //   !externalDonorGender &&
    //   amount &&
    //   date &&
    //   currency &&
    //   churchId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   isNewExternalDonor &&
    //   (!churchId ||
    //     !date ||
    //     !amount ||
    //     !externalDonorFirstNames ||
    //     !externalDonorLastNames ||
    //     !externalDonorGender ||
    //     !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   !isNewExternalDonor &&
    //   (!churchId || !externalDonorId || !date || !amount || !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    //* Sunday school (offering box)
    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.OfferingBox &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   amount &&
    //   date &&
    //   currency &&
    //   shift &&
    //   churchId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.OfferingBox &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   (!churchId || !date || !amount || !currency || !shift)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    //* Sunday school (activities)
    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.FundraisingProMinistry &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   amount &&
    //   date &&
    //   currency &&
    //   churchId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.FundraisingProMinistry &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   (!churchId || !date || !amount || !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    //* Sunday school (internal donation)
    // if (
    //   churchId &&
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.InternalDonation &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   amount &&
    //   date &&
    //   currency &&
    //   memberType &&
    //   memberId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.InternalDonation &&
    //   subType === OfferingIncomeCreationSubType.SundaySchool &&
    //   (!churchId || !memberType || !memberId || !date || !amount || !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    //? Youth Service
    //* Youth Service (external donation)
    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   (isNewExternalDonor || !isNewExternalDonor) &&
    //   externalDonorFirstNames &&
    //   externalDonorLastNames &&
    //   externalDonorGender &&
    //   amount &&
    //   date &&
    //   currency &&
    //   churchId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   !isNewExternalDonor &&
    //   externalDonorId &&
    //   !externalDonorFirstNames &&
    //   !externalDonorLastNames &&
    //   !externalDonorGender &&
    //   amount &&
    //   date &&
    //   currency &&
    //   churchId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   isNewExternalDonor &&
    //   (!churchId ||
    //     !date ||
    //     !amount ||
    //     !externalDonorFirstNames ||
    //     !externalDonorLastNames ||
    //     !externalDonorGender ||
    //     !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.ExternalDonation &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   !isNewExternalDonor &&
    //   (!churchId || !externalDonorId || !date || !amount || !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    //* Youth Service (offering box and activities)
    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   (category === OfferingIncomeCreationCategory.OfferingBox ||
    //     category === OfferingIncomeCreationCategory.FundraisingProMinistry) &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   amount &&
    //   date &&
    //   currency &&
    //   churchId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   (category === OfferingIncomeCreationCategory.OfferingBox ||
    //     category === OfferingIncomeCreationCategory.FundraisingProMinistry) &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   (!churchId || !date || !amount || !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    //* Youth Service (internal donation)
    // if (
    //   churchId &&
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.InternalDonation &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   amount &&
    //   date &&
    //   currency &&
    //   memberType &&
    //   memberId &&
    //   Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
    //   (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    // ) {
    //   setIsSubmitButtonDisabled(false);
    //   setIsMessageErrorDisabled(false);
    // }

    // if (
    //   type === OfferingIncomeCreationType.Offering &&
    //   category === OfferingIncomeCreationCategory.InternalDonation &&
    //   subType === OfferingIncomeCreationSubType.YouthService &&
    //   (!churchId || !memberType || !memberId || !date || !amount || !currency)
    // ) {
    //   setIsSubmitButtonDisabled(true);
    //   setIsMessageErrorDisabled(true);
    // }

    //? Church Ground
    //* Church ground (external donation)
    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      isNewExternalDonor &&
      externalDonorFirstNames &&
      externalDonorLastNames &&
      externalDonorGender &&
      amount &&
      date &&
      currency &&
      churchId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      !isNewExternalDonor &&
      externalDonorId &&
      !externalDonorFirstNames &&
      !externalDonorLastNames &&
      !externalDonorGender &&
      amount &&
      date &&
      currency &&
      churchId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      isNewExternalDonor &&
      (!churchId ||
        !date ||
        !amount ||
        !externalDonorFirstNames ||
        !externalDonorLastNames ||
        !externalDonorGender ||
        !currency)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      !isNewExternalDonor &&
      (!churchId || !date || !externalDonorId || !amount || !currency)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Church Ground (activities)
    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.FundraisingProChurchGround &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      amount &&
      date &&
      currency &&
      churchId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.FundraisingProChurchGround &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      (!churchId || !date || !amount || !currency)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Church Ground (internal donation)
    if (
      churchId &&
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.InternalDonation &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      amount &&
      date &&
      currency &&
      memberType &&
      memberId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.InternalDonation &&
      subType === OfferingIncomeCreationSubType.ChurchGround &&
      (!churchId || !memberType || !memberId || !date || !amount || !currency)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //? Special offering
    //* Special offering (external donation)
    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.Special &&
      isNewExternalDonor &&
      externalDonorFirstNames &&
      externalDonorLastNames &&
      externalDonorGender &&
      amount &&
      date &&
      currency &&
      churchId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.Special &&
      !isNewExternalDonor &&
      externalDonorId &&
      !externalDonorFirstNames &&
      !externalDonorLastNames &&
      !externalDonorGender &&
      amount &&
      date &&
      currency &&
      churchId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.Special &&
      isNewExternalDonor &&
      (!churchId ||
        !date ||
        !amount ||
        !externalDonorFirstNames ||
        !externalDonorLastNames ||
        !externalDonorGender ||
        !currency)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.ExternalDonation &&
      subType === OfferingIncomeCreationSubType.Special &&
      !isNewExternalDonor &&
      (!churchId || !date || !externalDonorId || !amount || !currency)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Special (internal donation)
    if (
      churchId &&
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.InternalDonation &&
      subType === OfferingIncomeCreationSubType.Special &&
      amount &&
      date &&
      currency &&
      memberType &&
      memberId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.InternalDonation &&
      subType === OfferingIncomeCreationSubType.Special &&
      (!churchId || !memberType || !memberId || !date || !amount || !currency)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //? Family group
    if (
      churchId &&
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.OfferingBox &&
      subType === OfferingIncomeCreationSubType.FamilyGroup &&
      amount &&
      date &&
      currency &&
      familyGroupId &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      subType === OfferingIncomeCreationSubType.FamilyGroup &&
      (!churchId || !date || !amount || !currency || !familyGroupId)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //? Zone
    if (
      churchId &&
      type === OfferingIncomeCreationType.Offering &&
      category === OfferingIncomeCreationCategory.OfferingBox &&
      (subType === OfferingIncomeCreationSubType.ZonalVigil ||
        subType === OfferingIncomeCreationSubType.ZonalFasting ||
        subType === OfferingIncomeCreationSubType.ZonalUnitedService ||
        subType === OfferingIncomeCreationSubType.ZonalEvangelism) &&
      amount &&
      currency &&
      zoneId &&
      date &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      (subType === OfferingIncomeCreationSubType.ZonalVigil ||
        subType === OfferingIncomeCreationSubType.ZonalFasting ||
        subType === OfferingIncomeCreationSubType.ZonalUnitedService ||
        subType === OfferingIncomeCreationSubType.ZonalEvangelism) &&
      (!churchId || !date || !amount || !currency || !zoneId)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //? Others
    if (
      type === OfferingIncomeCreationType.Offering &&
      (category === OfferingIncomeCreationCategory.General ||
        category === OfferingIncomeCreationCategory.OfferingBox ||
        category === OfferingIncomeCreationCategory.FundraisingProTemple ||
        category === OfferingIncomeCreationCategory.Events ||
        category === OfferingIncomeCreationCategory.Meetings ||
        category === OfferingIncomeCreationCategory.SocialAid) &&
      subType !== OfferingIncomeCreationSubType.Special &&
      subType !== OfferingIncomeCreationSubType.ChurchGround &&
      subType !== OfferingIncomeCreationSubType.ZonalFasting &&
      subType !== OfferingIncomeCreationSubType.ZonalVigil &&
      subType !== OfferingIncomeCreationSubType.ZonalEvangelism &&
      subType !== OfferingIncomeCreationSubType.FamilyGroup &&
      // subType !== OfferingIncomeCreationSubType.SundaySchool &&
      // subType !== OfferingIncomeCreationSubType.YouthService &&
      subType !== OfferingIncomeCreationSubType.SundayService &&
      amount &&
      currency &&
      churchId &&
      !shift &&
      !memberId &&
      !familyGroupId &&
      !zoneId &&
      date &&
      Object.values(offeringIncomeCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Others values
    if (!churchId || !amount || !currency || !date) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Limit images drop zone 3 (create income offering)
    if (fileNames && fileNames?.length >= 4) {
      setIsDropZoneDisabled(true);
      setIsSubmitButtonDisabled(true);
    }

    if (
      fileNames &&
      fileNames?.length < 3 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsDropZoneDisabled(false);
    }
  }, [
    offeringIncomeCreationForm.formState,
    type,
    externalDonorId,
    isNewExternalDonor,
    subType,
    amount,
    currency,
    comments,
    memberId,
    date,
    zoneId,
    churchId,
    familyGroupId,
    fileNames,
  ]);

  //* Reset relations
  useEffect(() => {
    if (
      // category === OfferingIncomeCreationCategory.FundraisingProMinistry ||
      category === OfferingIncomeCreationCategory.OfferingBox ||
      category === OfferingIncomeCreationCategory.ExternalDonation ||
      category === OfferingIncomeCreationCategory.General ||
      category === OfferingIncomeCreationCategory.InternalDonation ||
      category === OfferingIncomeCreationCategory.FundraisingProTemple ||
      category === OfferingIncomeCreationCategory.FundraisingProChurchGround ||
      category === OfferingIncomeCreationCategory.Events ||
      category === OfferingIncomeCreationCategory.SocialAid ||
      category === OfferingIncomeCreationCategory.Meetings
    ) {
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberType', { keepDirty: true });
      offeringIncomeCreationForm.resetField('amount', { keepDirty: true });
      offeringIncomeCreationForm.resetField('date', { keepDirty: true });
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
      offeringIncomeCreationForm.resetField('currency', { keepDirty: true });
      offeringIncomeCreationForm.resetField('comments', { keepDirty: true });
      offeringIncomeCreationForm.resetField('isNewExternalDonor', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorFirstNames', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorLastNames', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorGender', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorBirthDate', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorOriginCountry', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorResidenceCountry', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorEmail', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorPhoneNumber', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorResidenceCity', { keepDirty: true });
      offeringIncomeCreationForm.resetField('externalDonorPostalCode', { keepDirty: true });
    }
  }, [category]);

  useEffect(() => {
    if (
      type === OfferingIncomeCreationType.Offering &&
      subType === OfferingIncomeCreationSubType.SundayService
      // subType === OfferingIncomeCreationSubType.SundaySchool
    ) {
      offeringIncomeCreationForm.resetField('category', { keepDirty: true });
      offeringIncomeCreationForm.resetField('isNewExternalDonor', { keepDirty: true });
      offeringIncomeCreationForm.resetField('familyGroupId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('zoneId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberType', { keepDirty: true });
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
      offeringIncomeCreationForm.resetField('amount', { keepDirty: true });
      offeringIncomeCreationForm.resetField('date', { keepDirty: true });
      offeringIncomeCreationForm.resetField('currency', { keepDirty: true });
      offeringIncomeCreationForm.resetField('comments', { keepDirty: true });
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      (subType === OfferingIncomeCreationSubType.ChurchGround ||
        subType === OfferingIncomeCreationSubType.Special)
    ) {
      offeringIncomeCreationForm.resetField('category', { keepDirty: true });
      offeringIncomeCreationForm.resetField('isNewExternalDonor', { keepDirty: true });
      offeringIncomeCreationForm.resetField('familyGroupId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('zoneId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('amount', { keepDirty: true });
      offeringIncomeCreationForm.resetField('date', { keepDirty: true });
      offeringIncomeCreationForm.resetField('currency', { keepDirty: true });
      offeringIncomeCreationForm.resetField('comments', { keepDirty: true });
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      subType === OfferingIncomeCreationSubType.FamilyGroup
    ) {
      offeringIncomeCreationForm.resetField('category', { keepDirty: true });
      offeringIncomeCreationForm.resetField('isNewExternalDonor', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberType', { keepDirty: true });
      offeringIncomeCreationForm.resetField('zoneId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('amount', { keepDirty: true });
      offeringIncomeCreationForm.resetField('date', { keepDirty: true });
      offeringIncomeCreationForm.resetField('currency', { keepDirty: true });
      offeringIncomeCreationForm.resetField('comments', { keepDirty: true });
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      (subType === OfferingIncomeCreationSubType.ZonalVigil ||
        subType === OfferingIncomeCreationSubType.ZonalFasting ||
        subType === OfferingIncomeCreationSubType.ZonalEvangelism)
    ) {
      offeringIncomeCreationForm.resetField('category', { keepDirty: true });
      offeringIncomeCreationForm.resetField('isNewExternalDonor', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberType', { keepDirty: true });
      offeringIncomeCreationForm.resetField('familyGroupId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('amount', { keepDirty: true });
      offeringIncomeCreationForm.resetField('date', { keepDirty: true });
      offeringIncomeCreationForm.resetField('currency', { keepDirty: true });
      offeringIncomeCreationForm.resetField('comments', { keepDirty: true });
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
    }

    if (type === OfferingIncomeCreationType.IncomeAdjustment) {
      offeringIncomeCreationForm.resetField('category', { keepDirty: true });
      offeringIncomeCreationForm.resetField('isNewExternalDonor', { keepDirty: true });
      offeringIncomeCreationForm.resetField('subType', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberType', { keepDirty: true });
      offeringIncomeCreationForm.resetField('familyGroupId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('zoneId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('amount', { keepDirty: true });
      offeringIncomeCreationForm.resetField('date', { keepDirty: true });
      offeringIncomeCreationForm.resetField('currency', { keepDirty: true });
      offeringIncomeCreationForm.resetField('comments', { keepDirty: true });
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
    }

    if (
      type === OfferingIncomeCreationType.Offering &&
      subType !== OfferingIncomeCreationSubType.Special &&
      subType !== OfferingIncomeCreationSubType.ChurchGround &&
      subType !== OfferingIncomeCreationSubType.FamilyGroup &&
      subType !== OfferingIncomeCreationSubType.ZonalVigil &&
      subType !== OfferingIncomeCreationSubType.ZonalFasting &&
      subType !== OfferingIncomeCreationSubType.ZonalEvangelism
    ) {
      offeringIncomeCreationForm.resetField('category', { keepDirty: true });
      offeringIncomeCreationForm.resetField('isNewExternalDonor', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('memberType', { keepDirty: true });
      offeringIncomeCreationForm.resetField('familyGroupId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('zoneId', { keepDirty: true });
      offeringIncomeCreationForm.resetField('amount', { keepDirty: true });
      offeringIncomeCreationForm.resetField('date', { keepDirty: true });
      offeringIncomeCreationForm.resetField('currency', { keepDirty: true });
      offeringIncomeCreationForm.resetField('comments', { keepDirty: true });
      offeringIncomeCreationForm.resetField('shift', { keepDirty: true });
    }
  }, [type, subType]);
};
