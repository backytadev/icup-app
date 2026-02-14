import { create } from 'zustand';
import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';

export type OfferingExpenseSearchMode = 'general' | 'filters';

interface OfferingExpenseState {
  // Legacy states (mantener compatibilidad durante transición)
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;
  dataSearchGeneralResponse: OfferingExpenseResponse[] | undefined;
  dataSearchByTermResponse: OfferingExpenseResponse[] | undefined;

  // Unified state
  searchMode: OfferingExpenseSearchMode;
  searchData: OfferingExpenseResponse[] | undefined;
  isFiltersDisabled: boolean;
}

interface OfferingExpenseActions {
  // Legacy actions
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;
  setDataSearchGeneralResponse: (value: OfferingExpenseResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: OfferingExpenseResponse[] | undefined) => void;

  // Unified actions
  setSearchMode: (mode: OfferingExpenseSearchMode) => void;
  setSearchData: (data: OfferingExpenseResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;

  reset: () => void;
}

type OfferingExpenseStore = OfferingExpenseState & OfferingExpenseActions;

const initialState: OfferingExpenseState = {
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

export const useOfferingExpenseStore = create<OfferingExpenseStore>()((set) => ({
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
export const selectFiltersSearchGeneralDisabled = (state: OfferingExpenseStore): boolean =>
  state.isFiltersSearchGeneralDisabled;
export const selectFiltersSearchByTermDisabled = (state: OfferingExpenseStore): boolean =>
  state.isFiltersSearchByTermDisabled;

// Unified selectors
export const selectSearchMode = (state: OfferingExpenseStore): OfferingExpenseSearchMode =>
  state.searchMode;
export const selectSearchData = (state: OfferingExpenseStore): OfferingExpenseResponse[] | undefined =>
  state.searchData;
export const selectFiltersDisabled = (state: OfferingExpenseStore): boolean =>
  state.isFiltersDisabled;
export const selectSetSearchMode = (state: OfferingExpenseStore) => state.setSearchMode;
export const selectSetSearchData = (state: OfferingExpenseStore) => state.setSearchData;
export const selectSetFiltersDisabled = (state: OfferingExpenseStore) => state.setFiltersDisabled;
