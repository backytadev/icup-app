/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';

import { OfferingIncomeSearchType } from '@/modules/offering/income/enums/offering-income-search-type.enum';
import { OfferingIncomeSearchSubType } from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';

import { type ExternalDonorResponse } from '@/modules/offering/income/interfaces/external-donor-response.interface';
import { type ExternalDonorFormData } from '@/modules/offering/income/interfaces/external-donor-form-data.interface';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { type OfferingIncomeFormData } from '@/modules/offering/income/interfaces/offering-income-form-data.interface';
import { type OfferingIncomeQueryParams } from '@/modules/offering/income/interfaces/offering-income-query-params.interface';

//? CREATE OFFERING INCOME
export const createOfferingIncome = async (
  formData: OfferingIncomeFormData
): Promise<OfferingIncomeResponse> => {
  try {
    const { data } = await icupApi.post<OfferingIncomeResponse>('/offering-income', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET ALL EXTERNAL DONORS (paginated)
export const getExternalDonors = async (): Promise<ExternalDonorResponse[]> => {
  try {
    const { data } = await icupApi<OfferingIncomeResponse[]>('/external-donor', {
      params: {
        order: RecordOrder.Descending,
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

//* GET ALL OFFERING INCOME (paginated)
export const getOfferingsIncome = async ({
  limit,
  offset,
  all,
  order,
  dateTerm,
  churchId,
}: OfferingIncomeQueryParams): Promise<OfferingIncomeResponse[]> => {
  let result: OfferingIncomeResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<OfferingIncomeResponse[]>('/offering-income', {
        params: {
          limit,
          offset,
          order,
          searchDate: dateTerm,
          churchId,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<OfferingIncomeResponse[]>('/offering-income', {
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

//? GET OFFERING INCOME BY TERM (paginated)
export const getOfferingsIncomeByTerm = async ({
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
}: OfferingIncomeQueryParams): Promise<OfferingIncomeResponse[] | undefined> => {
  let result: OfferingIncomeResponse[];

  //* Sunday Service, Sunday School
  if (
    searchType === OfferingIncomeSearchType.SundayService
    // searchType === OfferingIncomeSearchType.SundaySchool
  ) {
    const term =
      searchSubType === OfferingIncomeSearchSubType.OfferingByShift
        ? selectTerm
        : searchSubType === OfferingIncomeSearchSubType.OfferingByDate
          ? dateTerm
          : searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate
            ? `${selectTerm}&${dateTerm}`
            : searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames
              ? `${selectTerm}&${firstNamesTerm}`
              : searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames
                ? `${selectTerm}&${lastNamesTerm}`
                : `${selectTerm}&${firstNamesTerm}-${lastNamesTerm}`;

    try {
      if (!all) {
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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

  //* Family group
  if (searchType === OfferingIncomeSearchType.FamilyGroup) {
    const term =
      searchSubType === OfferingIncomeSearchSubType.OfferingByDate
        ? dateTerm
        : searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCode ||
            searchSubType === OfferingIncomeSearchSubType.OfferingByZone
          ? inputTerm
          : searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
              searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate
            ? `${inputTerm}&${dateTerm}`
            : searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFirstNames
              ? firstNamesTerm
              : searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherLastNames
                ? lastNamesTerm
                : `${firstNamesTerm}-${lastNamesTerm}`;

    try {
      if (!all) {
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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

  //* Zonal fasting and vigil and Zonal Evangelism
  if (
    searchType === OfferingIncomeSearchType.ZonalFasting ||
    searchType === OfferingIncomeSearchType.ZonalVigil ||
    searchType === OfferingIncomeSearchType.ZonalEvangelism
  ) {
    const term =
      searchSubType === OfferingIncomeSearchSubType.OfferingByDate
        ? dateTerm
        : searchSubType === OfferingIncomeSearchSubType.OfferingByZone
          ? inputTerm
          : searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate
            ? `${inputTerm}&${dateTerm}`
            : searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames
              ? firstNamesTerm
              : searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorLastNames
                ? lastNamesTerm
                : `${firstNamesTerm}-${lastNamesTerm}`;

    try {
      if (!all) {
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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

  //* Special, ground church, youth service
  if (
    searchType === OfferingIncomeSearchType.Special ||
    searchType === OfferingIncomeSearchType.ChurchGround
    // searchType === OfferingIncomeSearchType.YouthService
  ) {
    const term =
      searchSubType === OfferingIncomeSearchSubType.OfferingByDate
        ? dateTerm
        : searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames
          ? `${selectTerm}&${firstNamesTerm}`
          : searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames
            ? `${selectTerm}&${lastNamesTerm}`
            : `${selectTerm}&${firstNamesTerm}-${lastNamesTerm}`;

    try {
      if (!all) {
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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

  //* General Vigil, general fasting, general evangelism, united service, activities, adjustment income
  if (
    searchType === OfferingIncomeSearchType.GeneralFasting ||
    searchType === OfferingIncomeSearchType.GeneralVigil ||
    searchType === OfferingIncomeSearchType.GeneralEvangelism ||
    searchType === OfferingIncomeSearchType.UnitedService ||
    searchType === OfferingIncomeSearchType.Activities ||
    searchType === OfferingIncomeSearchType.IncomeAdjustment
  ) {
    const term =
      searchSubType === OfferingIncomeSearchSubType.OfferingByDate
        ? dateTerm
        : `${selectTerm}&${dateTerm}`;
    try {
      if (!all) {
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${term}`, {
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

  //* Record Status
  if (searchType === OfferingIncomeSearchType.RecordStatus) {
    try {
      if (!all) {
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${selectTerm}`, {
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
        const { data } = await icupApi<OfferingIncomeResponse[]>(`/offering-income/${selectTerm}`, {
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
};

//? UPDATE OFFERING INCOME BY TERM
export interface UpdateOfferingIncomeOptions {
  id: string;
  formData: OfferingIncomeFormData;
}

export const updateOfferingIncome = async ({
  id,
  formData,
}: UpdateOfferingIncomeOptions): Promise<OfferingIncomeResponse> => {
  try {
    const { data } = await icupApi.patch<OfferingIncomeResponse>(
      `/offering-income/${id}`,
      formData
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? UPDATE EXTERNAL DONOR BY ID
export interface UpdateExternalDonorOptions {
  id: string | undefined;
  formData: ExternalDonorFormData;
}

export const updateExternalDonor = async ({
  id,
  formData,
}: UpdateExternalDonorOptions): Promise<ExternalDonorResponse> => {
  try {
    const { data } = await icupApi.patch<ExternalDonorResponse>(`/external-donor/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE OFFERING INCOME BY ID
export interface InactivateOfferingIncomeOptions {
  id: string;
  offeringInactivationReason: string;
  exchangeRate?: string;
  exchangeCurrencyTypes?: string;
}

export const inactivateOfferingIncome = async ({
  id,
  offeringInactivationReason,
  exchangeRate,
  exchangeCurrencyTypes,
}: InactivateOfferingIncomeOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/offering-income/${id}`, {
      params: {
        exchangeRate,
        exchangeCurrencyTypes,
        offeringInactivationReason,
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

//? GENERATE RECEIPT BY OFFERING INCOME ID
export interface GenerateReceiptOptions {
  id: string;
  generateReceipt?: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  generationType?: string;
}
export const generateReceiptByOfferingIncomeId = async ({
  id,
  setOpen,
  generateReceipt,
  generationType,
}: GenerateReceiptOptions): Promise<any> => {
  try {
    const res = await icupApi<Blob>(`/reports/offering-income/${id}/receipt`, {
      params: {
        generationType: generationType,
      },
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob',
    });

    if (setOpen) {
      setOpen!(false);
    }

    if (generateReceipt === 'yes' || !generateReceipt) {
      setTimeout(() => {
        openPdfInNewTab(res.data);
      }, 100);
    }

    return res;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado, hable con el administrador');
  }
};

//? OFFERING INCOME REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralOfferingIncomeReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
}: OfferingIncomeQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/offering-income', {
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
      const res = await icupApi<Blob>('/reports/offering-income', {
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
export const getOfferingIncomeReportByTerm = async ({
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
}: OfferingIncomeQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Partial<
    Record<OfferingIncomeSearchSubType | OfferingIncomeSearchType, string | undefined>
  > = {
    [OfferingIncomeSearchSubType.OfferingByDate]: dateTerm,
    [OfferingIncomeSearchSubType.OfferingByShift]: selectTerm,
    [OfferingIncomeSearchSubType.OfferingByShiftDate]: `${selectTerm}&${dateTerm}`,
    [OfferingIncomeSearchSubType.OfferingByZone]: inputTerm,
    [OfferingIncomeSearchSubType.OfferingByZoneDate]: `${inputTerm}&${dateTerm}`,
    [OfferingIncomeSearchSubType.OfferingByGroupCode]: inputTerm,
    [OfferingIncomeSearchSubType.OfferingByGroupCodeDate]: `${inputTerm}&${dateTerm}`,
    [OfferingIncomeSearchSubType.OfferingByPreacherFirstNames]: firstNamesTerm,
    [OfferingIncomeSearchSubType.OfferingByPreacherLastNames]: lastNamesTerm,
    [OfferingIncomeSearchSubType.OfferingByPreacherFullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames]: firstNamesTerm,
    [OfferingIncomeSearchSubType.OfferingBySupervisorLastNames]: lastNamesTerm,
    [OfferingIncomeSearchSubType.OfferingBySupervisorFullNames]: `${firstNamesTerm}-${lastNamesTerm}`,
    [OfferingIncomeSearchSubType.OfferingByContributorFirstNames]: `${selectTerm}&${firstNamesTerm}`,
    [OfferingIncomeSearchSubType.OfferingByContributorLastNames]: `${selectTerm}&${lastNamesTerm}`,
    [OfferingIncomeSearchSubType.OfferingByContributorFullNames]: `${selectTerm}&${firstNamesTerm}-${lastNamesTerm}`,
    [OfferingIncomeSearchType.RecordStatus]: selectTerm,
  };

  newTerm =
    termMapping[searchSubType as OfferingIncomeSearchSubType] ??
    termMapping[searchType as OfferingIncomeSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/offering-income/${newTerm}`, {
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
      const res = await icupApi<Blob>(`/reports/offering-income/${newTerm}`, {
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
