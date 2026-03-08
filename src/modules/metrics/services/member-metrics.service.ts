import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type MetricsQueryParams } from '@/modules/metrics/interfaces/shared/metrics-query-params.interface';

import { type MembersProportionResponse } from '@/modules/metrics/interfaces/member-metrics/members-proportion-response.interface';
import { type MembersByCategoryResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-category-response.interface';
import { type MembersFluctuationResponse } from '@/modules/metrics/interfaces/member-metrics/members-fluctuation-response.interface';
import { type MembersByBirthMonthResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-birth-month-response.interface';
import { type MembersByRecordStatusResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-record-status-response.interface';
import { type MembersByMaritalStatusResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-marital-status-response.interface';
import { type MembersByZoneAndGenderResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-zone-and-gender-response.interface';
import { type MembersByRoleAndGenderResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-role-and-gender-response.interface';
import { type MembersByDistrictAndGenderResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-district-and-gender-response.interface';
import { type MembersByCategoryAndGenderResponse } from '@/modules/metrics/interfaces/member-metrics/members-by-category-and-gender-response.interface';

//? GET PROPORTION MEMBERS
export const getMembersProportion = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersProportionResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersProportionResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//? SEARCH BY TERM
//* Get Fluctuation Members by year
export const getFluctuationMembersByYear = async ({
  searchType,
  year,
  order,
  church,
}: MetricsQueryParams): Promise<MembersFluctuationResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersFluctuationResponse[]>('get', `/metrics/${resolvedChurch}&${year}`, {
    params: { searchType, order },
  });
};

//* Get members by birth month
export const getMembersByBirthMonth = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByBirthMonthResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByBirthMonthResponse[]>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//* Get members by category
export const getMembersByCategory = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByCategoryResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByCategoryResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//* Get members by category and gender
export const getMembersByCategoryAndGender = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByCategoryAndGenderResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByCategoryAndGenderResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//* Get members by role
export const getMembersByRole = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByRoleAndGenderResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByRoleAndGenderResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//* Get members by marital status
export const getMembersByMaritalStatus = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByMaritalStatusResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByMaritalStatusResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//* Get disciples by zone and gender
export const getDisciplesByZoneAndGender = async ({
  searchType,
  church,
  copastor,
  allZones,
  order,
}: MetricsQueryParams): Promise<MembersByZoneAndGenderResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByZoneAndGenderResponse>(
    'get',
    `/metrics/${resolvedChurch}&${copastor}`,
    { params: { searchType, allZones: allZones?.toString(), order } }
  );
};

//* Get preachers by zone and gender
export const getPreachersByZoneAndGender = async ({
  searchType,
  church,
  copastor,
  allZones,
  order,
}: MetricsQueryParams): Promise<MembersByZoneAndGenderResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByZoneAndGenderResponse>(
    'get',
    `/metrics/${resolvedChurch}&${copastor}`,
    { params: { searchType, allZones: allZones?.toString(), order } }
  );
};

//* Get members by district and gender
export const getMembersByDistrictAndGender = async ({
  searchType,
  church,
  district,
  order,
}: MetricsQueryParams): Promise<MembersByDistrictAndGenderResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByDistrictAndGenderResponse>(
    'get',
    `/metrics/${resolvedChurch}&${district}`,
    { params: { searchType, order } }
  );
};

//* Get members by record status
export const getMembersByRecordStatus = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByRecordStatusResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<MembersByRecordStatusResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//? MEMBER METRICS REPORTS
interface MetricReportQueryParams {
  year: string;
  churchId: string;
  types: string[];
  dialogClose: () => void;
}

export const getMemberMetricsReport = async ({
  year,
  churchId,
  types,
  dialogClose,
}: MetricReportQueryParams): Promise<boolean> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;
  const joinedReportTypes = types.join('+');

  const blob = await apiRequest<Blob>('get', '/reports/member-metrics', {
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
