import { create } from 'zustand';

import { type SupervisorResponse } from '@/modules/supervisor/types';

export type SupervisorSearchMode = 'general' | 'filters';

interface SupervisorState {
  searchMode: SupervisorSearchMode;
  searchData: SupervisorResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface SupervisorActions {
  setSearchMode: (value: SupervisorSearchMode) => void;
  setSearchData: (value: SupervisorResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type SupervisorStore = SupervisorState & SupervisorActions;

const initialState: SupervisorState = {
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useSupervisorStore = create<SupervisorStore>()((set) => ({
  ...initialState,
  setSearchMode: (value) => set({ searchMode: value }),
  setSearchData: (value) => set({ searchData: value }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

export const selectSearchMode = (state: SupervisorStore): SupervisorSearchMode => state.searchMode;
export const selectSearchData = (state: SupervisorStore): SupervisorResponse[] | undefined =>
  state.searchData;
export const selectFiltersDisabled = (state: SupervisorStore): boolean => state.isFiltersDisabled;
