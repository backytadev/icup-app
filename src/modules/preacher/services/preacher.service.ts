/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { PreacherSearchType } from '@/modules/preacher/enums/preacher-search-type.enum';
import { type PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';
import { type PreacherResponse } from '@/modules/preacher/interfaces/preacher-response.interface';
import { type PreacherQueryParams } from '@/modules/preacher/interfaces/preacher-query-params.interface';

//? CREATE PREACHER
export const createPreacher = async (formData: PreacherFormData): Promise<PreacherResponse> => {
  try {
    const { data } = await icupApi.post<PreacherResponse>('/preachers', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET SIMPLE PREACHERS
export const getSimplePreachers = async ({
  isSimpleQuery,
}: {
  isSimpleQuery: boolean;
}): Promise<PreacherResponse[]> => {
  try {
    const { data } = await icupApi<PreacherResponse[]>('/preachers', {
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

//? GET PREACHERS BY ZONE
export interface GetPreachersByZoneOptions {
  searchType: string;
  zoneId: string;
  isNullFamilyGroup: boolean;
}

export const getPreachersByZone = async ({
  searchType,
  zoneId,
  isNullFamilyGroup,
}: GetPreachersByZoneOptions): Promise<PreacherResponse[]> => {
  try {
    const { data } = await icupApi<PreacherResponse[]>(`/preachers/${zoneId}`, {
      params: {
        order: RecordOrder.Ascending,
        searchType,
        isNullFamilyGroup: isNullFamilyGroup.toString(),
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

//? GET PREACHERS (paginated)
export const getPreachers = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: PreacherQueryParams): Promise<PreacherResponse[]> => {
  let result: PreacherResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<PreacherResponse[]>('/preachers', {
        params: {
          limit,
          offset,
          order,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<PreacherResponse[]>('/preachers', {
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

//? GET PREACHER BY TERM (paginated)
export const getPreachersByTerm = async ({
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
}: PreacherQueryParams): Promise<PreacherResponse[] | undefined> => {
  let result: PreacherResponse[];

  //* Origin country, department, province, district, urban sector, address, zone
  if (
    searchType === PreacherSearchType.OriginCountry ||
    searchType === PreacherSearchType.ZoneName ||
    searchType === PreacherSearchType.FamilyGroupCode ||
    searchType === PreacherSearchType.FamilyGroupName ||
    searchType === PreacherSearchType.ResidenceCountry ||
    searchType === PreacherSearchType.ResidenceDepartment ||
    searchType === PreacherSearchType.ResidenceProvince ||
    searchType === PreacherSearchType.ResidenceDistrict ||
    searchType === PreacherSearchType.ResidenceUrbanSector ||
    searchType === PreacherSearchType.ResidenceAddress
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${inputTerm}`, {
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
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${inputTerm}`, {
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
  if (searchType === PreacherSearchType.BirthDate) {
    try {
      if (!all) {
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${dateTerm}`, {
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
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${dateTerm}`, {
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
    searchType === PreacherSearchType.RecordStatus ||
    searchType === PreacherSearchType.Gender ||
    searchType === PreacherSearchType.BirthMonth ||
    searchType === PreacherSearchType.MaritalStatus
  ) {
    try {
      if (!all) {
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${selectTerm}`, {
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
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${selectTerm}`, {
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
  if (searchType === PreacherSearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${firstNamesTerm}`, {
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
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${firstNamesTerm}`, {
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
  if (searchType === PreacherSearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${lastNamesTerm}`, {
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
        const { data } = await icupApi<PreacherResponse[]>(`/preachers/${lastNamesTerm}`, {
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
  if (searchType === PreacherSearchType.FullNames) {
    try {
      if (!all) {
        const { data } = await icupApi<PreacherResponse[]>(
          `/preachers/${firstNamesTerm}-${lastNamesTerm}`,
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
        const { data } = await icupApi<PreacherResponse[]>(
          `/preachers/${firstNamesTerm}-${lastNamesTerm}`,
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

//? UPDATE PREACHER BY ID
export interface UpdatePreacherOptions {
  id: string;
  formData: PreacherFormData;
}

export const updatePreacher = async ({
  id,
  formData,
}: UpdatePreacherOptions): Promise<PreacherResponse> => {
  try {
    const { data } = await icupApi.patch<PreacherResponse>(`/preachers/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE PREACHER BY ID
export interface InactivatePreacherOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

export const inactivatePreacher = async ({
  id,
  memberInactivationCategory,
  memberInactivationReason,
}: InactivatePreacherOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/preachers/${id}`, {
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

//? PREACHER REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralPreachersReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: PreacherQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/preachers', {
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
      const res = await icupApi<Blob>('/reports/preachers', {
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
export const getPreachersReportByTerm = async ({
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
}: PreacherQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Partial<Record<PreacherSearchType, string | undefined>> = {
    [PreacherSearchType.FirstNames]: firstNamesTerm,
    [PreacherSearchType.LastNames]: lastNamesTerm,
    [PreacherSearchType.FullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [PreacherSearchType.BirthDate]: dateTerm,
    [PreacherSearchType.BirthMonth]: selectTerm,
    [PreacherSearchType.Gender]: selectTerm,
    [PreacherSearchType.MaritalStatus]: selectTerm,
    [PreacherSearchType.OriginCountry]: inputTerm,
    [PreacherSearchType.ZoneName]: inputTerm,
    [PreacherSearchType.FamilyGroupCode]: inputTerm,
    [PreacherSearchType.FamilyGroupName]: inputTerm,
    [PreacherSearchType.ResidenceCountry]: inputTerm,
    [PreacherSearchType.ResidenceDepartment]: inputTerm,
    [PreacherSearchType.ResidenceProvince]: inputTerm,
    [PreacherSearchType.ResidenceDistrict]: inputTerm,
    [PreacherSearchType.ResidenceUrbanSector]: inputTerm,
    [PreacherSearchType.ResidenceAddress]: inputTerm,
    [PreacherSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as PreacherSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/preachers/${newTerm}`, {
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
      const res = await icupApi<Blob>(`/reports/preachers/${newTerm}`, {
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
