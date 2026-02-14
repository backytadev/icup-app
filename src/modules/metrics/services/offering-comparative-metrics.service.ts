/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type MetricsQueryParams } from '@/modules/metrics/interfaces/shared/metrics-query-params.interface';

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
}: MetricsQueryParams): Promise<OfferingExpensesAndOfferingIncomeComparativeProportionResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  try {
    const { data } = await icupApi<OfferingExpensesAndOfferingIncomeComparativeProportionResponse>(
      `/metrics/${resolvedChurch}`,
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
}: MetricsQueryParams): Promise<IncomeAndExpensesComparativeResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  try {
    const { data } = await icupApi<IncomeAndExpensesComparativeResponse[]>(
      `/metrics/${resolvedChurch}&${currency}&${year}`,
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
}: MetricsQueryParams): Promise<GeneralComparativeOfferingIncomeResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  try {
    const { data } = await icupApi<GeneralComparativeOfferingIncomeResponse[]>(
      `/metrics/${resolvedChurch}&${startMonth}&${endMonth}&${year}`,
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
}: MetricsQueryParams): Promise<ComparativeOfferingIncomeByTypeResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  try {
    const { data } = await icupApi<ComparativeOfferingIncomeByTypeResponse[]>(
      `/metrics/${resolvedChurch}&${metricType}&${year}`,
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
}: MetricsQueryParams): Promise<GeneralComparativeOfferingExpensesResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  try {
    const { data } = await icupApi<GeneralComparativeOfferingExpensesResponse[]>(
      `/metrics/${resolvedChurch}&${startMonth}&${endMonth}&${year}`,
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
}: MetricsQueryParams): Promise<ComparativeOfferingExpensesByTypeResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  try {
    const { data } = await icupApi<ComparativeOfferingExpensesByTypeResponse[]>(
      `/metrics/${resolvedChurch}&${type}&${year}`,
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
}: MetricsQueryParams): Promise<ComparativeOfferingExpensesBySubTypeResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurch = church || contextChurchId;

  try {
    const { data } = await icupApi<ComparativeOfferingExpensesBySubTypeResponse[]>(
      `/metrics/${resolvedChurch}&${metricType}&${startMonth}&${endMonth}&${year}`,
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
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;
  const joinedReportTypes = types.join('+');

  try {
    const res = await icupApi<Blob>('/reports/financial-balance-comparative-metrics', {
      params: {
        churchId: resolvedChurchId,
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

export const getFinancialBalanceSummary = async ({
  year,
  churchId,
  startMonth,
  endMonth,
  currency,
}: FinancialBalanceSummaryQueryParams): Promise<ComparativeFinancialBalanceSummaryResponse> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;

  try {
    const { data } = await icupApi<ComparativeFinancialBalanceSummaryResponse>(
      '/metrics/balance/summary/general',
      {
        params: {
          churchId: resolvedChurchId,
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

//* Income details by month
interface IncomeDetailByTypeQueryParams {
  year: string;
  startMonth: string;
  endMonth: string;
  churchId: string;
  type: string;
}

export const getIncomeDetailByType = async ({
  year,
  churchId,
  startMonth,
  endMonth,
  type,
}: IncomeDetailByTypeQueryParams): Promise<any> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;

  try {
    const { data } = await icupApi<any>('/metrics/balance/income/monthly-detail-by-type', {
      params: {
        churchId: resolvedChurchId,
        year,
        startMonth,
        endMonth,
        type,
      },
    });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//* Expense details by month
interface ExpenseDetailByTypeQueryParams {
  year: string;
  startMonth: string;
  endMonth: string;
  churchId: string;
  type: string;
}

export const getExpenseDetailByType = async ({
  year,
  churchId,
  startMonth,
  endMonth,
  type,
}: ExpenseDetailByTypeQueryParams): Promise<any> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;

  try {
    const { data } = await icupApi<any>('/metrics/balance/expenses/monthly-detail-by-type', {
      params: {
        churchId: resolvedChurchId,
        year,
        startMonth,
        endMonth,
        type,
      },
    });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

export const getExpenseDetailBySubType = async ({
  year,
  churchId,
  startMonth,
  endMonth,
  type,
}: ExpenseDetailByTypeQueryParams): Promise<any> => {
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId || contextChurchId;

  try {
    const { data } = await icupApi<any>('/metrics/balance/expenses/monthly-detail-by-sub-type', {
      params: {
        churchId: resolvedChurchId,
        year,
        startMonth,
        endMonth,
        type,
      },
    });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};
