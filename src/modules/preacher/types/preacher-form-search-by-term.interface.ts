import { type PreacherSearchType } from '@/modules/preacher/enums/preacher-search-type.enum';
import { type PreacherSearchSubType } from '@/modules/preacher/enums/preacher-search-sub-type.enum';

export interface PreacherSearchFormByTerm {
  searchType: PreacherSearchType;
  searchSubType?: PreacherSearchSubType;
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
  order: string;
  limit?: string | undefined;
  all?: boolean | undefined;
}
