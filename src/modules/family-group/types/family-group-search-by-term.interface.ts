import { type FamilyGroupSearchType } from '@/modules/family-group/enums/family-group-search-type.enum';
import { type FamilyGroupSearchSubType } from '@/modules/family-group/enums/family-group-search-sub-type.enum';

export interface FamilyGroupSearchFormByTerm {
  searchType: FamilyGroupSearchType;
  searchSubType?: FamilyGroupSearchSubType | undefined;
  order: string;
  inputTerm?: string | undefined;
  selectTerm?: string | undefined;
  churchId?: string | undefined;
  firstNamesTerm?: string | undefined;
  lastNamesTerm?: string | undefined;
  limit?: string | undefined;
  all?: boolean | undefined;
}
