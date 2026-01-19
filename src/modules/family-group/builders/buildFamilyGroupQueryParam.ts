import { SupervisorQueryParams } from '@/modules/supervisor/interfaces/supervisor-query-params.interface';

export const buildFamilyGroupQueryParams = (params: SupervisorQueryParams, term?: string) => {
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
