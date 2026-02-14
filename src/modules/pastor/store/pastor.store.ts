import { create } from 'zustand';
import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';

export type PastorSearchMode = 'general' | 'filters';

interface PastorState {
  //* Legacy properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: PastorResponse[] | undefined;
  dataSearchByTermResponse: PastorResponse[] | undefined;

  //* Unified state
  searchMode: PastorSearchMode;
  searchData: PastorResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface PastorActions {
  //* Legacy methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: PastorResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: PastorResponse[] | undefined) => void;

  //* Unified actions
  setSearchMode: (mode: PastorSearchMode) => void;
  setSearchData: (data: PastorResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;
}

type PastorStore = PastorState & PastorActions;

export const usePastorStore = create<PastorStore>()((set) => ({
  //* Legacy
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,
  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  //* Unified
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,

  //* Legacy actions
  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: PastorResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: PastorResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),

  //* Unified actions
  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchData: (data) => set({ searchData: data }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),
}));

//* Unified selectors
export const selectSearchMode = (state: PastorStore): PastorSearchMode => state.searchMode;

export const selectSearchData = (state: PastorStore): PastorResponse[] | undefined =>
  state.searchData;

export const selectFiltersDisabled = (state: PastorStore): boolean => state.isFiltersDisabled;

export const selectSetSearchMode = (state: PastorStore) => state.setSearchMode;

export const selectSetSearchData = (state: PastorStore) => state.setSearchData;

export const selectSetFiltersDisabled = (state: PastorStore) => state.setFiltersDisabled;
