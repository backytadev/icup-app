import { create } from 'zustand';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';

export type OfferingIncomeSearchMode = 'general' | 'filters';

interface OfferingIncomeState {
  // Legacy states (mantener compatibilidad durante transición)
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;
  dataSearchGeneralResponse: OfferingIncomeResponse[] | undefined;
  dataSearchByTermResponse: OfferingIncomeResponse[] | undefined;

  // Unified state
  searchMode: OfferingIncomeSearchMode;
  searchData: OfferingIncomeResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface OfferingIncomeActions {
  // Legacy actions
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;
  setDataSearchGeneralResponse: (value: OfferingIncomeResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: OfferingIncomeResponse[] | undefined) => void;

  // Unified actions
  setSearchMode: (mode: OfferingIncomeSearchMode) => void;
  setSearchData: (data: OfferingIncomeResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type OfferingIncomeStore = OfferingIncomeState & OfferingIncomeActions;

const initialState: OfferingIncomeState = {
  // Legacy
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,
  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  // Unified
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,
};

export const useOfferingIncomeStore = create<OfferingIncomeStore>()((set) => ({
  ...initialState,

  // Legacy actions
  setIsFiltersSearchGeneralDisabled: (value) => set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value) => set({ isFiltersSearchByTermDisabled: value }),
  setDataSearchGeneralResponse: (value) => set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value) => set({ dataSearchByTermResponse: value }),

  // Unified actions
  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchData: (data) => set({ searchData: data }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),

  reset: () => set(initialState),
}));

// Legacy selectors
export const selectFiltersSearchGeneralDisabled = (state: OfferingIncomeStore): boolean =>
  state.isFiltersSearchGeneralDisabled;
export const selectFiltersSearchByTermDisabled = (state: OfferingIncomeStore): boolean =>
  state.isFiltersSearchByTermDisabled;

// Unified selectors
export const selectSearchMode = (state: OfferingIncomeStore): OfferingIncomeSearchMode =>
  state.searchMode;
export const selectSearchData = (state: OfferingIncomeStore): OfferingIncomeResponse[] | undefined =>
  state.searchData;
export const selectFiltersDisabled = (state: OfferingIncomeStore): boolean =>
  state.isFiltersDisabled;
export const selectSetSearchMode = (state: OfferingIncomeStore) => state.setSearchMode;
export const selectSetSearchData = (state: OfferingIncomeStore) => state.setSearchData;
export const selectSetFiltersDisabled = (state: OfferingIncomeStore) => state.setFiltersDisabled;
