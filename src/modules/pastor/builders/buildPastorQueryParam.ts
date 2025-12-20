import { PastorQueryParams } from '@/modules/pastor/interfaces/pastor-query-params.interface';

export const buildPastorQueryParams = (params: PastorQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, churchId } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (churchId) base.churchId = churchId;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};
