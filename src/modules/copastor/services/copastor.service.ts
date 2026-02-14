import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { buildCopastorSearchTerm } from '@/modules/copastor/builders/buildCopastorSearchTerm';
import { buildCopastorQueryParams } from '@/modules/copastor/builders/buildCopastorQueryParam';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';
import { type CopastorQueryParams } from '@/modules/copastor/interfaces/copastor-query-params.interface';

export interface UpdateCopastorOptions {
  id: string;
  formData: CopastorFormData;
}

export interface InactivateCopastorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

//* Create
export const createCopastor = async (formData: CopastorFormData): Promise<CopastorResponse> => {
  return apiRequest('post', '/copastors', formData);
};

//* Find simple
export const getSimpleCopastors = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<CopastorResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<CopastorResponse[]>('get', '/copastors', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all
export const getCopastors = async (params: CopastorQueryParams): Promise<CopastorResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<CopastorResponse[]>('get', '/copastors', { params: query });
};

//* Find by filters
export const getCopastorsByFilters = async (
  params: CopastorQueryParams
): Promise<CopastorResponse[]> => {
  const term = buildCopastorSearchTerm(params);
  const queryParams = buildCopastorQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<CopastorResponse[]>('get', '/copastors/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateCopastor = async ({
  id,
  formData,
}: UpdateCopastorOptions): Promise<CopastorResponse> => {
  return apiRequest('patch', `/copastors/${id}`, formData);
};

//* Delete
export const inactivateCopastor = async (params: InactivateCopastorOptions): Promise<void> => {
  const { id, memberInactivationReason, memberInactivationCategory } = params;

  return apiRequest('delete', `/copastors/${id}`, {
    params: { memberInactivationReason, memberInactivationCategory },
  });
};

//* Reports
export const getGeneralCopastorsReport = async (params: CopastorQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/copastors', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getCopastorsReportByTerm = async (params: CopastorQueryParams): Promise<boolean> => {
  const term = buildCopastorSearchTerm(params);
  const queryParams = buildCopastorQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/copastors/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
