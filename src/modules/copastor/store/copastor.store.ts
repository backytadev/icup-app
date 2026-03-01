import { create } from 'zustand';

import { type CopastorResponse } from '@/modules/copastor/types';

export type CopastorSearchMode = 'general' | 'filters';

interface CopastorState {
  searchMode: CopastorSearchMode;
  searchData: CopastorResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface CopastorActions {
  setSearchMode: (value: CopastorSearchMode) => void;
  setSearchData: (value: CopastorResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type CopastorStore = CopastorState & CopastorActions;

const initialState: CopastorState = {
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useCopastorStore = create<CopastorStore>()((set) => ({
  ...initialState,
  setSearchMode: (value) => set({ searchMode: value }),
  setSearchData: (value) => set({ searchData: value }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

export const selectSearchMode = (state: CopastorStore): CopastorSearchMode => state.searchMode;
export const selectSearchData = (state: CopastorStore): CopastorResponse[] | undefined =>
  state.searchData;
export const selectFiltersDisabled = (state: CopastorStore): boolean => state.isFiltersDisabled;
