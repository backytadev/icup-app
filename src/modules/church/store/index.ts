export {
  useChurchStore,
  // Legacy selectors
  selectGeneralFilterDisabled,
  selectTermFilterDisabled,
  selectGeneralSearchData,
  selectTermSearchData,
  selectSetGeneralFilterDisabled,
  selectSetTermFilterDisabled,
  selectSetGeneralSearchData,
  selectSetTermSearchData,
  // Unified selectors
  selectSearchMode,
  selectSearchData,
  selectFiltersDisabled,
  selectSetSearchMode,
  selectSetSearchData,
  selectSetFiltersDisabled,
} from './church.store';

export type { ChurchSearchMode } from './church.store';
