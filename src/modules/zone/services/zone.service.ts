import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { buildZoneQueryParams } from '@/modules/zone/builders/buildZoneQueryParam';
import { buildZoneSearchTerm } from '@/modules/zone/builders/buildZoneSearchTerm';
import { type ZoneFormData } from '@/modules/zone/interfaces/zone-form-data.interface';
import { type ZoneResponse } from '@/modules/zone/interfaces/zone-response.interface';
import { type ZoneQueryParams } from '@/modules/zone/interfaces/zone-query-params.interface';
import { type ZoneSupervisorUpdateFormData } from '@/modules/zone/interfaces/zone-supervisor-update-form-data.interface';

export interface UpdateZoneOptions {
  id: string;
  formData: ZoneFormData | ZoneSupervisorUpdateFormData;
}

export interface InactivateZoneOptions {
  id: string;
  zoneInactivationCategory: string;
  zoneInactivationReason: string;
}

//* Create
export const createZone = async (formData: ZoneFormData): Promise<ZoneResponse> => {
  return apiRequest('post', '/zones', formData);
};

//* Find simple
export const getSimpleZones = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<ZoneResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<ZoneResponse[]>('get', '/zones', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all
export const getZones = async (params: ZoneQueryParams): Promise<ZoneResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<ZoneResponse[]>('get', '/zones', { params: query });
};

//* Find by filters
export const getZonesByFilters = async (params: ZoneQueryParams): Promise<ZoneResponse[]> => {
  const term = buildZoneSearchTerm(params);
  const queryParams = buildZoneQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<ZoneResponse[]>('get', '/zones/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateZone = async ({ id, formData }: UpdateZoneOptions): Promise<ZoneResponse> => {
  return apiRequest('patch', `/zones/${id}`, formData);
};

//* Delete
export const inactivateZone = async (params: InactivateZoneOptions): Promise<void> => {
  const { id, zoneInactivationCategory, zoneInactivationReason } = params;

  return apiRequest('delete', `/zones/${id}`, {
    params: { zoneInactivationCategory, zoneInactivationReason },
  });
};

//* Reports
export const getGeneralZonesReport = async (params: ZoneQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/zones', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getZonesReportByTerm = async (params: ZoneQueryParams): Promise<boolean> => {
  const term = buildZoneSearchTerm(params);
  const queryParams = buildZoneQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/zones/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
