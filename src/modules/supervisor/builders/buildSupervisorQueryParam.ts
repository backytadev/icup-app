import { SupervisorQueryParams } from '@/modules/supervisor/interfaces/supervisor-query-params.interface';

export const buildSupervisorQueryParams = (params: SupervisorQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, searchSubType, churchId, withNullZone } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
    withNullZone,
  };

  if (searchSubType) base.searchSubType = searchSubType;
  if (churchId) base.churchId = churchId;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};
