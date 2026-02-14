/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';
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

  try {
    const { data } = await icupApi<OfferingIncomeProportionResponse>(`/metrics/${resolvedChurch}`, {
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

  try {
    const { data } = await icupApi<OfferingIncomeBySundayServiceResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeByFamilyGroupResponse[]>(
      `/metrics/${resolvedChurch}&${zone}&${month}&${year}`,
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

  try {
    const { data } = await icupApi<OfferingIncomeBySundaySchoolResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeByFastingAndVigilResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeByYouthServiceResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeBySpecialOfferingResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeByChurchGroundOfferingResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeByUnitedServiceResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeByActivitiesResponse[]>(
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

  try {
    const { data } = await icupApi<OfferingIncomeByIncomeAdjustmentResponse[]>(
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

//? OFFERING INCOME METRICS REPORTS
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

  try {
    const res = await icupApi<Blob>('/reports/offering-income-metrics', {
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
