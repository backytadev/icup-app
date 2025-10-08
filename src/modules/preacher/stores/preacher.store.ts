/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';

interface PreacherStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: PreacherResponse[] | undefined;
  dataSearchByTermResponse: PreacherResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: PreacherResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: PreacherResponse[] | undefined) => void;
}

export const storePreacher: StateCreator<PreacherStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: PreacherResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: PreacherResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const usePreacherStore = create<PreacherStore>()(storePreacher);
