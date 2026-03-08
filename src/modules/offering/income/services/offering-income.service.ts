import { RecordOrder } from '@/shared/enums/record-order.enum';
import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { OfferingIncomeSearchType } from '@/modules/offering/income/enums/offering-income-search-type.enum';
import { OfferingIncomeSearchSubType } from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';

import { type ExternalDonorResponse } from '@/modules/offering/income/interfaces/external-donor-response.interface';
import { type ExternalDonorFormData } from '@/modules/offering/income/interfaces/external-donor-form-data.interface';
import { type OfferingIncomeResponse } from '@/modules/offering/income/interfaces/offering-income-response.interface';
import { type OfferingIncomeFormData } from '@/modules/offering/income/interfaces/offering-income-form-data.interface';
import { type OfferingIncomeQueryParams } from '@/modules/offering/income/interfaces/offering-income-query-params.interface';

export interface UpdateOfferingIncomeOptions {
  id: string;
  formData: OfferingIncomeFormData;
}

export interface InactivateOfferingIncomeOptions {
  id: string;
  offeringInactivationReason: string;
  offeringInactivationDescription?: string;
  exchangeRate?: string;
  exchangeCurrencyTypes?: string;
}

export interface UpdateExternalDonorOptions {
  id: string | undefined;
  formData: ExternalDonorFormData;
}

//* Inline builders
const buildOfferingIncomeSearchTerm = (params: OfferingIncomeQueryParams): string | undefined => {
  const {
    searchType,
    searchSubType,
    inputTerm,
    dateTerm,
    selectTerm,
    firstNamesTerm,
    lastNamesTerm,
  } = params;

  const subTypeMapping: Partial<Record<OfferingIncomeSearchSubType, string | undefined>> = {
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
  };

  if (searchSubType) return subTypeMapping[searchSubType as OfferingIncomeSearchSubType];
  if (searchType === OfferingIncomeSearchType.RecordStatus) return selectTerm;

  return dateTerm;
};

const buildOfferingIncomeQueryParams = (params: OfferingIncomeQueryParams, term?: string) => {
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
export const createOfferingIncome = async (
  formData: OfferingIncomeFormData
): Promise<OfferingIncomeResponse> => {
  return apiRequest('post', '/offering-income', formData);
};

//* Find all external donors
export const getExternalDonors = async (): Promise<ExternalDonorResponse[]> => {
  return apiRequest<ExternalDonorResponse[]>('get', '/external-donor', {
    params: { order: RecordOrder.Descending },
  });
};

//* Find all
export const getOfferingsIncome = async (
  params: OfferingIncomeQueryParams
): Promise<OfferingIncomeResponse[]> => {
  const { limit, offset, order, all, dateTerm, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId, searchDate: dateTerm }
    : { limit, offset, order, searchDate: dateTerm, churchId: resolvedChurchId };

  return apiRequest<OfferingIncomeResponse[]>('get', '/offering-income', { params: query });
};

//* Find by filters
export const getOfferingsIncomeByFilters = async (
  params: OfferingIncomeQueryParams
): Promise<OfferingIncomeResponse[]> => {
  const term = buildOfferingIncomeSearchTerm(params);
  const queryParams = buildOfferingIncomeQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<OfferingIncomeResponse[]>('get', '/offering-income/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateOfferingIncome = async ({
  id,
  formData,
}: UpdateOfferingIncomeOptions): Promise<OfferingIncomeResponse> => {
  return apiRequest('patch', `/offering-income/${id}`, formData);
};

//* Update external donor
export const updateExternalDonor = async ({
  id,
  formData,
}: UpdateExternalDonorOptions): Promise<ExternalDonorResponse> => {
  return apiRequest('patch', `/external-donor/${id}`, formData);
};

//* Inactivate
export const inactivateOfferingIncome = async ({
  id,
  offeringInactivationReason,
  offeringInactivationDescription,
  exchangeRate,
  exchangeCurrencyTypes,
}: InactivateOfferingIncomeOptions): Promise<void> => {
  return apiRequest('delete', `/offering-income/${id}`, {
    params: {
      exchangeRate,
      exchangeCurrencyTypes,
      offeringInactivationReason,
      offeringInactivationDescription,
    },
  });
};

//* Reports
export interface GenerateReceiptOptions {
  id: string;
  shouldOpenReceiptInBrowser?: string;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  generationType?: string;
}

export const generateReceiptByOfferingIncomeId = async ({
  id,
  setOpen,
  shouldOpenReceiptInBrowser,
  generationType,
}: GenerateReceiptOptions): Promise<Blob> => {
  const pdf = await apiRequest<Blob>('get', `/reports/offering-income/${id}/receipt`, {
    params: { generationType },
    headers: { 'Content-Type': 'application/pdf' },
    responseType: 'blob',
  });

  if (setOpen) setOpen(false);

  if (shouldOpenReceiptInBrowser === 'yes' || !shouldOpenReceiptInBrowser) {
    setTimeout(() => {
      openPdfInNewTab(pdf);
    }, 100);
  }

  return pdf;
};

//* General
export const getGeneralOfferingIncomeReport = async (
  params: OfferingIncomeQueryParams
): Promise<boolean> => {
  const { limit, offset, order, all, dateTerm, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId, searchDate: dateTerm }
    : { limit, offset, order, churchId: resolvedChurchId };

  const pdf = await apiRequest<Blob>('get', '/reports/offering-income', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

//* By filters
export const getOfferingIncomeReportByFilters = async (
  params: OfferingIncomeQueryParams
): Promise<boolean> => {
  const term = buildOfferingIncomeSearchTerm(params);
  const queryParams = buildOfferingIncomeQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/offering-income/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);
  return true;
};
