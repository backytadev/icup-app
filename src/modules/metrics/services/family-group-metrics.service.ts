/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

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
  try {
    const { data } = await icupApi<FamilyGroupsProportionResponse>(`/metrics/${church}`, {
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
//* Get Fluctuation Members by year
export const getFluctuationFamilyGroupsByYear = async ({
  searchType,
  year,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsFluctuationResponse[]> => {
  try {
    const { data } = await icupApi<FamilyGroupsFluctuationResponse[]>(
      `/metrics/${church}&${year}`,
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

//* Get Family groups by zone
export const getFamilyGroupsByZone = async ({
  searchType,
  allFamilyGroups,
  zone,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByZoneResponse> => {
  try {
    const { data } = await icupApi<FamilyGroupsByZoneResponse>(`/metrics/${church}&${zone}`, {
      params: {
        searchType,
        allFamilyGroups: allFamilyGroups?.toString(),
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

//* Get Family groups by copastor and zone
export const getFamilyGroupsByCopastorAndZone = async ({
  searchType,
  allZones,
  copastor,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByCopastorAndZoneResponse> => {
  try {
    const { data } = await icupApi<FamilyGroupsByCopastorAndZoneResponse>(
      `/metrics/${church}&${copastor}`,
      {
        params: {
          searchType,
          allZones: allZones?.toString(),
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

//* Get Family groups by district
export const getFamilyGroupsByDistrict = async ({
  searchType,
  district,
  church,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByCopastorAndZoneResponse> => {
  try {
    const { data } = await icupApi<FamilyGroupsByCopastorAndZoneResponse>(
      `/metrics/${church}&${district}`,
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

//* Get Family groups by service time
export const getFamilyGroupsByServiceTime = async ({
  searchType,
  zone,
  church,
  allZones,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByServiceTimeResponse> => {
  try {
    const { data } = await icupApi<FamilyGroupsByServiceTimeResponse>(
      `/metrics/${church}&${zone}`,
      {
        params: {
          searchType,
          allZones: allZones?.toString(),
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

//* Get Family groups by record status
export const getFamilyGroupsByRecordStatus = async ({
  searchType,
  zone,
  church,
  allZones,
  order,
}: MetricsQueryParams): Promise<FamilyGroupsByRecordStatusResponse> => {
  try {
    const { data } = await icupApi<FamilyGroupsByRecordStatusResponse>(
      `/metrics/${church}&${zone}`,
      {
        params: {
          searchType,
          allZones: allZones?.toString(),
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

//? FAMILY GROUP METRICS REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

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
  const joinedReportTypes = types.join('+');

  try {
    const res = await icupApi<Blob>('/reports/family-group-metrics', {
      params: {
        churchId,
        year,
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
