import { type SupervisorSearchType } from '@/modules/supervisor/enums/supervisor-search-type.enum';
import { type SupervisorSearchSubType } from '@/modules/supervisor/enums/supervisor-search-sub-type.num';

export interface SupervisorSearchFormByTerm {
  searchType?: SupervisorSearchType;
  searchSubType?: SupervisorSearchSubType | undefined;
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
