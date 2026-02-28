import { type ZoneSearchType } from '@/modules/zone/enums/zone-search-type.enum';

export interface ZoneSearchFormByTerm {
  searchType: ZoneSearchType;
  order: string;
  inputTerm?: string | undefined;
  selectTerm?: string | undefined;
  firstNamesTerm?: string | undefined;
  lastNamesTerm?: string | undefined;
  churchId?: string | undefined;
  limit?: string | undefined;
  all?: boolean | undefined;
}
