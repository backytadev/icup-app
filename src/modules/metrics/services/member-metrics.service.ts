/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

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
  try {
    const { data } = await icupApi<MembersProportionResponse>(`/metrics/${church}`, {
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
export const getFluctuationMembersByYear = async ({
  searchType,
  year,
  order,
  church,
}: MetricsQueryParams): Promise<MembersFluctuationResponse[]> => {
  try {
    const { data } = await icupApi<MembersFluctuationResponse[]>(`/metrics/${church}&${year}`, {
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

//* Get members by birth month
export const getMembersByBirthMonth = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByBirthMonthResponse[]> => {
  try {
    const { data } = await icupApi<MembersByBirthMonthResponse[]>(`/metrics/${church}`, {
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

//* Get members by category
export const getMembersByCategory = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByCategoryResponse> => {
  try {
    const { data } = await icupApi<MembersByCategoryResponse>(`/metrics/${church}`, {
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

//* Get members by category and gender
export const getMembersByCategoryAndGender = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByCategoryAndGenderResponse> => {
  try {
    const { data } = await icupApi<MembersByCategoryAndGenderResponse>(`/metrics/${church}`, {
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

//* Get members by role
export const getMembersByRole = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByRoleAndGenderResponse> => {
  try {
    const { data } = await icupApi<MembersByRoleAndGenderResponse>(`/metrics/${church}`, {
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

//* Get members by marital status
export const getMembersByMaritalStatus = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByMaritalStatusResponse> => {
  try {
    const { data } = await icupApi<MembersByMaritalStatusResponse>(`/metrics/${church}`, {
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

//* Get disciples by zone and gender
export const getDisciplesByZoneAndGender = async ({
  searchType,
  church,
  copastor,
  allZones,
  order,
}: MetricsQueryParams): Promise<MembersByZoneAndGenderResponse> => {
  try {
    const { data } = await icupApi<MembersByZoneAndGenderResponse>(
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

//* Get preacher by zone and gender
export const getPreachersByZoneAndGender = async ({
  searchType,
  church,
  copastor,
  allZones,
  order,
}: MetricsQueryParams): Promise<MembersByZoneAndGenderResponse> => {
  try {
    const { data } = await icupApi<MembersByZoneAndGenderResponse>(
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

//* Get members by district and gender
export const getMembersByDistrictAndGender = async ({
  searchType,
  church,
  district,
  order,
}: MetricsQueryParams): Promise<MembersByDistrictAndGenderResponse> => {
  try {
    const { data } = await icupApi<MembersByDistrictAndGenderResponse>(
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

//* Get Members by record status
export const getMembersByRecordStatus = async ({
  searchType,
  church,
  order,
}: MetricsQueryParams): Promise<MembersByRecordStatusResponse> => {
  try {
    const { data } = await icupApi<MembersByRecordStatusResponse>(`/metrics/${church}`, {
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

//? MEMBER METRICS REPORTS
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

export const getMemberMetricsReport = async ({
  year,
  churchId,
  types,
  dialogClose,
}: MetricReportQueryParams): Promise<boolean> => {
  const joinedReportTypes = types.join('+');

  try {
    const res = await icupApi<Blob>('/reports/member-metrics', {
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
