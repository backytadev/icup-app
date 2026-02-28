import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { ZoneSearchType } from '@/modules/zone/enums/zone-search-type.enum';
import { type ZoneFormData } from '@/modules/zone/types/zone-form-data.interface';
import { type ZoneResponse } from '@/modules/zone/types/zone-response.interface';
import { type ZoneQueryParams } from '@/modules/zone/types/zone-query-params.interface';
import { type ZoneSupervisorUpdateFormData } from '@/modules/zone/types/zone-supervisor-update-form-data.interface';

export interface UpdateZoneOptions {
  id: string;
  formData: ZoneFormData | ZoneSupervisorUpdateFormData;
}

export interface InactivateZoneOptions {
  id: string;
  zoneInactivationCategory: string;
  zoneInactivationReason: string;
}

//* Private helpers (internalized from builders/)
const buildZoneSearchTerm = (params: ZoneQueryParams): string | undefined => {
  const { searchType, inputTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<ZoneSearchType, string | undefined> = {
    [ZoneSearchType.ZoneName]: inputTerm,
    [ZoneSearchType.Country]: inputTerm,
    [ZoneSearchType.Department]: inputTerm,
    [ZoneSearchType.Province]: inputTerm,
    [ZoneSearchType.District]: inputTerm,
    [ZoneSearchType.RecordStatus]: selectTerm,
    [ZoneSearchType.FirstNames]: firstNamesTerm,
    [ZoneSearchType.LastNames]: lastNamesTerm,
    [ZoneSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as ZoneSearchType];
};

const buildZoneQueryParams = (params: ZoneQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, searchSubType, churchId } = params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (searchSubType) base.searchSubType = searchSubType;
  if (churchId) base.churchId = churchId;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};

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
  const { churchId: contextChurchId } = getContextParams();

  return apiRequest<ZoneResponse[]>('get', '/zones/search', {
    params: { ...queryParams, churchId: params.churchId ?? contextChurchId },
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
  const { churchId: contextChurchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/zones/search', {
    params: { ...queryParams, churchId: params.churchId ?? contextChurchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
