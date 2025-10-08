/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type UserResponse } from '@/modules/user/interfaces/user-response.interface';

interface UserStore {
  //* Properties
  isFiltersSearchGeneralDisabled: boolean;
  isFiltersSearchByTermDisabled: boolean;

  dataSearchGeneralResponse: UserResponse[] | undefined;
  dataSearchByTermResponse: UserResponse[] | undefined;

  //* Methods
  setIsFiltersSearchGeneralDisabled: (value: boolean) => void;
  setIsFiltersSearchByTermDisabled: (value: boolean) => void;

  setDataSearchGeneralResponse: (value: UserResponse[] | undefined) => void;
  setDataSearchByTermResponse: (value: UserResponse[] | undefined) => void;
}

export const storeUser: StateCreator<UserStore> = (set) => ({
  isFiltersSearchGeneralDisabled: true,
  isFiltersSearchByTermDisabled: true,

  dataSearchGeneralResponse: undefined,
  dataSearchByTermResponse: undefined,

  setIsFiltersSearchGeneralDisabled: (value: boolean) =>
    set({ isFiltersSearchGeneralDisabled: value }),
  setIsFiltersSearchByTermDisabled: (value: boolean) =>
    set({ isFiltersSearchByTermDisabled: value }),

  setDataSearchGeneralResponse: (value: UserResponse[] | undefined) =>
    set({ dataSearchGeneralResponse: value }),
  setDataSearchByTermResponse: (value: UserResponse[] | undefined) =>
    set({ dataSearchByTermResponse: value }),
});

export const useUserStore = create<UserStore>()(storeUser);
