import { create } from 'zustand';

import { type ZoneResponse } from '@/modules/zone/types';

export type ZoneSearchMode = 'general' | 'filters';

interface ZoneState {
  searchMode: ZoneSearchMode;
  searchData: ZoneResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface ZoneActions {
  setSearchMode: (value: ZoneSearchMode) => void;
  setSearchData: (value: ZoneResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type ZoneStore = ZoneState & ZoneActions;

const initialState: ZoneState = {
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useZoneStore = create<ZoneStore>()((set) => ({
  ...initialState,
  setSearchMode: (value) => set({ searchMode: value }),
  setSearchData: (value) => set({ searchData: value }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

export const selectSearchMode = (state: ZoneStore): ZoneSearchMode => state.searchMode;
export const selectSearchData = (state: ZoneStore): ZoneResponse[] | undefined => state.searchData;
export const selectFiltersDisabled = (state: ZoneStore): boolean => state.isFiltersDisabled;
