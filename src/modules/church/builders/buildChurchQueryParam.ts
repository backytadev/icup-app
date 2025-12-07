import { ChurchQueryParams } from '@/modules/church/interfaces/church-query-params.interface';

export const buildChurchQueryParams = (params: ChurchQueryParams, term: string | undefined) => {
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
