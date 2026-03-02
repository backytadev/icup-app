import { create } from 'zustand';
import { type PreacherResponse } from '@/modules/preacher/types/preacher-response.interface';

export type PreacherSearchMode = 'general' | 'filters';

interface PreacherStore {
  searchMode: PreacherSearchMode;
  searchData: PreacherResponse[] | undefined;
  isFiltersDisabled: boolean;

  setSearchMode: (mode: PreacherSearchMode) => void;
  setSearchData: (data: PreacherResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;
}

export const usePreacherStore = create<PreacherStore>()((set) => ({
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,

  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchData: (data) => set({ searchData: data }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),
}));

export const selectSearchMode = (s: PreacherStore): PreacherSearchMode => s.searchMode;
export const selectSetSearchMode = (s: PreacherStore) => s.setSearchMode;
export const selectSearchData = (s: PreacherStore): PreacherResponse[] | undefined => s.searchData;
export const selectSetSearchData = (s: PreacherStore) => s.setSearchData;
export const selectFiltersDisabled = (s: PreacherStore): boolean => s.isFiltersDisabled;
export const selectSetFiltersDisabled = (s: PreacherStore) => s.setFiltersDisabled;
