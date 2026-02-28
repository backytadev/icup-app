import { create } from 'zustand';

import { type FamilyGroupResponse } from '@/modules/family-group/types';

export type FamilyGroupSearchMode = 'general' | 'filters';

interface FamilyGroupState {
  searchMode: FamilyGroupSearchMode;
  searchData: FamilyGroupResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface FamilyGroupActions {
  setSearchMode: (value: FamilyGroupSearchMode) => void;
  setSearchData: (value: FamilyGroupResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type FamilyGroupStore = FamilyGroupState & FamilyGroupActions;

const initialState: FamilyGroupState = {
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useFamilyGroupStore = create<FamilyGroupStore>()((set) => ({
  ...initialState,
  setSearchMode: (value) => set({ searchMode: value }),
  setSearchData: (value) => set({ searchData: value }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

export const selectSearchMode = (state: FamilyGroupStore): FamilyGroupSearchMode =>
  state.searchMode;
export const selectSearchData = (state: FamilyGroupStore): FamilyGroupResponse[] | undefined =>
  state.searchData;
export const selectFiltersDisabled = (state: FamilyGroupStore): boolean => state.isFiltersDisabled;
