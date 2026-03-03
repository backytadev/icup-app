import { create } from 'zustand';

import { type DiscipleResponse } from '@/modules/disciple/types';

export type DiscipleSearchMode = 'general' | 'filters';

interface DiscipleStore {
  searchMode: DiscipleSearchMode;
  searchData: DiscipleResponse[] | undefined;
  isFiltersDisabled: boolean;

  setSearchMode: (mode: DiscipleSearchMode) => void;
  setSearchData: (data: DiscipleResponse[] | undefined) => void;
  setFiltersDisabled: (disabled: boolean) => void;
}

export const useDiscipleStore = create<DiscipleStore>((set) => ({
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,

  setSearchMode: (mode) => { set({ searchMode: mode }); },
  setSearchData: (data) => { set({ searchData: data }); },
  setFiltersDisabled: (disabled) => { set({ isFiltersDisabled: disabled }); },
}));

//* Selectors
export const selectSearchMode = (state: DiscipleStore): DiscipleSearchMode => state.searchMode;
export const selectSetSearchMode = (state: DiscipleStore): DiscipleStore['setSearchMode'] =>
  state.setSearchMode;

export const selectSearchData = (
  state: DiscipleStore
): DiscipleResponse[] | undefined => state.searchData;
export const selectSetSearchData = (state: DiscipleStore): DiscipleStore['setSearchData'] =>
  state.setSearchData;

export const selectFiltersDisabled = (state: DiscipleStore): boolean => state.isFiltersDisabled;
export const selectSetFiltersDisabled = (
  state: DiscipleStore
): DiscipleStore['setFiltersDisabled'] => state.setFiltersDisabled;
