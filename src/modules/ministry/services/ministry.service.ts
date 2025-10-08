/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';
import { RecordOrder } from '@/shared/enums/record-order.enum';

import { MinistrySearchType } from '@/modules/ministry/enums/ministry-search-type.enum';
import { type MinistryResponse } from '@/modules/ministry/interfaces/ministry-response.interface';
import { type MinistryFormData } from '@/modules/ministry/interfaces/ministry-form-data.interface';
import { type MinistryQueryParams } from '@/modules/ministry/interfaces/ministry-query-params.interface';

//? CREATE MINISTRY
export const createMinistry = async (formData: MinistryFormData): Promise<MinistryResponse> => {
  try {
    const { data } = await icupApi.post<MinistryResponse>('/ministries', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET SIMPLE MINISTRIES
export const getSimpleMinistries = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<MinistryResponse[]> => {
  try {
    const { data } = await icupApi<MinistryResponse[]>('/ministries', {
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

//? GET MINISTRIES (paginated)
export const getMinistries = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: MinistryQueryParams): Promise<MinistryResponse[]> => {
  let result: MinistryResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<MinistryResponse[]>('/ministries', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<MinistryResponse[]>('/ministries', {
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

//? GET MINISTRIES BY TERM (paginated)
export const getMinistriesByTerm = async ({
  searchType,
  searchSubType,
  inputTerm,
  dateTerm,
  selectTerm,
  limit,
  offset,
  all,
  order,
  churchId,
  firstNamesTerm,
  lastNamesTerm,
}: MinistryQueryParams): Promise<MinistryResponse[] | undefined> => {
  let result: MinistryResponse[];

  //* Others types
  if (
    searchType === MinistrySearchType.MinistryCustomName ||
    searchType === MinistrySearchType.Department ||
    searchType === MinistrySearchType.Province ||
    searchType === MinistrySearchType.District ||
    searchType === MinistrySearchType.UrbanSector ||
    searchType === MinistrySearchType.Address
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${inputTerm}`, {
          params: {
            limit,
            offset,
            order,
            searchType,
            churchId,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${inputTerm}`, {
          params: {
            order,
            searchType,
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
  }

  //* Founding date
  if (searchType === MinistrySearchType.FoundingDate) {
    try {
      if (!all) {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${dateTerm}`, {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${dateTerm}`, {
          params: {
            order,
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
  if (
    searchType === MinistrySearchType.RecordStatus ||
    searchType === MinistrySearchType.MinistryType
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${selectTerm}`, {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${selectTerm}`, {
          params: {
            order,
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

  //* First Name
  if (searchType === MinistrySearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${firstNamesTerm}`, {
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
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${firstNamesTerm}`, {
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

  //* Last Name
  if (searchType === MinistrySearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${lastNamesTerm}`, {
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
        const { data } = await icupApi<MinistryResponse[]>(`/ministries/${lastNamesTerm}`, {
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
  if (searchType === MinistrySearchType.FullNames) {
    try {
      if (!all) {
        const { data } = await icupApi<MinistryResponse[]>(
          `/ministries/${firstNamesTerm}-${lastNamesTerm}`,
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
        const { data } = await icupApi<MinistryResponse[]>(
          `/ministries/${firstNamesTerm}-${lastNamesTerm}`,
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

//? UPDATE MINISTRY BY ID
export interface UpdateMinistryOptions {
  id: string;
  formData: MinistryFormData;
}

export const updateMinistry = async ({
  id,
  formData,
}: UpdateMinistryOptions): Promise<MinistryResponse> => {
  try {
    const { data } = await icupApi.patch<MinistryResponse>(`/ministries/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE MINISTRY BY ID
export interface InactivateMinistryOptions {
  id: string;
  ministryInactivationCategory: string;
  ministryInactivationReason: string;
}

export const inactivateMinistry = async ({
  id,
  ministryInactivationCategory,
  ministryInactivationReason,
}: InactivateMinistryOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/ministries/${id}`, {
      params: {
        ministryInactivationCategory,
        ministryInactivationReason,
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

//? MINISTRIES REPORT
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralMinistriesReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: MinistryQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/ministries', {
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
      const res = await icupApi<Blob>('/reports/ministries', {
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
export const getMinistriesReportByTerm = async ({
  searchType,
  searchSubType,
  inputTerm,
  all,
  dateTerm,
  selectTerm,
  firstNamesTerm,
  lastNamesTerm,
  limit,
  offset,
  order,
  churchId,
}: MinistryQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Record<MinistrySearchType, string | undefined> = {
    [MinistrySearchType.FirstNames]: firstNamesTerm,
    [MinistrySearchType.LastNames]: lastNamesTerm,
    [MinistrySearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [MinistrySearchType.MinistryType]: selectTerm,
    [MinistrySearchType.MinistryCustomName]: inputTerm,
    [MinistrySearchType.Department]: inputTerm,
    [MinistrySearchType.Province]: inputTerm,
    [MinistrySearchType.District]: inputTerm,
    [MinistrySearchType.UrbanSector]: inputTerm,
    [MinistrySearchType.Address]: inputTerm,
    [MinistrySearchType.FoundingDate]: dateTerm,
    [MinistrySearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as MinistrySearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/ministries/${newTerm}`, {
        params: {
          limit,
          offset,
          order,
          searchType,
          searchSubType,
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
      const res = await icupApi<Blob>(`/reports/ministries/${newTerm}`, {
        params: {
          order,
          searchType,
          searchSubType,
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
