import { type ChurchSearchType } from '@/modules/church/enums/church-search-type.enum';

export interface ChurchSearchFormByTerm {
  searchType: ChurchSearchType;
  order: string;
  inputTerm?: string | undefined;
  selectTerm?: string | undefined;
  dateTerm?:
    | {
        from: Date;
        to?: Date | undefined;
      }
    | undefined;
  limit?: string | undefined;
  all?: boolean | undefined;
}
