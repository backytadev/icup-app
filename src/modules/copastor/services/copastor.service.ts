import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { CopastorSearchType } from '@/modules/copastor/enums/copastor-search-type.enum';
import { type CopastorResponse } from '@/modules/copastor/types/copastor-response.interface';
import { type CopastorFormData } from '@/modules/copastor/types/copastor-form-data.interface';
import { type CopastorQueryParams } from '@/modules/copastor/types/copastor-query-params.interface';

export interface UpdateCopastorOptions {
  id: string;
  formData: CopastorFormData;
}

export interface InactivateCopastorOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

//* Internal helpers (previously in builders/)
const buildCopastorSearchTerm = (params: CopastorQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<CopastorSearchType, string | undefined> = {
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
    [CopastorSearchType.FirstNames]: firstNamesTerm,
    [CopastorSearchType.LastNames]: lastNamesTerm,
    [CopastorSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as CopastorSearchType];
};

const buildCopastorQueryParams = (params: CopastorQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType, searchSubType, churchId } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (searchSubType) base.searchSubType = searchSubType;
  if (churchId) base.churchId = churchId;

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};

//* Create
export const createCopastor = async (formData: CopastorFormData): Promise<CopastorResponse> => {
  return apiRequest('post', '/copastors', formData);
};

//* Find simple
export const getSimpleCopastors = async ({
  churchId,
  isSimpleQuery,
}: {
  churchId?: string;
  isSimpleQuery: boolean;
}): Promise<CopastorResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<CopastorResponse[]>('get', '/copastors', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all
export const getCopastors = async (params: CopastorQueryParams): Promise<CopastorResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<CopastorResponse[]>('get', '/copastors', { params: query });
};

//* Find by filters
export const getCopastorsByFilters = async (
  params: CopastorQueryParams
): Promise<CopastorResponse[]> => {
  const term = buildCopastorSearchTerm(params);
  const queryParams = buildCopastorQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<CopastorResponse[]>('get', '/copastors/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateCopastor = async ({
  id,
  formData,
}: UpdateCopastorOptions): Promise<CopastorResponse> => {
  return apiRequest('patch', `/copastors/${id}`, formData);
};

//* Delete
export const inactivateCopastor = async (params: InactivateCopastorOptions): Promise<void> => {
  const { id, memberInactivationReason, memberInactivationCategory } = params;

  return apiRequest('delete', `/copastors/${id}`, {
    params: { memberInactivationReason, memberInactivationCategory },
  });
};

//* Reports
export const getGeneralCopastorsReport = async (params: CopastorQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/copastors', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getCopastorsReportByTerm = async (params: CopastorQueryParams): Promise<boolean> => {
  const term = buildCopastorSearchTerm(params);
  const queryParams = buildCopastorQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/copastors/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
