import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type OfferingExpenseResponse } from '@/modules/offering/expense/interfaces/offering-expense-response.interface';
import { type OfferingExpenseFormData } from '@/modules/offering/expense/interfaces/offering-expense-form-data.interface';
import { type OfferingExpenseQueryParams } from '@/modules/offering/expense/interfaces/offering-expense-query-params.interface';

import { OfferingExpenseSearchType } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';

export interface UpdateOfferingExpenseOptions {
  id: string;
  formData: OfferingExpenseFormData;
}

export interface InactivateOfferingExpenseOptions {
  id: string;
  offeringInactivationReason: string;
  offeringInactivationDescription: string;
}

//* Inline builders
const buildOfferingExpenseSearchTerm = (params: OfferingExpenseQueryParams): string | undefined => {
  const { searchType, dateTerm, selectTerm } = params;

  const mapping: Record<OfferingExpenseSearchType, string | undefined> = {
    [OfferingExpenseSearchType.OperationalExpenses]: dateTerm,
    [OfferingExpenseSearchType.MaintenanceAndRepairExpenses]: dateTerm,
    [OfferingExpenseSearchType.DecorationExpenses]: dateTerm,
    [OfferingExpenseSearchType.EquipmentAndTechnologyExpenses]: dateTerm,
    [OfferingExpenseSearchType.SuppliesExpenses]: dateTerm,
    [OfferingExpenseSearchType.PlaningEventsExpenses]: dateTerm,
    [OfferingExpenseSearchType.OtherExpenses]: dateTerm,
    [OfferingExpenseSearchType.ExpensesAdjustment]: dateTerm,
    [OfferingExpenseSearchType.RecordStatus]: selectTerm,
  };

  return mapping[searchType as OfferingExpenseSearchType];
};

const buildOfferingExpenseQueryParams = (params: OfferingExpenseQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, searchSubType } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (searchSubType) base.searchSubType = searchSubType;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};

//* Create
export const createOfferingExpense = async (
  formData: OfferingExpenseFormData
): Promise<OfferingExpenseResponse> => {
  return apiRequest('post', '/offering-expenses', formData);
};

//* Find all
export const getOfferingsExpenses = async (
  params: OfferingExpenseQueryParams
): Promise<OfferingExpenseResponse[]> => {
  const { limit, offset, order, all, dateTerm, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId, searchDate: dateTerm }
    : { limit, offset, order, searchDate: dateTerm, churchId: resolvedChurchId };

  return apiRequest<OfferingExpenseResponse[]>('get', '/offering-expenses', { params: query });
};

//* Find by filters
export const getOfferingsExpensesByFilters = async (
  params: OfferingExpenseQueryParams
): Promise<OfferingExpenseResponse[]> => {
  const term = buildOfferingExpenseSearchTerm(params);
  const queryParams = buildOfferingExpenseQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<OfferingExpenseResponse[]>('get', '/offering-expenses/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateOfferingExpense = async ({
  id,
  formData,
}: UpdateOfferingExpenseOptions): Promise<OfferingExpenseResponse> => {
  return apiRequest('patch', `/offering-expenses/${id}`, formData);
};

//* Inactivate
export const inactivateOfferingExpense = async ({
  id,
  offeringInactivationReason,
  offeringInactivationDescription,
}: InactivateOfferingExpenseOptions): Promise<void> => {
  return apiRequest('delete', `/offering-expenses/${id}`, {
    params: { offeringInactivationReason, offeringInactivationDescription },
  });
};

//* Reports
//* General
export const getGeneralOfferingExpensesReport = async (
  params: OfferingExpenseQueryParams
): Promise<boolean> => {
  const { limit, offset, order, all, dateTerm, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId, searchDate: dateTerm }
    : { limit, offset, order, churchId: resolvedChurchId };

  const pdf = await apiRequest<Blob>('get', '/reports/offering-expenses', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

//* By filters
export const getOfferingExpensesReportByFilters = async (
  params: OfferingExpenseQueryParams
): Promise<boolean> => {
  const term = buildOfferingExpenseSearchTerm(params);
  const queryParams = buildOfferingExpenseQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/offering-expenses/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);
  return true;
};
