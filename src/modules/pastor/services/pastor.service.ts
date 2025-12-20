import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';

import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';
import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type PastorQueryParams } from '@/modules/pastor/interfaces/pastor-query-params.interface';

import { buildPastorSearchTerm } from '@/modules/pastor/builders/buildPastorSearchTerm';
import { buildPastorQueryParams } from '@/modules/pastor/builders/buildPastorQueryParam';

export interface UpdatePastorOptions {
  id: string;
  formData: PastorFormData;
}

export interface InactivatePastorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

//* Create
export const createPastor = async (formData: PastorFormData): Promise<PastorResponse> => {
  return apiRequest('post', '/pastors', formData);
};

//* Find simple pastors
export const getSimplePastors = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<PastorResponse[]> => {
  return apiRequest<PastorResponse[]>('get', '/pastors', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId,
    },
  });
};

//* Find all pastors
export const getAllPastors = async (params: PastorQueryParams): Promise<PastorResponse[]> => {
  const { limit, offset, order, all, churchId } = params;

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  return apiRequest<PastorResponse[]>('get', '/pastors', { params: query });
};

//* Find by filters
export const getPastorsByFilters = async (params: PastorQueryParams): Promise<PastorResponse[]> => {
  const term = buildPastorSearchTerm(params);
  const queryParams = buildPastorQueryParams(params, term);

  return apiRequest<PastorResponse[]>('get', '/pastors/search', { params: queryParams });
};

//* Update
export const updatePastor = async ({
  id,
  formData,
}: UpdatePastorOptions): Promise<PastorResponse> => {
  return apiRequest('patch', `/pastors/${id}`, formData);
};

//* Delete
export const inactivatePastor = async (params: InactivatePastorOptions): Promise<void> => {
  const { id, memberInactivationReason, memberInactivationCategory } = params;

  return apiRequest('delete', `/pastors/${id}`, {
    params: { memberInactivationCategory, memberInactivationReason },
  });
};

//* Reports
export const getGeneralPastorsReport = async (params: PastorQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;

  const query = all ? { order } : { limit, offset, order };

  const pdf = await apiRequest<Blob>('get', '/reports/pastors', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getPastorsReportByFilters = async (params: PastorQueryParams): Promise<boolean> => {
  const term = buildPastorSearchTerm(params);
  const queryParams = buildPastorQueryParams(params, term);

  const pdf = await apiRequest<Blob>('get', '/reports/pastors/search', {
    params: queryParams,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
