/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type ZoneResponse } from '@/modules/zone/interfaces/zone-response.interface';

interface ZoneStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: ZoneResponse[] | undefined;
  dataSearchByTermResponse: ZoneResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: ZoneResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: ZoneResponse[] | undefined) => void;
}

export const storeZone: StateCreator<ZoneStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: ZoneResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: ZoneResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const useZoneStore = create<ZoneStore>()(storeZone);
