import { type MinistrySearchType } from '@/modules/ministry/enums/ministry-search-type.enum';
import { MinistrySearchSubType } from '@/modules/ministry/enums/ministry-search-sub-type.enum';

export interface MinistrySearchFormByTerm {
  searchType: MinistrySearchType;
  searchSubType?: MinistrySearchSubType | undefined;
  order: string;
  inputTerm?: string | undefined;
  selectTerm?: string | undefined;
  churchId?: string | undefined;
  dateTerm?:
    | {
        from: Date;
        to?: Date | undefined;
      }
    | undefined;
  firstNamesTerm?: string | undefined;
  lastNamesTerm?: string | undefined;
  limit?: string | undefined;
  all?: boolean | undefined;
}
