import { create } from 'zustand';
import { type MinistryResponse } from '@/modules/ministry/types';

interface MinistryState {
  isGeneralFilterDisabled: boolean;
  isTermFilterDisabled: boolean;

  generalSearchData: MinistryResponse[] | undefined;
  termSearchData: MinistryResponse[] | undefined;
}

interface MinistryActions {
  setGeneralFilterDisabled: (value: boolean) => void;
  setTermFilterDisabled: (value: boolean) => void;

  setGeneralSearchData: (data: MinistryResponse[] | undefined) => void;
  setTermSearchData: (data: MinistryResponse[] | undefined) => void;

  reset: () => void;
}

type MinistryStore = MinistryState & MinistryActions;

const initialState: MinistryState = {
  isGeneralFilterDisabled: true,
  isTermFilterDisabled: true,
  generalSearchData: undefined,
  termSearchData: undefined,
};

export const useMinistryStore = create<MinistryStore>()((set) => ({
  ...initialState,

  setGeneralFilterDisabled: (value) => set({ isGeneralFilterDisabled: value }),
  setTermFilterDisabled: (value) => set({ isTermFilterDisabled: value }),

  setGeneralSearchData: (data) => set({ generalSearchData: data }),
  setTermSearchData: (data) => set({ termSearchData: data }),

  reset: () => set(initialState),
}));

export const selectGeneralFilterDisabled = (state: MinistryStore): boolean =>
  state.isGeneralFilterDisabled;

export const selectTermFilterDisabled = (state: MinistryStore): boolean =>
  state.isTermFilterDisabled;

export const selectGeneralSearchData = (state: MinistryStore): MinistryResponse[] | undefined =>
  state.generalSearchData;

export const selectTermSearchData = (state: MinistryStore): MinistryResponse[] | undefined =>
  state.termSearchData;

export const selectSetGeneralFilterDisabled = (state: MinistryStore) =>
  state.setGeneralFilterDisabled;

export const selectSetTermFilterDisabled = (state: MinistryStore) => state.setTermFilterDisabled;

export const selectSetGeneralSearchData = (state: MinistryStore) => state.setGeneralSearchData;

export const selectSetTermSearchData = (state: MinistryStore) => state.setTermSearchData;
