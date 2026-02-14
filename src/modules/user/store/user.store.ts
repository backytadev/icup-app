/* eslint-disable @typescript-eslint/no-confusing-void-expression */

import { create, type StateCreator } from 'zustand';
import { type UserResponse } from '@/modules/user/types/user-response.interface';

//* Search modes
export type UserSearchMode = 'general' | 'filters';

//* Store interface
interface UserStore {
  //* Properties
  searchMode: UserSearchMode;
  isFiltersDisabled: boolean;
  searchData: UserResponse[] | undefined;

  //* Methods
  setSearchMode: (value: UserSearchMode) => void;
  setFiltersDisabled: (value: boolean) => void;
  setSearchData: (value: UserResponse[] | undefined) => void;
}

//* Store creator
const storeUser: StateCreator<UserStore> = (set) => ({
  searchMode: 'general',
  isFiltersDisabled: true,
  searchData: undefined,

  setSearchMode: (value: UserSearchMode) => set({ searchMode: value }),
  setFiltersDisabled: (value: boolean) => set({ isFiltersDisabled: value }),
  setSearchData: (value: UserResponse[] | undefined) => set({ searchData: value }),
});

//* Create store
export const useUserStore = create<UserStore>()(storeUser);

//* Selectors
export const selectSearchMode = (state: UserStore) => state.searchMode;
export const selectSetSearchMode = (state: UserStore) => state.setSearchMode;
export const selectFiltersDisabled = (state: UserStore) => state.isFiltersDisabled;
export const selectSetFiltersDisabled = (state: UserStore) => state.setFiltersDisabled;
export const selectSearchData = (state: UserStore) => state.searchData;
export const selectSetSearchData = (state: UserStore) => state.setSearchData;
