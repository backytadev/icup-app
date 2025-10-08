/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

interface OfferingIncomeStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: OfferingIncomeResponse[] | undefined;
  dataSearchByTermResponse: OfferingIncomeResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: OfferingIncomeResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: OfferingIncomeResponse[] | undefined) => void;
}

export const storeOfferingIncome: StateCreator<OfferingIncomeStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: OfferingIncomeResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: OfferingIncomeResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const useOfferingIncomeStore = create<OfferingIncomeStore>()(storeOfferingIncome);
