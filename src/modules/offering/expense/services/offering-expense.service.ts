/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/api/icupApi';

import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';
import { type OfferingExpenseFormData } from '@/modules/offering/expense/interfaces/offering-expense-form-data.interface';
import { type OfferingExpenseQueryParams } from '@/modules/offering/expense/interfaces/offering-expense-query-params.interface';

import { OfferingExpenseSearchType } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';

//? CREATE OFFERING EXPENSE
export const createOfferingExpense = async (
  formData: OfferingExpenseFormData
): Promise<OfferingExpenseResponse> => {
  try {
    const { data } = await icupApi.post<OfferingExpenseResponse>('/offering-expenses', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET ALL OFFERING EXPENSES (paginated)
export const getOfferingsExpenses = async ({
  limit,
  offset,
  all,
  allByDate,
  order,
  dateTerm,
  churchId,
}: OfferingExpenseQueryParams): Promise<OfferingExpenseResponse[]> => {
  let result: OfferingExpenseResponse[];

  try {
    if (!all && !allByDate) {
      const { data } = await icupApi<OfferingExpenseResponse[]>('/offering-expenses', {
        params: {
          limit,
          offset,
          order,
          searchDate: dateTerm,
          churchId,
        },
      });

      result = data;
    }
    // else if (allByDate && !all) {
    //   const { data } = await icupApi<OfferingExpenseResponse[]>('/offering-expenses', {
    //     params: {
    //       order,
    //       searchDate: dateTerm,
    //       churchId,
    //     },
    //   });

    //   result = data;
    // }
    else {
      const { data } = await icupApi<OfferingExpenseResponse[]>('/offering-expenses', {
        params: {
          order,
          churchId,
          searchDate: dateTerm,
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

//? GET OFFERING EXPENSES BY TERM (paginated)
export const getOfferingsExpensesByTerm = async ({
  searchType,
  searchSubType,
  dateTerm,
  selectTerm,
  limit,
  offset,
  all,
  order,
  churchId,
}: OfferingExpenseQueryParams): Promise<OfferingExpenseResponse[] | undefined> => {
  let result: OfferingExpenseResponse[];

  //* Others types
  if (searchType !== OfferingExpenseSearchType.RecordStatus) {
    try {
      if (!all) {
        const { data } = await icupApi<OfferingExpenseResponse[]>(
          `/offering-expenses/${dateTerm}`,
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
        const { data } = await icupApi<OfferingExpenseResponse[]>(
          `/offering-expenses/${dateTerm}`,
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

  //* Record Status
  if (searchType === OfferingExpenseSearchType.RecordStatus) {
    try {
      if (!all) {
        const { data } = await icupApi<OfferingExpenseResponse[]>(
          `/offering-expenses/${selectTerm}`,
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
        const { data } = await icupApi<OfferingExpenseResponse[]>(
          `/offering-expenses/${selectTerm}`,
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

//? UPDATE OFFERING EXPENSE BY ID
export interface UpdateOfferingExpenseOptions {
  id: string;
  formData: OfferingExpenseFormData;
}

export const updateOfferingExpense = async ({
  id,
  formData,
}: UpdateOfferingExpenseOptions): Promise<OfferingExpenseResponse> => {
  try {
    const { data } = await icupApi.patch<OfferingExpenseResponse>(
      `/offering-expenses/${id}`,
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

//! INACTIVATE OFFERING EXPENSE BY ID
export interface InactivateOfferingExpenseOptions {
  id: string;
  offeringInactivationReason: string;
}

export const inactivateOfferingExpense = async ({
  id,
  offeringInactivationReason,
}: InactivateOfferingExpenseOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/offering-expenses/${id}`, {
      params: {
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

//? OFFERING EXPENSES REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralOfferingExpensesReport = async ({
  limit,
  offset,
  all,
  order,
  churchId,
  allByDate,
  dateTerm,
}: OfferingExpenseQueryParams): Promise<boolean> => {
  try {
    if (!all && !allByDate) {
      const res = await icupApi<Blob>('/reports/offering-expenses', {
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
    }
    // else if (allByDate && !all) {
    //   const res = await icupApi<Blob>('/reports/offering-expenses', {
    //     params: {
    //       searchDate: dateTerm,
    //       order,
    //       churchId,
    //     },
    //     headers: {
    //       'Content-Type': 'application/pdf',
    //     },
    //     responseType: 'blob',
    //   });

    //   openPdfInNewTab(res.data);

    //   return true;
    // }
    else {
      const res = await icupApi<Blob>('/reports/offering-expenses', {
        params: {
          order,
          churchId,
          searchDate: dateTerm,
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
export const getOfferingExpensesReportByTerm = async ({
  searchType,
  searchSubType,
  dateTerm,
  selectTerm,
  limit,
  offset,
  all,
  order,
  churchId,
}: OfferingExpenseQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Record<OfferingExpenseSearchType, string | undefined> = {
    [OfferingExpenseSearchType.DecorationExpenses]: `${dateTerm}`,
    [OfferingExpenseSearchType.EquipmentAndTechnologyExpenses]: `${dateTerm}`,
    [OfferingExpenseSearchType.ExpensesAdjustment]: `${dateTerm}`,
    [OfferingExpenseSearchType.MaintenanceAndRepairExpenses]: `${dateTerm}`,
    [OfferingExpenseSearchType.OperationalExpenses]: `${dateTerm}`,
    [OfferingExpenseSearchType.PlaningEventsExpenses]: `${dateTerm}`,
    [OfferingExpenseSearchType.SuppliesExpenses]: `${dateTerm}`,
    [OfferingExpenseSearchType.OtherExpenses]: `${dateTerm}`,
    [OfferingExpenseSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as OfferingExpenseSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/offering-expenses/${newTerm}`, {
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
      const res = await icupApi<Blob>(`/reports/offering-expenses/${newTerm}`, {
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
