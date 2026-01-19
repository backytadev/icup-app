import { PreacherQueryParams } from '@/modules/preacher/interfaces/preacher-query-params.interface';

export const buildPreacherQueryParams = (params: PreacherQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, searchSubType, churchId, withNullFamilyGroup } =
    params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
    withNullFamilyGroup,
  };

  if (searchSubType) base.searchSubType = searchSubType;
  if (churchId) base.churchId = churchId;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};
