/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';

interface OfferingExpenseStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: OfferingExpenseResponse[] | undefined;
  dataSearchByTermResponse: OfferingExpenseResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: OfferingExpenseResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: OfferingExpenseResponse[] | undefined) => void;
}

export const storeOfferingExpense: StateCreator<OfferingExpenseStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: OfferingExpenseResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: OfferingExpenseResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const useOfferingExpenseStore = create<OfferingExpenseStore>()(storeOfferingExpense);
