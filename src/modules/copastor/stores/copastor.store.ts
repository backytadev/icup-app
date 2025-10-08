/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';

interface CopastorStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: CopastorResponse[] | undefined;
  dataSearchByTermResponse: CopastorResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: CopastorResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: CopastorResponse[] | undefined) => void;
}

export const storeCopastor: StateCreator<CopastorStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: CopastorResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: CopastorResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const useCopastorStore = create<CopastorStore>()(storeCopastor);
