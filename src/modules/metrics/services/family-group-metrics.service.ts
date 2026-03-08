import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type MetricsQueryParams } from '@/modules/metrics/interfaces/shared/metrics-query-params.interface';

import { type FamilyGroupsByZoneResponse } from '@/modules/metrics/interfaces/family-group-metrics/family-groups-by-zone-response.interface';
import { type FamilyGroupsByCopastorAndZoneResponse } from '@/modules/metrics/interfaces/family-group-metrics/family-groups-by-copastor-and-zone-response.interface';
import { type FamilyGroupsProportionResponse } from '@/modules/metrics/interfaces/family-group-metrics/family-groups-proportion-response.interface';
import { type FamilyGroupsFluctuationResponse } from '@/modules/metrics/interfaces/family-group-metrics/family-groups-fluctuation-response.interface';
import { type FamilyGroupsByServiceTimeResponse } from '@/modules/metrics/interfaces/family-group-metrics/family-groups-by-service-time-response.interface';
import { type FamilyGroupsByRecordStatusResponse } from '@/modules/metrics/interfaces/family-group-metrics/family-groups-by-record-status-response.interface';

//? GET PROPORTION BY FAMILY GROUP
export const getFamilyGroupsProportion = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsProportionResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<FamilyGroupsProportionResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//? SEARCH BY TERM
//* Get fluctuation family groups by year
export const getFluctuationFamilyGroupsByYear = async ({
  searchType,
  year,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsFluctuationResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<FamilyGroupsFluctuationResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${year}`,
    { params: { searchType, order } }
  );
};

//* Get family groups by zone
export const getFamilyGroupsByZone = async ({
  searchType,
  allFamilyGroups,
  zone,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByZoneResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<FamilyGroupsByZoneResponse>('get', `/metrics/${resolvedChurch}&${zone}`, {
    params: { searchType, allFamilyGroups: allFamilyGroups?.toString(), order },
  });
};

//* Get family groups by copastor and zone
export const getFamilyGroupsByCopastorAndZone = async ({
  searchType,
  allZones,
  copastor,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByCopastorAndZoneResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<FamilyGroupsByCopastorAndZoneResponse>(
    'get',
    `/metrics/${resolvedChurch}&${copastor}`,
    { params: { searchType, allZones: allZones?.toString(), order } }
  );
};

//* Get family groups by district
export const getFamilyGroupsByDistrict = async ({
  searchType,
  district,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByCopastorAndZoneResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<FamilyGroupsByCopastorAndZoneResponse>(
    'get',
    `/metrics/${resolvedChurch}&${district}`,
    { params: { searchType, order } }
  );
};

//* Get family groups by service time
export const getFamilyGroupsByServiceTime = async ({
  searchType,
  zone,
  church,
  allZones,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByServiceTimeResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<FamilyGroupsByServiceTimeResponse>(
    'get',
    `/metrics/${resolvedChurch}&${zone}`,
    { params: { searchType, allZones: allZones?.toString(), order } }
  );
};

//* Get family groups by record status
export const getFamilyGroupsByRecordStatus = async ({
  searchType,
  zone,
  church,
  allZones,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByRecordStatusResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<FamilyGroupsByRecordStatusResponse>(
    'get',
    `/metrics/${resolvedChurch}&${zone}`,
    { params: { searchType, allZones: allZones?.toString(), order } }
  );
};

//? FAMILY GROUP METRICS REPORTS
interface MetricReportQueryParams {
  year: string;
  churchId: string;
  types: string[];
  dialogClose: () => void;
}

export const getFamilyGroupMetricsReport = async ({
  year,
  churchId,
  types,
  dialogClose,
}: MetricReportQueryParams): Promise<boolean> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;
  const joinedReportTypes = types.join('+');

  const blob = await apiRequest<Blob>('get', '/reports/family-group-metrics', {
    params: { churchId: resolvedChurchId, year, types: joinedReportTypes },
    headers: { 'Content-Type': 'application/pdf' },
    responseType: 'blob',
  });

  setTimeout(() => {
    dialogClose();
  }, 100);
  setTimeout(() => {
    openPdfInNewTab(blob);
  }, 300);

  return true;
};
