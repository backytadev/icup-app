import { create } from 'zustand';
import { type ChurchResponse } from '@/modules/church/types';

export type ChurchSearchMode = 'general' | 'filters';

interface ChurchState {
  // Legacy states (mantener compatibilidad durante transición)
  isGeneralFilterDisabled: boolean;
  isTermFilterDisabled: boolean;
  generalSearchData: ChurchResponse[] | undefined;
  termSearchData: ChurchResponse[] | undefined;

  // Unified state
  searchMode: ChurchSearchMode;
  searchData: ChurchResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface ChurchActions {
  // Legacy actions
  setGeneralFilterDisabled: (value: boolean) => void;
  setTermFilterDisabled: (value: boolean) => void;
  setGeneralSearchData: (data: ChurchResponse[] | undefined) => void;
  setTermSearchData: (data: ChurchResponse[] | undefined) => void;

  // Unified actions
  setSearchMode: (mode: ChurchSearchMode) => void;
  setSearchData: (data: ChurchResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type ChurchStore = ChurchState & ChurchActions;

const initialState: ChurchState = {
  // Legacy
  isGeneralFilterDisabled: true,
  isTermFilterDisabled: true,
  generalSearchData: undefined,
  termSearchData: undefined,

  // Unified
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useChurchStore = create<ChurchStore>()((set) => ({
  ...initialState,

  // Legacy actions
  setGeneralFilterDisabled: (value) => set({ isGeneralFilterDisabled: value }),
  setTermFilterDisabled: (value) => set({ isTermFilterDisabled: value }),
  setGeneralSearchData: (data) => set({ generalSearchData: data }),
  setTermSearchData: (data) => set({ termSearchData: data }),

  // Unified actions
  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchData: (data) => set({ searchData: data }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

// Legacy selectors
export const selectGeneralFilterDisabled = (state: ChurchStore): boolean =>
  state.isGeneralFilterDisabled;

export const selectTermFilterDisabled = (state: ChurchStore): boolean => state.isTermFilterDisabled;

export const selectGeneralSearchData = (state: ChurchStore): ChurchResponse[] | undefined =>
  state.generalSearchData;

export const selectTermSearchData = (state: ChurchStore): ChurchResponse[] | undefined =>
  state.termSearchData;

export const selectSetGeneralFilterDisabled = (state: ChurchStore) =>
  state.setGeneralFilterDisabled;

export const selectSetTermFilterDisabled = (state: ChurchStore) => state.setTermFilterDisabled;

export const selectSetGeneralSearchData = (state: ChurchStore) => state.setGeneralSearchData;

export const selectSetTermSearchData = (state: ChurchStore) => state.setTermSearchData;

// Unified selectors
export const selectSearchMode = (state: ChurchStore): ChurchSearchMode => state.searchMode;

export const selectSearchData = (state: ChurchStore): ChurchResponse[] | undefined =>
  state.searchData;

export const selectFiltersDisabled = (state: ChurchStore): boolean => state.isFiltersDisabled;

export const selectSetSearchMode = (state: ChurchStore) => state.setSearchMode;

export const selectSetSearchData = (state: ChurchStore) => state.setSearchData;

export const selectSetFiltersDisabled = (state: ChurchStore) => state.setFiltersDisabled;
