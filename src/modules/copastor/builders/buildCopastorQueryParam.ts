import { CopastorQueryParams } from '@/modules/copastor/interfaces/copastor-query-params.interface';

export const buildCopastorQueryParams = (params: CopastorQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, searchSubType, churchId } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (searchSubType) base.searchSubType = searchSubType;
  if (churchId) base.churchId = churchId;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};
