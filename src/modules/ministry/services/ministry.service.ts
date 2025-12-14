import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';

import { type MinistryResponse } from '@/modules/ministry/interfaces/ministry-response.interface';
import { type MinistryFormData } from '@/modules/ministry/interfaces/ministry-form-data.interface';
import { type MinistryQueryParams } from '@/modules/ministry/interfaces/ministry-query-params.interface';

import { buildMinistrySearchTerm } from '@/modules/ministry/builders/buildMinistrySearchTerm';
import { buildMinistryQueryParams } from '@/modules/ministry/builders/buildMinistryQueryParam';

export interface UpdateMinistryOptions {
  id: string;
  formData: MinistryFormData;
}

export interface InactivateMinistryOptions {
  id: string;
  ministryInactivationCategory: string;
  ministryInactivationReason: string;
}

//* Create
export const createMinistry = async (formData: MinistryFormData): Promise<MinistryResponse> => {
  return apiRequest('post', '/ministries', formData);
};

//* Find simple ministries
export const getSimpleMinistries = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<MinistryResponse[]> => {
  return apiRequest<MinistryResponse[]>('get', '/ministries', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId,
    },
  });
};

//* Find all ministries
export const getAllMinistries = async (
  params: MinistryQueryParams
): Promise<MinistryResponse[]> => {
  const { limit, offset, order, all, churchId } = params;

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  return apiRequest<MinistryResponse[]>('get', '/ministries', { params: query });
};

//* Find by filters
export const getMinistriesByFilters = async (
  params: MinistryQueryParams
): Promise<MinistryResponse[]> => {
  const term = buildMinistrySearchTerm(params);
  const queryParams = buildMinistryQueryParams(params, term);

  return apiRequest<MinistryResponse[]>('get', '/ministries/search', { params: queryParams });
};

//* Update
export const updateMinistry = async ({
  id,
  formData,
}: UpdateMinistryOptions): Promise<MinistryResponse> => {
  return apiRequest('patch', `/ministries/${id}`, formData);
};

//* Delete
export const inactivateMinistry = async (params: InactivateMinistryOptions): Promise<void> => {
  const { id, ministryInactivationCategory, ministryInactivationReason } = params;

  return apiRequest('delete', `/ministries/${id}`, {
    params: { ministryInactivationCategory, ministryInactivationReason },
  });
};

//* Reports
export const getGeneralMinistriesReport = async (params: MinistryQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;

  const query = all ? { order } : { limit, offset, order };

  const pdf = await apiRequest<Blob>('get', '/reports/ministries', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getMinistriesReportByTerm = async (params: MinistryQueryParams): Promise<boolean> => {
  const term = buildMinistrySearchTerm(params);
  const queryParams = buildMinistryQueryParams(params, term);

  const pdf = await apiRequest<Blob>('get', '/reports/ministries/search', {
    params: queryParams,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
