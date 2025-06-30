/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { useEffect } from 'react';

import { type UseFormReturn } from 'react-hook-form';

import { OfferingExpenseSearchType } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import { type OfferingExpenseFormData } from '@/modules/offering/expense/interfaces/offering-expense-form-data.interface';

interface Options {
  isInputDisabled: boolean;
  isDropZoneDisabled: boolean;
  isDeleteFileButtonDisabled: boolean;
  setIsDropZoneDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMessageErrorDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSubmitButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  offeringExpenseCreationForm: UseFormReturn<
    OfferingExpenseFormData,
    any,
    OfferingExpenseFormData | undefined
  >;
}

export const useOfferingExpenseCreationSubmitButtonLogic = ({
  isInputDisabled,
  isDropZoneDisabled,
  setIsDropZoneDisabled,
  setIsSubmitButtonDisabled,
  setIsMessageErrorDisabled,
  isDeleteFileButtonDisabled,
  offeringExpenseCreationForm,
}: Options): void => {
  //* Watchers
  const type = offeringExpenseCreationForm.watch('type');
  const subType = offeringExpenseCreationForm.watch('subType');
  const amount = offeringExpenseCreationForm.watch('amount');
  const currency = offeringExpenseCreationForm.watch('currency');
  const date = offeringExpenseCreationForm.watch('date');
  const comments = offeringExpenseCreationForm.watch('comments');
  const fileNames = offeringExpenseCreationForm.watch('fileNames');
  const churchId = offeringExpenseCreationForm.watch('churchId');

  //* Effects
  useEffect(() => {
    if (
      offeringExpenseCreationForm.formState.errors &&
      Object.values(offeringExpenseCreationForm.formState.errors).length > 0
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* Expense adjustment
    if (
      type === OfferingExpenseSearchType.ExpensesAdjustment &&
      !subType &&
      amount &&
      currency &&
      date &&
      comments.length >= 5 &&
      churchId &&
      Object.values(offeringExpenseCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    if (
      type === OfferingExpenseSearchType.ExpensesAdjustment &&
      (!churchId || !amount || !currency || !date || comments.length < 5)
    ) {
      setIsSubmitButtonDisabled(true);
      setIsMessageErrorDisabled(true);
    }

    //* All values types
    if (
      (type === OfferingExpenseSearchType.OperationalExpenses ||
        type === OfferingExpenseSearchType.PlaningEventsExpenses ||
        type === OfferingExpenseSearchType.DecorationExpenses ||
        type === OfferingExpenseSearchType.EquipmentAndTechnologyExpenses ||
        type === OfferingExpenseSearchType.MaintenanceAndRepairExpenses ||
        type === OfferingExpenseSearchType.SuppliesExpenses ||
        type === OfferingExpenseSearchType.OtherExpenses) &&
      date &&
      subType &&
      amount &&
      currency &&
      churchId &&
      comments.length >= 5 &&
      Object.values(offeringExpenseCreationForm.formState.errors).length === 0 &&
      (!isInputDisabled || !isDropZoneDisabled || !isDeleteFileButtonDisabled)
    ) {
      setIsSubmitButtonDisabled(false);
      setIsMessageErrorDisabled(false);
    }

    //* Others values
    if (!churchId || !amount || !currency || !date || comments.length < 5) {
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
    offeringExpenseCreationForm.formState,
    type,
    date,
    subType,
    amount,
    currency,
    comments,
    churchId,
    fileNames,
  ]);

  //* Reset relations
  useEffect(() => {
    if (type === OfferingExpenseSearchType.ExpensesAdjustment) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }

    if (type === OfferingExpenseSearchType.OperationalExpenses) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }

    if (type === OfferingExpenseSearchType.MaintenanceAndRepairExpenses) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }

    if (type === OfferingExpenseSearchType.EquipmentAndTechnologyExpenses) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }

    if (type === OfferingExpenseSearchType.DecorationExpenses) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }

    if (type === OfferingExpenseSearchType.PlaningEventsExpenses) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }

    if (type === OfferingExpenseSearchType.SuppliesExpenses) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }

    if (type === OfferingExpenseSearchType.OtherExpenses) {
      offeringExpenseCreationForm.resetField('subType', { keepDirty: true });
      offeringExpenseCreationForm.resetField('amount', { keepDirty: true });
      offeringExpenseCreationForm.resetField('date', { keepDirty: true });
      offeringExpenseCreationForm.resetField('currency', { keepDirty: true });
      offeringExpenseCreationForm.resetField('comments', { keepDirty: true });
    }
  }, [type]);
};
