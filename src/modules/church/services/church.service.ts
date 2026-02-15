import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';

import { ChurchSearchType } from '@/modules/church/enums';
import { type ChurchResponse, type ChurchFormData, type ChurchQueryParams } from '@/modules/church/types';

export interface UpdateChurchOptions {
  id: string;
  formData: ChurchFormData;
}

export interface InactivateChurchOptions {
  id: string;
  churchInactivationCategory: string;
  churchInactivationReason: string;
}

//* Internal helpers - used only in this service
const buildChurchSearchTerm = (params: ChurchQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm } = params;

  const mapping: Record<ChurchSearchType, string | undefined> = {
    [ChurchSearchType.ChurchName]: inputTerm,
    [ChurchSearchType.Department]: inputTerm,
    [ChurchSearchType.Province]: inputTerm,
    [ChurchSearchType.District]: inputTerm,
    [ChurchSearchType.UrbanSector]: inputTerm,
    [ChurchSearchType.Address]: inputTerm,
    [ChurchSearchType.FoundingDate]: dateTerm,
    [ChurchSearchType.RecordStatus]: selectTerm,
  };

  return mapping[searchType as ChurchSearchType];
};

const buildChurchQueryParams = (
  params: ChurchQueryParams,
  term: string | undefined
): Record<string, any> => {
  const { limit, offset, order, all, searchType } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  return all ? base : { ...base, limit, offset };
};

//* Create
export const createChurch = async (formData: ChurchFormData): Promise<ChurchResponse> => {
  return apiRequest('post', '/churches', formData);
};

//* Find main church
export const getMainChurch = async (): Promise<ChurchResponse[]> => {
  return apiRequest('get', '/churches/main-church', {
    params: {
      limit: 1,
      offset: 0,
      order: RecordOrder.Ascending,
    },
  });
};

//* Find simple churches
export const getSimpleChurches = async ({
  isSimpleQuery,
}: {
  isSimpleQuery: boolean;
}): Promise<ChurchResponse[]> => {
  return apiRequest<ChurchResponse[]>('get', '/churches', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
    },
  });
};

//* Find all churches
export const getAllChurches = async (params: ChurchQueryParams): Promise<ChurchResponse[]> => {
  const { limit, offset, order, all } = params;

  const query = all ? { order } : { limit, offset, order };

  return apiRequest<ChurchResponse[]>('get', '/churches', { params: query });
};

//* Find by filters
export const getChurchesByFilters = async (
  params: ChurchQueryParams
): Promise<ChurchResponse[]> => {
  const term = buildChurchSearchTerm(params);
  const queryParams = buildChurchQueryParams(params, term);

  return apiRequest<ChurchResponse[]>('get', '/churches/search', { params: queryParams });
};

//* Update
export const updateChurch = async ({
  id,
  formData,
}: UpdateChurchOptions): Promise<ChurchResponse> => {
  return apiRequest('patch', `/churches/${id}`, formData);
};

//* Delete
export const inactivateChurch = async (params: InactivateChurchOptions): Promise<void> => {
  const { id, churchInactivationCategory, churchInactivationReason } = params;

  return apiRequest('delete', `/churches/${id}`, {
    params: { churchInactivationCategory, churchInactivationReason },
  });
};

//* Reports
export const getGeneralChurchesReport = async (params: ChurchQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;

  const query = all ? { order } : { limit, offset, order };

  const pdf = await apiRequest<Blob>('get', '/reports/churches', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getChurchesReportByFilters = async (params: ChurchQueryParams): Promise<boolean> => {
  const term = buildChurchSearchTerm(params);
  const queryParams = buildChurchQueryParams(params, term);

  const pdf = await apiRequest<Blob>('get', '/reports/churches/search', {
    params: queryParams,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
