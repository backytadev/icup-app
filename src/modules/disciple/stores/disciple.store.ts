/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';

interface DiscipleStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: DiscipleResponse[] | undefined;
  dataSearchByTermResponse: DiscipleResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: DiscipleResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: DiscipleResponse[] | undefined) => void;
}

export const storeDisciple: StateCreator<DiscipleStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: DiscipleResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: DiscipleResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const useDiscipleStore = create<DiscipleStore>()(storeDisciple);
