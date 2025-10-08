/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { CopastorSearchType } from '@/modules/copastor/enums/copastor-search-type.enum';
import { type CopastorResponse } from '@/modules/copastor/interfaces/copastor-response.interface';
import { type CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';
import { type CopastorQueryParams } from '@/modules/copastor/interfaces/copastor-query-params.interface';

//? CREATE CO-PASTOR
export const createCopastor = async (formData: CopastorFormData): Promise<CopastorResponse> => {
  try {
    const { data } = await icupApi.post<CopastorResponse>('/copastors', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET SIMPLE CO-PASTORS
export const getSimpleCopastors = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<CopastorResponse[]> => {
  try {
    const { data } = await icupApi<CopastorResponse[]>('/copastors', {
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

//? GET CO-PASTORS (PAGINATED)
export const getCopastors = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: CopastorQueryParams): Promise<CopastorResponse[]> => {
  let result: CopastorResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<CopastorResponse[]>('/copastors', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<CopastorResponse[]>('/copastors', {
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

//? GET CO-PASTORS BY TERM (PAGINATED)
export const getCopastorsByTerm = async ({
  searchType,
  searchSubType,
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
}: CopastorQueryParams): Promise<CopastorResponse[] | undefined> => {
  let result: CopastorResponse[];

  //* Origin country, department, province, district, urban sector, address
  if (
    searchType === CopastorSearchType.OriginCountry ||
    searchType === CopastorSearchType.ResidenceCountry ||
    searchType === CopastorSearchType.ResidenceDepartment ||
    searchType === CopastorSearchType.ResidenceProvince ||
    searchType === CopastorSearchType.ResidenceDistrict ||
    searchType === CopastorSearchType.ResidenceUrbanSector ||
    searchType === CopastorSearchType.ResidenceAddress
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${inputTerm}`, {
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
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${inputTerm}`, {
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
  if (searchType === CopastorSearchType.BirthDate) {
    try {
      if (!all) {
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${dateTerm}`, {
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
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${dateTerm}`, {
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
    searchType === CopastorSearchType.RecordStatus ||
    searchType === CopastorSearchType.Gender ||
    searchType === CopastorSearchType.BirthMonth ||
    searchType === CopastorSearchType.MaritalStatus
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${selectTerm}`, {
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
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${selectTerm}`, {
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
  if (searchType === CopastorSearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${firstNamesTerm}`, {
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
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${firstNamesTerm}`, {
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
  if (searchType === CopastorSearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${lastNamesTerm}`, {
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
        const { data } = await icupApi<CopastorResponse[]>(`/copastors/${lastNamesTerm}`, {
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
  if (searchType === CopastorSearchType.FullNames) {
    try {
      if (!all) {
        const { data } = await icupApi<CopastorResponse[]>(
          `/copastors/${firstNamesTerm}-${lastNamesTerm}`,
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
        const { data } = await icupApi<CopastorResponse[]>(
          `/copastors/${firstNamesTerm}-${lastNamesTerm}`,
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

//? UPDATE CO-PASTOR BY ID
export interface UpdateCopastorOptions {
  id: string;
  formData: CopastorFormData;
}

export const updateCopastor = async ({
  id,
  formData,
}: UpdateCopastorOptions): Promise<CopastorResponse> => {
  try {
    const { data } = await icupApi.patch<CopastorResponse>(`/copastors/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE CO-PASTOR BY ID
export interface InactivateCopastorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

export const inactivateCopastor = async ({
  id,
  memberInactivationCategory,
  memberInactivationReason,
}: InactivateCopastorOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/copastors/${id}`, {
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

//? COPASTOR REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralCopastorsReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: CopastorQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/copastors', {
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
      const res = await icupApi<Blob>('/reports/copastors', {
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
export const getCopastorsReportByTerm = async ({
  searchType,
  searchSubType,
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
}: CopastorQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Record<CopastorSearchType, string | undefined> = {
    [CopastorSearchType.FirstNames]: firstNamesTerm,
    [CopastorSearchType.LastNames]: lastNamesTerm,
    [CopastorSearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [CopastorSearchType.BirthDate]: dateTerm,
    [CopastorSearchType.BirthMonth]: selectTerm,
    [CopastorSearchType.Gender]: selectTerm,
    [CopastorSearchType.MaritalStatus]: selectTerm,
    [CopastorSearchType.OriginCountry]: inputTerm,
    [CopastorSearchType.ResidenceCountry]: inputTerm,
    [CopastorSearchType.ResidenceDepartment]: inputTerm,
    [CopastorSearchType.ResidenceProvince]: inputTerm,
    [CopastorSearchType.ResidenceDistrict]: inputTerm,
    [CopastorSearchType.ResidenceUrbanSector]: inputTerm,
    [CopastorSearchType.ResidenceAddress]: inputTerm,
    [CopastorSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as CopastorSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/copastors/${newTerm}`, {
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
      const res = await icupApi<Blob>(`/reports/copastors/${newTerm}`, {
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
