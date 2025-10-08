/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { PastorSearchType } from '@/modules/pastor/enums/pastor-search-type.enum';

import { type PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';
import { type PastorResponse } from '@/modules/pastor/interfaces/pastor-response.interface';
import { type PastorQueryParams } from '@/modules/pastor/interfaces/pastor-query-params.interface';

//? CREATE PASTOR
export const createPastor = async (formData: PastorFormData): Promise<PastorResponse> => {
  try {
    const { data } = await icupApi.post<PastorResponse>('/pastors', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET SIMPLE PASTORS
export const getSimplePastors = async ({
  isSimpleQuery,
}: {
  isSimpleQuery: boolean;
}): Promise<PastorResponse[]> => {
  try {
    const { data } = await icupApi<PastorResponse[]>('/pastors', {
      params: {
        order: RecordOrder.Ascending,
        isSimpleQuery: isSimpleQuery.toString(),
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

//? GET PASTORS (paginated)
export const getPastors = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: PastorQueryParams): Promise<PastorResponse[]> => {
  let result: PastorResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<PastorResponse[]>('/pastors', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<PastorResponse[]>('/pastors', {
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

//? GET PASTORS BY TERM (paginated)
export const getPastorsByTerm = async ({
  searchType,
  inputTerm,
  dateTerm,
  selectTerm,
  firstNamesTerm,
  lastNamesTerm,
  limit,
  offset,
  all,
  order,
  churchId,
}: PastorQueryParams): Promise<PastorResponse[] | undefined> => {
  let result: PastorResponse[];

  //* Origin country, department, province, district, urban sector, address
  if (
    searchType === PastorSearchType.OriginCountry ||
    searchType === PastorSearchType.ResidenceCountry ||
    searchType === PastorSearchType.ResidenceDepartment ||
    searchType === PastorSearchType.ResidenceProvince ||
    searchType === PastorSearchType.ResidenceDistrict ||
    searchType === PastorSearchType.ResidenceUrbanSector ||
    searchType === PastorSearchType.ResidenceAddress
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${inputTerm}`, {
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
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${inputTerm}`, {
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

  //* Date Birth
  if (searchType === PastorSearchType.BirthDate) {
    try {
      if (!all) {
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${dateTerm}`, {
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
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${dateTerm}`, {
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

  //* Status, Gender, Month Birth
  if (
    searchType === PastorSearchType.RecordStatus ||
    searchType === PastorSearchType.Gender ||
    searchType === PastorSearchType.BirthMonth ||
    searchType === PastorSearchType.MaritalStatus
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${selectTerm}`, {
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
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${selectTerm}`, {
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

  //* First Name
  if (searchType === PastorSearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${firstNamesTerm}`, {
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
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${firstNamesTerm}`, {
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

  //* Last Name
  if (searchType === PastorSearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${lastNamesTerm}`, {
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
        const { data } = await icupApi<PastorResponse[]>(`/pastors/${lastNamesTerm}`, {
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

  //* Full Name
  if (searchType === PastorSearchType.FullNames) {
    try {
      if (!all) {
        const { data } = await icupApi<PastorResponse[]>(
          `/pastors/${firstNamesTerm}-${lastNamesTerm}`,
          {
            params: {
              limit,
              offset,
              order,
              churchId,
              searchType,
            },
          }
        );

        result = data;
      } else {
        const { data } = await icupApi<PastorResponse[]>(
          `/pastors/${firstNamesTerm}-${lastNamesTerm}`,
          {
            params: {
              order,
              churchId,
              searchType,
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

//* UPDATE PASTOR BY ID
export interface UpdatePastorOptions {
  id: string;
  formData: PastorFormData;
}

export const updatePastor = async ({
  id,
  formData,
}: UpdatePastorOptions): Promise<PastorResponse> => {
  try {
    const { data } = await icupApi.patch<PastorResponse>(`/pastors/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE PASTOR BY ID
export interface InactivatePastorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

export const inactivatePastor = async ({
  id,
  memberInactivationCategory,
  memberInactivationReason,
}: InactivatePastorOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/pastors/${id}`, {
      params: {
        memberInactivationReason,
        memberInactivationCategory,
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

//? PASTOR REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralPastorsReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: PastorQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/pastors', {
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
      const res = await icupApi<Blob>('/reports/pastors', {
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
export const getPastorsReportByTerm = async ({
  searchType,
  inputTerm,
  dateTerm,
  selectTerm,
  firstNamesTerm,
  lastNamesTerm,
  limit,
  offset,
  all,
  order,
  churchId,
}: PastorQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Record<PastorSearchType, string | undefined> = {
    [PastorSearchType.FirstNames]: firstNamesTerm,
    [PastorSearchType.LastNames]: lastNamesTerm,
    [PastorSearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [PastorSearchType.BirthDate]: dateTerm,
    [PastorSearchType.BirthMonth]: selectTerm,
    [PastorSearchType.Gender]: selectTerm,
    [PastorSearchType.MaritalStatus]: selectTerm,
    [PastorSearchType.OriginCountry]: inputTerm,
    [PastorSearchType.ResidenceCountry]: inputTerm,
    [PastorSearchType.ResidenceDepartment]: inputTerm,
    [PastorSearchType.ResidenceProvince]: inputTerm,
    [PastorSearchType.ResidenceDistrict]: inputTerm,
    [PastorSearchType.ResidenceUrbanSector]: inputTerm,
    [PastorSearchType.ResidenceAddress]: inputTerm,
    [PastorSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as PastorSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/pastors/${newTerm}`, {
        params: {
          limit,
          offset,
          order,
          churchId,
          searchType,
        },
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      });

      openPdfInNewTab(res.data);

      return true;
    } else {
      const res = await icupApi<Blob>(`/reports/pastors/${newTerm}`, {
        params: {
          order,
          churchId,
          searchType,
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
