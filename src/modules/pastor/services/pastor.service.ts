import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type PastorFormData } from '@/modules/pastor/types/pastor-form-data.interface';
import { type PastorResponse } from '@/modules/pastor/types/pastor-response.interface';
import { type PastorQueryParams } from '@/modules/pastor/types/pastor-query-params.interface';
import { PastorSearchType } from '@/modules/pastor/enums/pastor-search-type.enum';

export interface UpdatePastorOptions {
  id: string;
  formData: PastorFormData;
}

export interface InactivatePastorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

//* Internal helpers - not exported
const buildPastorSearchTerm = (params: PastorQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<PastorSearchType, string | undefined> = {
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
    [PastorSearchType.FirstNames]: firstNamesTerm,
    [PastorSearchType.LastNames]: lastNamesTerm,
    [PastorSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as PastorSearchType];
};

const buildPastorQueryParams = (params: PastorQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, churchId } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (churchId) base.churchId = churchId;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};

//* Create
export const createPastor = async (formData: PastorFormData): Promise<PastorResponse> => {
  return apiRequest('post', '/pastors', formData);
};

//* Find simple pastors
export const getSimplePastors = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<PastorResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<PastorResponse[]>('get', '/pastors', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all pastors
export const getAllPastors = async (params: PastorQueryParams): Promise<PastorResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<PastorResponse[]>('get', '/pastors', { params: query });
};

//* Find by filters
export const getPastorsByFilters = async (params: PastorQueryParams): Promise<PastorResponse[]> => {
  const term = buildPastorSearchTerm(params);
  const queryParams = buildPastorQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<PastorResponse[]>('get', '/pastors/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updatePastor = async ({
  id,
  formData,
}: UpdatePastorOptions): Promise<PastorResponse> => {
  return apiRequest('patch', `/pastors/${id}`, formData);
};

//* Delete
export const inactivatePastor = async (params: InactivatePastorOptions): Promise<void> => {
  const { id, memberInactivationReason, memberInactivationCategory } = params;

  return apiRequest('delete', `/pastors/${id}`, {
    params: { memberInactivationCategory, memberInactivationReason },
  });
};

//* Reports
export const getGeneralPastorsReport = async (params: PastorQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/pastors', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getPastorsReportByFilters = async (params: PastorQueryParams): Promise<boolean> => {
  const term = buildPastorSearchTerm(params);
  const queryParams = buildPastorQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/pastors/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
