import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type MetricsQueryParams } from '@/modules/metrics/interfaces/shared/metrics-query-params.interface';

import { type OfferingExpenseChartResponse } from '@/modules/metrics/interfaces/offering-expense-metrics/offering-expense-chart-response.interface';
import { type OfferingExpensesProportionResponse } from '@/modules/metrics/interfaces/offering-expense-metrics/offering-expense-proportion-response.interface';
import { type OfferingExpensesAdjustmentResponse } from '@/modules/metrics/interfaces/offering-expense-metrics/offering-expenses-adjustment-response.interface';

//? GET PROPORTION OFFERING EXPENSES
export const getOfferingExpensesProportion = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<OfferingExpensesProportionResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpensesProportionResponse>('get', `/metrics/${resolvedChurch}`, {
    params: { searchType, order },
  });
};

//? SEARCH BY TERM
//* Operational offering expenses
export const getOperationalOfferingExpenses = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpenseChartResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpenseChartResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Maintenance and repair offering expenses
export const getMaintenanceAndRepairOfferingExpenses = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpenseChartResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpenseChartResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Decoration offering expenses
export const getDecorationOfferingExpenses = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpenseChartResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpenseChartResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Equipment and technology offering expenses
export const getEquipmentAndTechnologyOfferingExpenses = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpenseChartResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpenseChartResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Supplies offering expenses
export const getSuppliesOfferingExpenses = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpenseChartResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpenseChartResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Planing events offering expenses
export const getPlaningEventsOfferingExpenses = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpenseChartResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpenseChartResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Others offering expenses
export const getOthersOfferingExpenses = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpenseChartResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpenseChartResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//* Offering expenses adjustment
export const getOfferingExpensesAdjustment = async ({
  searchType,
  church,
  month,
  year,
  isSingleMonth,
  order,
}: MetricsQueryParams): Promise<OfferingExpensesAdjustmentResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  return apiRequest<OfferingExpensesAdjustmentResponse[]>(
    'get',
    `/metrics/${resolvedChurch}&${month}&${year}`,
    { params: { searchType, isSingleMonth: isSingleMonth?.toString(), order } }
  );
};

//? OFFERING EXPENSE METRICS REPORTS
interface MetricReportQueryParams {
  year: string;
  startMonth: string;
  endMonth: string;
  churchId: string;
  types: string[];
  dialogClose: () => void;
}

export const getOfferingExpenseMetricsReport = async ({
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

  const blob = await apiRequest<Blob>('get', '/reports/offering-expense-metrics', {
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
