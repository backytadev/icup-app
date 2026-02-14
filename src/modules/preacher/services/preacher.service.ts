import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type PreacherQueryParams } from '@/modules/preacher/interfaces/preacher-query-params.interface';
import { buildPreacherSearchTerm } from '@/modules/preacher/builders/buildPreacherSearchTerm';
import { buildPreacherQueryParams } from '@/modules/preacher/builders/buildPreacherQueryParam';

export interface UpdatePreacherOptions {
  id: string;
  formData: PreacherFormData;
}

export interface InactivatePreacherOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

export interface AvailablePreachersOptions {
  searchType: string;
  zoneId: string;
  isNullFamilyGroup: boolean;
}

//* Create
export const createPreacher = async (formData: PreacherFormData): Promise<PreacherResponse> => {
  return apiRequest('post', '/preachers', formData);
};

//* Find simple
export const getSimplePreachers = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<PreacherResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<PreacherResponse[]>('get', '/preachers', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all
export const getPreachers = async (params: PreacherQueryParams): Promise<PreacherResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<PreacherResponse[]>('get', '/preachers', { params: query });
};

//* Find by filters
export const getPreachersByFilters = async (
  params: PreacherQueryParams
): Promise<PreacherResponse[]> => {
  const term = buildPreacherSearchTerm(params);
  const queryParams = buildPreacherQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<PreacherResponse[]>('get', '/preachers/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updatePreacher = async ({
  id,
  formData,
}: UpdatePreacherOptions): Promise<PreacherResponse> => {
  return apiRequest('patch', `/preachers/${id}`, formData);
};

//* Delete
export const inactivatePreacher = async (params: InactivatePreacherOptions): Promise<void> => {
  const { id, memberInactivationReason, memberInactivationCategory } = params;

  return apiRequest('delete', `/preachers/${id}`, {
    params: { memberInactivationReason, memberInactivationCategory },
  });
};

//* Reports
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* Reports
export const getGeneralPreachersReport = async (params: PreacherQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/preachers', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getPreachersReportByTerm = async (params: PreacherQueryParams): Promise<boolean> => {
  const term = buildPreacherSearchTerm(params);
  const queryParams = buildPreacherQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/preachers/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
