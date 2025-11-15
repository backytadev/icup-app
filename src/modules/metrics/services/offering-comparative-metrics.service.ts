/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { type MetricQueryParams } from '@/modules/metrics/interfaces/shared/metric-query-params.interface';

import { type ComparativeFinancialBalanceSummaryResponse } from '@/modules/metrics/interfaces/screens-metrics/financial-balance-summary-response.interface';
import { type IncomeAndExpensesComparativeResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/income-and-expenses-comparative-response.interface';
import { type ComparativeOfferingIncomeByTypeResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/comparative-offering-income-by-type-response.interface';
import { type GeneralComparativeOfferingIncomeResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/general-comparative-offering-income-response.interface';
import { type ComparativeOfferingExpensesByTypeResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/comparative-offering-expenses-by-type-response.interface';
import { type GeneralComparativeOfferingExpensesResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/general-comparative-offering-expenses-response.interface';
import { type ComparativeOfferingExpensesBySubTypeResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/comparative-offering-expenses-by-sub-type-response.interface';
import { type OfferingExpensesAndOfferingIncomeComparativeProportionResponse } from '@/modules/metrics/interfaces/offering-comparative-metrics/offering-expenses-and-offering-income-proportion-response.interface';

//? GET PROPORTION OFFERING COMPARATIVE
export const getOfferingComparativeProportion = async ({
  searchType,
  church,
  order,
}: MetricQueryParams): Promise<OfferingExpensesAndOfferingIncomeComparativeProportionResponse> => {
  try {
    const { data } = await icupApi<OfferingExpensesAndOfferingIncomeComparativeProportionResponse>(
      `/metrics/${church}`,
      {
        params: {
          searchType,
          order,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//? SEARCH BY TERM
//* Income and Expenses comparative
export const getIncomeAndExpensesComparativeByYear = async ({
  searchType,
  church,
  currency,
  year,
  order,
}: MetricQueryParams): Promise<IncomeAndExpensesComparativeResponse[]> => {
  try {
    const { data } = await icupApi<IncomeAndExpensesComparativeResponse[]>(
      `/metrics/${church}&${currency}&${year}`,
      {
        params: {
          searchType,
          order,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//* General comparative offering Income
export const getGeneralComparativeOfferingIncome = async ({
  searchType,
  church,
  startMonth,
  endMonth,
  year,
  order,
}: MetricQueryParams): Promise<GeneralComparativeOfferingIncomeResponse[]> => {
  try {
    const { data } = await icupApi<GeneralComparativeOfferingIncomeResponse[]>(
      `/metrics/${church}&${startMonth}&${endMonth}&${year}`,
      {
        params: {
          searchType,
          order,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//* Comparative offering income by type
export const getComparativeOfferingIncomeByType = async ({
  searchType,
  church,
  metricType,
  year,
  order,
}: MetricQueryParams): Promise<ComparativeOfferingIncomeByTypeResponse[]> => {
  try {
    const { data } = await icupApi<ComparativeOfferingIncomeByTypeResponse[]>(
      `/metrics/${church}&${metricType}&${year}`,
      {
        params: {
          searchType,
          order,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//* General comparative offering expenses
export const getGeneralComparativeOfferingExpenses = async ({
  searchType,
  church,
  startMonth,
  endMonth,
  year,
  order,
}: MetricQueryParams): Promise<GeneralComparativeOfferingExpensesResponse[]> => {
  try {
    const { data } = await icupApi<GeneralComparativeOfferingExpensesResponse[]>(
      `/metrics/${church}&${startMonth}&${endMonth}&${year}`,
      {
        params: {
          searchType,
          order,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//* Comparative offering expenses by type
export const getComparativeOfferingExpensesByType = async ({
  searchType,
  church,
  metricType: type,
  year,
  order,
}: MetricQueryParams): Promise<ComparativeOfferingExpensesByTypeResponse[]> => {
  try {
    const { data } = await icupApi<ComparativeOfferingExpensesByTypeResponse[]>(
      `/metrics/${church}&${type}&${year}`,
      {
        params: {
          searchType,
          order,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//* Comparative offering expenses by sub-type
export const getComparativeOfferingExpensesBySubType = async ({
  searchType,
  metricType,
  church,
  startMonth,
  endMonth,
  year,
  order,
}: MetricQueryParams): Promise<ComparativeOfferingExpensesBySubTypeResponse[]> => {
  try {
    const { data } = await icupApi<ComparativeOfferingExpensesBySubTypeResponse[]>(
      `/metrics/${church}&${metricType}&${startMonth}&${endMonth}&${year}`,
      {
        params: {
          searchType,
          order,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//? FINANCIAL BALANCE COMPARATIVE METRICS REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

interface MetricReportQueryParams {
  year: string;
  startMonth: string;
  endMonth: string;
  churchId: string;
  types: string[];
  dialogClose: () => void;
}

export const getFinancialBalanceComparativeMetricsReport = async ({
  year,
  churchId,
  startMonth,
  endMonth,
  types,
  dialogClose,
}: MetricReportQueryParams): Promise<boolean> => {
  const joinedReportTypes = types.join('+');

  try {
    const res = await icupApi<Blob>('/reports/financial-balance-comparative-metrics', {
      params: {
        churchId,
        year,
        startMonth,
        endMonth,
        types: joinedReportTypes,
      },
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob',
    });

    setTimeout(() => {
      dialogClose();
    }, 100);

    setTimeout(() => {
      openPdfInNewTab(res.data);
    }, 300);

    return true;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//? VIEW SUMMARIES
//* Balance Summary
interface FinancialBalanceSummaryQueryParams {
  year: string;
  startMonth: string;
  endMonth: string;
  churchId: string;
  currency: string;
}

export const getFinancialBalanceSummaryReport = async ({
  year,
  churchId,
  startMonth,
  endMonth,
  currency,
}: FinancialBalanceSummaryQueryParams): Promise<ComparativeFinancialBalanceSummaryResponse> => {
  try {
    const { data } = await icupApi<ComparativeFinancialBalanceSummaryResponse>(
      '/metrics/view-balance-summary',
      {
        params: {
          churchId,
          year,
          startMonth,
          endMonth,
          currency,
        },
      }
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};
