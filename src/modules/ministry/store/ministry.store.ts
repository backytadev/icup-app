import { create } from 'zustand';
import { type MinistryResponse } from '@/modules/ministry/types';

export type MinistrySearchMode = 'general' | 'filters';

interface MinistryState {
  searchMode: MinistrySearchMode;
  searchData: MinistryResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface MinistryActions {
  setSearchMode: (mode: MinistrySearchMode) => void;
  setSearchData: (data: MinistryResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type MinistryStore = MinistryState & MinistryActions;

const initialState: MinistryState = {
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useMinistryStore = create<MinistryStore>()((set) => ({
  ...initialState,

  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchData: (data) => set({ searchData: data }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

// Selectors
export const selectSearchMode = (state: MinistryStore): MinistrySearchMode => state.searchMode;
export const selectSearchData = (state: MinistryStore): MinistryResponse[] | undefined =>
  state.searchData;
export const selectFiltersDisabled = (state: MinistryStore): boolean => state.isFiltersDisabled;

export const selectSetSearchMode = (state: MinistryStore) => state.setSearchMode;
export const selectSetSearchData = (state: MinistryStore) => state.setSearchData;
export const selectSetFiltersDisabled = (state: MinistryStore) => state.setFiltersDisabled;
