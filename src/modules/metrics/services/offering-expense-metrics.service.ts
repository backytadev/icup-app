/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';
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

  try {
    const { data } = await icupApi<OfferingExpensesProportionResponse>(`/metrics/${resolvedChurch}`, {
      params: {
        searchType,
        order,
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

  try {
    const { data } = await icupApi<OfferingExpenseChartResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

  try {
    const { data } = await icupApi<OfferingExpenseChartResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

//* Decoration and repair offering expenses
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

  try {
    const { data } = await icupApi<OfferingExpenseChartResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

//* Equipment and technology and repair offering expenses
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

  try {
    const { data } = await icupApi<OfferingExpenseChartResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

  try {
    const { data } = await icupApi<OfferingExpenseChartResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

  try {
    const { data } = await icupApi<OfferingExpenseChartResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

  try {
    const { data } = await icupApi<OfferingExpenseChartResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

  try {
    const { data } = await icupApi<OfferingExpensesAdjustmentResponse[]>(
      `/metrics/${resolvedChurch}&${month}&${year}`,
      {
        params: {
          searchType,
          isSingleMonth: isSingleMonth?.toString(),
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

//? OFFERING EXPENSE METRICS REPORTS
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

  try {
    const res = await icupApi<Blob>('/reports/offering-expense-metrics', {
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
