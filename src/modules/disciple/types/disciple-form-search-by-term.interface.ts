import { type DiscipleSearchType } from '@/modules/disciple/enums/disciple-search-type.enum';
import { type DiscipleSearchSubType } from '@/modules/disciple/enums/disciple-search-sub-type.enum';

export interface DiscipleSearchFormByTerm {
  searchType: DiscipleSearchType;
  searchSubType?: DiscipleSearchSubType | undefined;
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
