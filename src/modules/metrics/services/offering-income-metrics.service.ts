import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type MetricsQueryParams } from '@/modules/metrics/interfaces/shared/metrics-query-params.interface';

import { type OfferingIncomeProportionResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-proportion-response.interface';
import { type OfferingIncomeByActivitiesResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-activities-response.interface';
import { type OfferingIncomeByFamilyGroupResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-family-group-response.interface';
import { type OfferingIncomeByYouthServiceResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-youth-service-response.interface';
import { type OfferingIncomeBySundaySchoolResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-sunday-school-response.interface';
import { type OfferingIncomeByUnitedServiceResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-united-service-response.interface';
import { type OfferingIncomeBySundayServiceResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-sunday-service-response.interface';
import { type OfferingIncomeBySpecialOfferingResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-special-offering-response.interface';
import { type OfferingIncomeByFastingAndVigilResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-fasting-and-vigil-response.interface';
import { type OfferingIncomeByIncomeAdjustmentResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-income-adjustment-response.interface';
import { type OfferingIncomeByChurchGroundOfferingResponse } from '@/modules/metrics/interfaces/offering-income-metrics/offering-income-by-church-ground-offering-response.interface';

//? GET PROPORTION OFFERING INCOME
export const getOfferingIncomeProportion = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeProportionResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeProportionResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//? SEARCH BY TERM
//* Offering income by sunday service
export const getOfferingIncomeBySundayService = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeBySundayServiceResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeBySundayServiceResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by family group
export const getOfferingIncomeByFamilyGroup = async ({
  searchType,
  zone,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeByFamilyGroupResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeByFamilyGroupResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${zone}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by sunday school
export const getOfferingIncomeBySundaySchool = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeBySundaySchoolResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeBySundaySchoolResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by fasting and vigil
export const getOfferingIncomeByFastingAndVigil = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeByFastingAndVigilResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeByFastingAndVigilResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by youth service
export const getOfferingIncomeByYouthService = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeByYouthServiceResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeByYouthServiceResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by special offering
export const getOfferingIncomeBySpecialOffering = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeBySpecialOfferingResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeBySpecialOfferingResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by church ground
export const getOfferingIncomeByChurchGround = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeByChurchGroundOfferingResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeByChurchGroundOfferingResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by united service
export const getOfferingIncomeByUnitedService = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeByUnitedServiceResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeByUnitedServiceResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income by activities
export const getOfferingIncomeByActivities = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeByActivitiesResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeByActivitiesResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering income adjustment
export const getOfferingIncomeAdjustment = async ({
  searchType,
  church,
  month,
  isSingleMonth,
  year,
  order,
}: MetricsQueryParams): Promise<OfferingIncomeByIncomeAdjustmentResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingIncomeByIncomeAdjustmentResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//? OFFERING INCOME METRICS REPORTS
interface MetricReportQueryParams {
  year: string;
  startMonth: string;
  endMonth: string;
  churchId: string;
  types: string[];
  dialogClose: () => void;
}

export const getOfferingIncomeMetricsReport = async ({
  year,
  churchId,
  startMonth,
  endMonth,
  types,
  dialogClose,
}: MetricReportQueryParams): Promise<boolean> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;
  const joinedReportTypes = types.join('+');

  const blob = await apiRequest<Blob>('get', '/reports/offering-income-metrics', {
    params: { churchId: resolvedChurchId, year, startMonth, endMonth, types: joinedReportTypes },
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
