import { type UserRole } from '@/modules/user/enums/user-role.enum';
import { type UserSearchType } from '@/modules/user/enums/user-search-type.enum';

export interface UserSearchFormByTerm {
  searchType: UserSearchType;
  order: string;
  multiSelectTerm?: string | UserRole[] | undefined;
  selectTerm?: string | undefined;
  firstNamesTerm?: string | undefined;
  lastNamesTerm?: string | undefined;
  limit?: string | undefined;
  all?: boolean | undefined;
}
