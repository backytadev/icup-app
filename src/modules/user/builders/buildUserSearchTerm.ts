import { UserSearchType } from '@/modules/user/enums/user-search-type.enum';
import { UserQueryParams } from '@/modules/user/interfaces/user-query-params.interface';

export const buildUserSearchTerm = (params: UserQueryParams): string | undefined => {
  const { searchType, firstNamesTerm, lastNamesTerm, selectTerm, multiSelectTerm } = params;

  const mapping: Record<UserSearchType, string | undefined> = {
    [UserSearchType.FirstNames]: firstNamesTerm,
    [UserSearchType.LastNames]: lastNamesTerm,
    [UserSearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [UserSearchType.Gender]: selectTerm,
    [UserSearchType.Roles]: multiSelectTerm,
    [UserSearchType.RecordStatus]: selectTerm,
  };

  return mapping[searchType as UserSearchType];
};
