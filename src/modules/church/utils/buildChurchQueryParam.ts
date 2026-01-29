import { ChurchQueryParams } from '@/modules/church/types';

export const buildChurchQueryParams = (params: ChurchQueryParams, term: string | undefined) => {
  const { limit, offset, order, all, searchType } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (!all) {
    return { ...base, limit, offset };
  }

  return base;
};
