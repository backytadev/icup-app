/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { ZoneSearchType } from '@/modules/zone/enums/zone-search-type.enum';

import { type ZoneFormData } from '@/modules/zone/interfaces/zone-form-data.interface';
import { type ZoneResponse } from '@/modules/zone/interfaces/zone-response.interface';
import { type ZoneQueryParams } from '@/modules/zone/interfaces/zone-query-params.interface';
import { type ZoneSupervisorUpdateFormData } from '@/modules/zone/interfaces/zone-supervisor-update-form-data.interface';

//? CREATE ZONE
export const createZone = async (formData: ZoneFormData): Promise<ZoneResponse> => {
  try {
    const { data } = await icupApi.post<ZoneResponse>('/zones', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET SIMPLE ZONES
export const getSimpleZones = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<ZoneResponse[]> => {
  try {
    const { data } = await icupApi<ZoneResponse[]>('/zones', {
      params: {
        order: RecordOrder.Ascending,
        isSimpleQuery: isSimpleQuery.toString(),
        churchId,
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

//? GET ZONES (paginated)
export const getZones = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: ZoneQueryParams): Promise<ZoneResponse[]> => {
  let result: ZoneResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<ZoneResponse[]>('/zones', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<ZoneResponse[]>('/zones', {
        params: {
          order,
          churchId,
        },
      });

      result = data;
    }

    return result;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//? GET ZONES BY TERM (paginated)
export const getZonesByTerm = async ({
  searchType,
  searchSubType,
  inputTerm,
  selectTerm,
  limit,
  offset,
  all,
  order,
  churchId,
  firstNamesTerm,
  lastNamesTerm,
}: ZoneQueryParams): Promise<ZoneResponse[] | undefined> => {
  let result: ZoneResponse[];

  //* Zone, country, department, province, district
  if (
    searchType === ZoneSearchType.ZoneName ||
    searchType === ZoneSearchType.Country ||
    searchType === ZoneSearchType.Department ||
    searchType === ZoneSearchType.Province ||
    searchType === ZoneSearchType.District
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${inputTerm}`, {
          params: {
            limit,
            offset,
            order,
            churchId,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${inputTerm}`, {
          params: {
            order,
            churchId,
            searchType,
          },
        });
        result = data;
      }

      return result;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }

  //* Record Status
  if (searchType === ZoneSearchType.RecordStatus) {
    try {
      if (!all) {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${selectTerm}`, {
          params: {
            limit,
            offset,
            order,
            churchId,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${selectTerm}`, {
          params: {
            order,
            churchId,
            searchType,
          },
        });
        result = data;
      }

      return result;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }

  //* First Names
  if (searchType === ZoneSearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${firstNamesTerm}`, {
          params: {
            limit,
            offset,
            order,
            churchId,
            searchType,
            searchSubType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${firstNamesTerm}`, {
          params: {
            order,
            churchId,
            searchType,
            searchSubType,
          },
        });

        result = data;
      }

      return result;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }

  //* Last Names
  if (searchType === ZoneSearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${lastNamesTerm}`, {
          params: {
            limit,
            offset,
            order,
            churchId,
            searchType,
            searchSubType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<ZoneResponse[]>(`/zones/${lastNamesTerm}`, {
          params: {
            order,
            churchId,
            searchType,
            searchSubType,
          },
        });

        result = data;
      }

      return result;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }

  //* Full Name
  if (searchType === ZoneSearchType.FullNames) {
    try {
      if (!all) {
        const { data } = await icupApi<ZoneResponse[]>(
          `/zones/${firstNamesTerm}-${lastNamesTerm}`,
          {
            params: {
              limit,
              offset,
              order,
              churchId,
              searchType,
              searchSubType,
            },
          }
        );

        result = data;
      } else {
        const { data } = await icupApi<ZoneResponse[]>(
          `/zones/${firstNamesTerm}-${lastNamesTerm}`,
          {
            params: {
              order,
              churchId,
              searchType,
              searchSubType,
            },
          }
        );

        result = data;
      }

      return result;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }
};

//? UPDATE ZONE BY ID
export interface UpdateZoneOptions {
  id: string;
  formData: ZoneFormData | ZoneSupervisorUpdateFormData;
}

export const updateZone = async ({ id, formData }: UpdateZoneOptions): Promise<ZoneResponse> => {
  try {
    const { data } = await icupApi.patch<ZoneResponse>(`/zones/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE ZONE BY ID
export interface InactivateZoneOptions {
  id: string;
  zoneInactivationCategory: string;
  zoneInactivationReason: string;
}

export const inactivateZone = async ({
  id,
  zoneInactivationCategory,
  zoneInactivationReason,
}: InactivateZoneOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/zones/${id}`, {
      params: {
        zoneInactivationCategory,
        zoneInactivationReason,
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

//? ZONE REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralZonesReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: ZoneQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/zones', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      });

      openPdfInNewTab(res.data);

      return true;
    } else {
      const res = await icupApi<Blob>('/reports/zones', {
        params: {
          order,
          churchId,
        },
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      });

      openPdfInNewTab(res.data);

      return true;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//* By term
export const getZonesReportByTerm = async ({
  firstNamesTerm,
  lastNamesTerm,
  searchType,
  inputTerm,
  selectTerm,
  searchSubType,
  limit,
  offset,
  all,
  order,
  churchId,
}: ZoneQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Partial<Record<ZoneSearchType, string | undefined>> = {
    [ZoneSearchType.FirstNames]: firstNamesTerm,
    [ZoneSearchType.LastNames]: lastNamesTerm,
    [ZoneSearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [ZoneSearchType.ZoneName]: inputTerm,
    [ZoneSearchType.Country]: inputTerm,
    [ZoneSearchType.Department]: inputTerm,
    [ZoneSearchType.Province]: inputTerm,
    [ZoneSearchType.District]: inputTerm,
    [ZoneSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as ZoneSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/zones/${newTerm}`, {
        params: {
          limit,
          offset,
          order,
          churchId,
          searchType,
          searchSubType,
        },
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      });

      openPdfInNewTab(res.data);

      return true;
    } else {
      const res = await icupApi<Blob>(`/reports/zones/${newTerm}`, {
        params: {
          order,
          churchId,
          searchType,
          searchSubType,
        },
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      });

      openPdfInNewTab(res.data);

      return true;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};
