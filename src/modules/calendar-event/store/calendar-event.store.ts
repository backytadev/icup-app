import { create } from 'zustand';
import { type CalendarEventResponse } from '@/modules/calendar-event/types/calendar-event-response.interface';

export type CalendarEventSearchMode = 'general' | 'filters';

interface CalendarEventStore {
  searchMode: CalendarEventSearchMode;
  searchData: CalendarEventResponse[] | undefined;
  isFiltersDisabled: boolean;

  setSearchMode: (mode: CalendarEventSearchMode) => void;
  setSearchData: (data: CalendarEventResponse[] | undefined) => void;
  setFiltersDisabled: (value: boolean) => void;
}

export const useCalendarEventStore = create<CalendarEventStore>()((set) => ({
  searchMode: 'general',
  searchData: undefined,
  isFiltersDisabled: true,

  setSearchMode: (mode) => set({ searchMode: mode }),
  setSearchData: (data) => set({ searchData: data }),
  setFiltersDisabled: (value) => set({ isFiltersDisabled: value }),
}));

export const selectSearchMode = (s: CalendarEventStore): CalendarEventSearchMode => s.searchMode;
export const selectSearchData = (s: CalendarEventStore): CalendarEventResponse[] | undefined =>
  s.searchData;
export const selectFiltersDisabled = (s: CalendarEventStore): boolean => s.isFiltersDisabled;
