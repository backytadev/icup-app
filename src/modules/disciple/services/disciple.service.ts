/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { DiscipleSearchType } from '@/modules/disciple/enums/disciple-search-type.enum';
import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';
import { type DiscipleQueryParams } from '@/modules/disciple/interfaces/disciple-query-params.interface';

//? CREATE DISCIPLE
export const createDisciple = async (formData: DiscipleFormData): Promise<DiscipleResponse> => {
  try {
    const { data } = await icupApi.post<DiscipleResponse>('/disciples', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET SIMPLE DISCIPLES
export const getSimpleDisciples = async ({
  isSimpleQuery,
}: {
  isSimpleQuery: true;
}): Promise<DiscipleResponse[]> => {
  try {
    const { data } = await icupApi<DiscipleResponse[]>('/disciples', {
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

//? GET DISCIPLES (paginated)
export const getDisciples = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: DiscipleQueryParams): Promise<DiscipleResponse[]> => {
  let result: DiscipleResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<DiscipleResponse[]>('/disciples', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<DiscipleResponse[]>('/disciples', {
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

//? GET DISCIPLES BY TERM (paginated)
export const getDisciplesByTerm = async ({
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
}: DiscipleQueryParams): Promise<DiscipleResponse[] | undefined> => {
  let result: DiscipleResponse[];

  //* Origin country, department, province, district, urban sector, address
  if (
    searchType === DiscipleSearchType.ZoneName ||
    searchType === DiscipleSearchType.FamilyGroupCode ||
    searchType === DiscipleSearchType.FamilyGroupName ||
    searchType === DiscipleSearchType.OriginCountry ||
    searchType === DiscipleSearchType.ResidenceCountry ||
    searchType === DiscipleSearchType.ResidenceDepartment ||
    searchType === DiscipleSearchType.ResidenceProvince ||
    searchType === DiscipleSearchType.ResidenceDistrict ||
    searchType === DiscipleSearchType.ResidenceUrbanSector ||
    searchType === DiscipleSearchType.ResidenceAddress
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${inputTerm}`, {
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
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${inputTerm}`, {
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
  if (searchType === DiscipleSearchType.BirthDate) {
    try {
      if (!all) {
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${dateTerm}`, {
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
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${dateTerm}`, {
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
    searchType === DiscipleSearchType.RecordStatus ||
    searchType === DiscipleSearchType.Gender ||
    searchType === DiscipleSearchType.BirthMonth ||
    searchType === DiscipleSearchType.MaritalStatus
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${selectTerm}`, {
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
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${selectTerm}`, {
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
  if (searchType === DiscipleSearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${firstNamesTerm}`, {
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
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${firstNamesTerm}`, {
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
  if (searchType === DiscipleSearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${lastNamesTerm}`, {
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
        const { data } = await icupApi<DiscipleResponse[]>(`/disciples/${lastNamesTerm}`, {
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
  if (searchType === DiscipleSearchType.FullNames) {
    try {
      if (!all) {
        const { data } = await icupApi<DiscipleResponse[]>(
          `/disciples/${firstNamesTerm}-${lastNamesTerm}`,
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
        const { data } = await icupApi<DiscipleResponse[]>(
          `/disciples/${firstNamesTerm}-${lastNamesTerm}`,
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

//? UPDATE DISCIPLES BY ID
export interface UpdateDiscipleOptions {
  id: string;
  formData: DiscipleFormData;
}

export const updateDisciple = async ({
  id,
  formData,
}: UpdateDiscipleOptions): Promise<DiscipleResponse> => {
  try {
    const { data } = await icupApi.patch<DiscipleResponse>(`/disciples/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

// ! INACTIVATE DISCIPLES BY ID
export interface InactivateDiscipleOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

export const inactivateDisciple = async ({
  id,
  memberInactivationCategory,
  memberInactivationReason,
}: InactivateDiscipleOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/disciples/${id}`, {
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

//? DISCIPLE REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralDisciplesReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: DiscipleQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/disciples', {
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
      const res = await icupApi<Blob>('/reports/disciples', {
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
export const getDisciplesReportByTerm = async ({
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
}: DiscipleQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Record<DiscipleSearchType, string | undefined> = {
    [DiscipleSearchType.FirstNames]: firstNamesTerm,
    [DiscipleSearchType.LastNames]: lastNamesTerm,
    [DiscipleSearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [DiscipleSearchType.BirthDate]: dateTerm,
    [DiscipleSearchType.BirthMonth]: selectTerm,
    [DiscipleSearchType.Gender]: selectTerm,
    [DiscipleSearchType.MaritalStatus]: selectTerm,
    [DiscipleSearchType.OriginCountry]: inputTerm,
    [DiscipleSearchType.ZoneName]: inputTerm,
    [DiscipleSearchType.FamilyGroupCode]: inputTerm,
    [DiscipleSearchType.FamilyGroupName]: inputTerm,
    [DiscipleSearchType.ResidenceCountry]: inputTerm,
    [DiscipleSearchType.ResidenceDepartment]: inputTerm,
    [DiscipleSearchType.ResidenceProvince]: inputTerm,
    [DiscipleSearchType.ResidenceDistrict]: inputTerm,
    [DiscipleSearchType.ResidenceUrbanSector]: inputTerm,
    [DiscipleSearchType.ResidenceAddress]: inputTerm,
    [DiscipleSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as DiscipleSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/disciples/${newTerm}`, {
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
      const res = await icupApi<Blob>(`/reports/disciples/${newTerm}`, {
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
