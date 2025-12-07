import { UserQueryParams } from '@/modules/user/interfaces/user-query-params.interface';

export const buildUserQueryParams = (params: UserQueryParams, term: string | undefined) => {
  const { limit, offset, order, all, searchType } = params;

  const base = {
    term,
    searchType,
    order,
  };

  if (!all) {
    return { ...base, limit, offset };
  }

  return base;
};
