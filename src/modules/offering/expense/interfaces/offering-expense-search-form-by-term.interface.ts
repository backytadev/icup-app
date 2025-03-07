import { type OfferingExpenseSearchType } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import { type OfferingExpenseSearchSubType } from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';

export interface OfferingExpenseSearchFormByTerm {
  searchType: OfferingExpenseSearchType;
  searchSubType?: '' | OfferingExpenseSearchSubType;
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
