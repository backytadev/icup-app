/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type MinistryResponse } from '@/modules/ministry/interfaces/ministry-response.interface';

interface MinistryStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: MinistryResponse[] | undefined;
  dataSearchByTermResponse: MinistryResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: MinistryResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: MinistryResponse[] | undefined) => void;
}

export const storeMinistry: StateCreator<MinistryStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: MinistryResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: MinistryResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const useMinistryStore = create<MinistryStore>()(storeMinistry);
