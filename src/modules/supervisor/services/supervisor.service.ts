import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { buildSupervisorSearchTerm } from '@/modules/supervisor/builders/buildSupervisorSearchTerm';
import { buildSupervisorQueryParams } from '@/modules/supervisor/builders/buildSupervisorQueryParam';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';
import { type SupervisorQueryParams } from '@/modules/supervisor/interfaces/supervisor-query-params.interface';

export interface UpdateSupervisorOptions {
  id: string;
  formData: SupervisorFormData;
}

export interface InactivateSupervisorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

export interface SimpleSupervisorsOptions {
  churchId?: string;
  isSimpleQuery: boolean;
}

export interface AvailableSupervisorsOptions {
  searchType: string;
  copastorId: string;
  withNullZone: boolean;
}

//* Create
export const createSupervisor = async (
  formData: SupervisorFormData
): Promise<SupervisorResponse> => {
  return apiRequest('post', '/supervisors', formData);
};

//* Find simple
export const getSimpleSupervisors = async ({
  churchId,
  // withNullZone,
  isSimpleQuery,
}: SimpleSupervisorsOptions): Promise<SupervisorResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<SupervisorResponse[]>('get', '/supervisors', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      // withNullZone: withNullZone.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all
export const getSupervisors = async (
  params: SupervisorQueryParams
): Promise<SupervisorResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<SupervisorResponse[]>('get', '/supervisors', { params: query });
};

//* Find by filters
export const getSupervisorsByFilters = async (
  params: SupervisorQueryParams
): Promise<SupervisorResponse[]> => {
  const term = buildSupervisorSearchTerm(params);
  const queryParams = buildSupervisorQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<SupervisorResponse[]>('get', '/supervisors/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateSupervisor = async ({
  id,
  formData,
}: UpdateSupervisorOptions): Promise<SupervisorResponse> => {
  return apiRequest('patch', `/supervisors/${id}`, formData);
};

//* Delete
export const inactivateSupervisor = async (params: InactivateSupervisorOptions): Promise<void> => {
  const { id, memberInactivationReason, memberInactivationCategory } = params;

  return apiRequest('delete', `/supervisors/${id}`, {
    params: { memberInactivationReason, memberInactivationCategory },
  });
};

//* Reports
export const getGeneralSupervisorsReport = async (
  params: SupervisorQueryParams
): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/supervisors', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getSupervisorsReportByTerm = async (
  params: SupervisorQueryParams
): Promise<boolean> => {
  const term = buildSupervisorSearchTerm(params);
  const queryParams = buildSupervisorQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/supervisors/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
