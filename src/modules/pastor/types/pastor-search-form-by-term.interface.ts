import { type PastorSearchType } from '@/modules/pastor/enums/pastor-search-type.enum';

export interface PastorSearchFormByTerm {
  searchType: PastorSearchType;
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
