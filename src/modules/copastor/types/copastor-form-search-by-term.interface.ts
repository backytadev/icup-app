import { type CopastorSearchType } from '@/modules/copastor/enums/copastor-search-type.enum';
import { type CopastorSearchSubType } from '@/modules/copastor/enums/copastor-search-sub-type.enum';

export interface CopastorSearchFormByTerm {
  searchType: CopastorSearchType;
  searchSubType?: CopastorSearchSubType | undefined;
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
