import { create } from 'zustand';
import { type ChurchResponse } from '@/modules/church/types';

interface ChurchState {
  isGeneralFilterDisabled: boolean;
  isTermFilterDisabled: boolean;

  generalSearchData: ChurchResponse[] | undefined;
  termSearchData: ChurchResponse[] | undefined;
}

interface ChurchActions {
  setGeneralFilterDisabled: (value: boolean) => void;
  setTermFilterDisabled: (value: boolean) => void;

  setGeneralSearchData: (data: ChurchResponse[] | undefined) => void;
  setTermSearchData: (data: ChurchResponse[] | undefined) => void;

  reset: () => void;
}

type ChurchStore = ChurchState & ChurchActions;

const initialState: ChurchState = {
  isGeneralFilterDisabled: true,
  isTermFilterDisabled: true,
  generalSearchData: undefined,
  termSearchData: undefined,
};

export const useChurchStore = create<ChurchStore>()((set) => ({
  ...initialState,

  setGeneralFilterDisabled: (value) => set({ isGeneralFilterDisabled: value }),
  setTermFilterDisabled: (value) => set({ isTermFilterDisabled: value }),

  setGeneralSearchData: (data) => set({ generalSearchData: data }),
  setTermSearchData: (data) => set({ termSearchData: data }),

  reset: () => set(initialState),
}));

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
