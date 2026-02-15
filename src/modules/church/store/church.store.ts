import { create } from 'zustand';
import { type ChurchResponse } from '@/modules/church/types';

export type ChurchSearchMode = 'general' | 'filters';

interface ChurchState {
  searchMode: ChurchSearchMode;
  searchData: ChurchResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface ChurchActions {
  setSearchMode: (mode: ChurchSearchMode) => void;
  setSearchData: (data: ChurchResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type ChurchStore = ChurchState & ChurchActions;

const initialState: ChurchState = {
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useChurchStore = create<ChurchStore>()((set) => ({
  ...initialState,

  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchData: (data) => set({ searchData: data }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

//* Selectors - only for state values, not for actions
//* Actions should be accessed directly from the store
export const selectSearchMode = (state: ChurchStore): ChurchSearchMode => state.searchMode;
export const selectSearchData = (state: ChurchStore): ChurchResponse[] | undefined =>
  state.searchData;
export const selectFiltersDisabled = (state: ChurchStore): boolean => state.isFiltersDisabled;
