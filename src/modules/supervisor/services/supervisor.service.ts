/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { SupervisorSearchType } from '@/modules/supervisor/enums/supervisor-search-type.enum';
import { type SupervisorResponse } from '@/modules/supervisor/interfaces/supervisor-response.interface';
import { type SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';
import { type SupervisorQueryParams } from '@/modules/supervisor/interfaces/supervisor-query-params.interface';

//? CREATE SUPERVISOR
export const createSupervisor = async (
  formData: SupervisorFormData
): Promise<SupervisorResponse> => {
  try {
    const { data } = await icupApi.post<SupervisorResponse>('/supervisors', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET SIMPLE SUPERVISORS
export interface GetSimpleSupervisorsOptions {
  isNullZone: boolean;
  isSimpleQuery: boolean;
}

export const getSimpleSupervisors = async ({
  isNullZone,
  isSimpleQuery,
}: GetSimpleSupervisorsOptions): Promise<SupervisorResponse[]> => {
  try {
    const { data } = await icupApi<SupervisorResponse[]>('/supervisors', {
      params: {
        order: RecordOrder.Ascending,
        isNullZone: isNullZone.toString(),
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

//? GET SUPERVISORS (paginated)
export const getSupervisors = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: SupervisorQueryParams): Promise<SupervisorResponse[]> => {
  let result: SupervisorResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<SupervisorResponse[]>('/supervisors', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<SupervisorResponse[]>('/supervisors', {
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

//? GET SUPERVISORS BY PASTOR
export interface GetSupervisorsByCopastorOptions {
  searchType: string;
  copastorId: string;
  isNullZone: boolean;
}

export const getSupervisorsByCopastor = async ({
  searchType,
  copastorId,
  isNullZone,
}: GetSupervisorsByCopastorOptions): Promise<SupervisorResponse[]> => {
  try {
    const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${copastorId}`, {
      params: {
        order: RecordOrder.Ascending,
        searchType,
        isNullZone: isNullZone.toString(),
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

//? GET SUPERVISOR BY TERM (paginated)
export const getSupervisorsByTerm = async ({
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
}: SupervisorQueryParams): Promise<SupervisorResponse[] | undefined> => {
  let result: SupervisorResponse[];

  //* Origin country, department, province, district, urban sector, address, zone
  if (
    searchType === SupervisorSearchType.OriginCountry ||
    searchType === SupervisorSearchType.ResidenceCountry ||
    searchType === SupervisorSearchType.ZoneName ||
    searchType === SupervisorSearchType.ResidenceDepartment ||
    searchType === SupervisorSearchType.ResidenceProvince ||
    searchType === SupervisorSearchType.ResidenceDistrict ||
    searchType === SupervisorSearchType.ResidenceUrbanSector ||
    searchType === SupervisorSearchType.ResidenceAddress
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${inputTerm}`, {
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
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${inputTerm}`, {
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
  if (searchType === SupervisorSearchType.BirthDate) {
    try {
      if (!all) {
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${dateTerm}`, {
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
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${dateTerm}`, {
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
    searchType === SupervisorSearchType.RecordStatus ||
    searchType === SupervisorSearchType.Gender ||
    searchType === SupervisorSearchType.BirthMonth ||
    searchType === SupervisorSearchType.MaritalStatus
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${selectTerm}`, {
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
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${selectTerm}`, {
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
  if (searchType === SupervisorSearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${firstNamesTerm}`, {
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
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${firstNamesTerm}`, {
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
  if (searchType === SupervisorSearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${lastNamesTerm}`, {
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
        const { data } = await icupApi<SupervisorResponse[]>(`/supervisors/${lastNamesTerm}`, {
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
  if (searchType === SupervisorSearchType.FullNames) {
    try {
      if (!all) {
        const { data } = await icupApi<SupervisorResponse[]>(
          `/supervisors/${firstNamesTerm}-${lastNamesTerm}`,
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
        const { data } = await icupApi<SupervisorResponse[]>(
          `/supervisors/${firstNamesTerm}-${lastNamesTerm}`,
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

//? UPDATE SUPERVISORS BY ID
export interface UpdateSupervisorOptions {
  id: string;
  formData: SupervisorFormData;
}

export const updateSupervisor = async ({
  id,
  formData,
}: UpdateSupervisorOptions): Promise<SupervisorResponse> => {
  try {
    const { data } = await icupApi.patch<SupervisorResponse>(`/supervisors/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE SUPERVISOR BY ID
export interface InactivateSupervisorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

export const inactivateSupervisor = async ({
  id,
  memberInactivationCategory,
  memberInactivationReason,
}: InactivateSupervisorOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/supervisors/${id}`, {
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

//? SUPERVISOR REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralSupervisorsReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: SupervisorQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/supervisors', {
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
      const res = await icupApi<Blob>('/reports/supervisors', {
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
export const getSupervisorsReportByTerm = async ({
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
}: SupervisorQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Partial<Record<SupervisorSearchType, string | undefined>> = {
    [SupervisorSearchType.FirstNames]: firstNamesTerm,
    [SupervisorSearchType.LastNames]: lastNamesTerm,
    [SupervisorSearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [SupervisorSearchType.BirthDate]: dateTerm,
    [SupervisorSearchType.BirthMonth]: selectTerm,
    [SupervisorSearchType.Gender]: selectTerm,
    [SupervisorSearchType.MaritalStatus]: selectTerm,
    [SupervisorSearchType.ZoneName]: inputTerm,
    [SupervisorSearchType.OriginCountry]: inputTerm,
    [SupervisorSearchType.ResidenceDepartment]: inputTerm,
    [SupervisorSearchType.ResidenceCountry]: inputTerm,
    [SupervisorSearchType.ResidenceProvince]: inputTerm,
    [SupervisorSearchType.ResidenceDistrict]: inputTerm,
    [SupervisorSearchType.ResidenceUrbanSector]: inputTerm,
    [SupervisorSearchType.ResidenceAddress]: inputTerm,
    [SupervisorSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as SupervisorSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/supervisors/${newTerm}`, {
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
      const res = await icupApi<Blob>(`/reports/supervisors/${newTerm}`, {
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
