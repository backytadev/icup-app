import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type DiscipleResponse } from '@/modules/disciple/types/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/types/disciple-form-data.interface';
import { type DiscipleQueryParams } from '@/modules/disciple/types/disciple-query-params.interface';
import { DiscipleSearchType } from '@/modules/disciple/enums/disciple-search-type.enum';

export interface UpdateDiscipleOptions {
  id: string;
  formData: DiscipleFormData;
}

export interface InactivateDiscipleOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

//* Inline builders
const buildDiscipleSearchTerm = (params: DiscipleQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<DiscipleSearchType, string | undefined> = {
    [DiscipleSearchType.BirthDate]: dateTerm,
    [DiscipleSearchType.BirthMonth]: selectTerm,
    [DiscipleSearchType.Gender]: selectTerm,
    [DiscipleSearchType.MaritalStatus]: selectTerm,
    [DiscipleSearchType.ZoneName]: inputTerm,
    [DiscipleSearchType.FamilyGroupCode]: inputTerm,
    [DiscipleSearchType.FamilyGroupName]: inputTerm,
    [DiscipleSearchType.OriginCountry]: inputTerm,
    [DiscipleSearchType.ResidenceCountry]: inputTerm,
    [DiscipleSearchType.ResidenceDepartment]: inputTerm,
    [DiscipleSearchType.ResidenceProvince]: inputTerm,
    [DiscipleSearchType.ResidenceDistrict]: inputTerm,
    [DiscipleSearchType.ResidenceUrbanSector]: inputTerm,
    [DiscipleSearchType.ResidenceAddress]: inputTerm,
    [DiscipleSearchType.RecordStatus]: selectTerm,
    [DiscipleSearchType.FirstNames]: firstNamesTerm,
    [DiscipleSearchType.LastNames]: lastNamesTerm,
    [DiscipleSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as DiscipleSearchType];
};

const buildDiscipleQueryParams = (params: DiscipleQueryParams, term?: string) => {
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
export const createDisciple = async (formData: DiscipleFormData): Promise<DiscipleResponse> => {
  return apiRequest('post', '/disciples', formData);
};

//* Find simple
export const getSimpleDisciples = async ({
  isSimpleQuery,
  churchId,
}: {
  isSimpleQuery: true;
  churchId?: string;
}): Promise<DiscipleResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<DiscipleResponse[]>('get', '/disciples', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all
export const getDisciples = async (params: DiscipleQueryParams): Promise<DiscipleResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<DiscipleResponse[]>('get', '/disciples', { params: query });
};

//* Find by filters
export const getDisciplesByFilters = async (
  params: DiscipleQueryParams
): Promise<DiscipleResponse[]> => {
  const term = buildDiscipleSearchTerm(params);
  const queryParams = buildDiscipleQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<DiscipleResponse[]>('get', '/disciples/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateDisciple = async ({
  id,
  formData,
}: UpdateDiscipleOptions): Promise<DiscipleResponse> => {
  return apiRequest('patch', `/disciples/${id}`, formData);
};

//* Delete
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

//* Reports
export const getGeneralDisciplesReport = async (params: DiscipleQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/disciples', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getDisciplesReportByTerm = async (params: DiscipleQueryParams): Promise<boolean> => {
  const term = buildDiscipleSearchTerm(params);
  const queryParams = buildDiscipleQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/disciples/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
