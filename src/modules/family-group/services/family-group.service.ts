import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { FamilyGroupSearchType } from '@/modules/family-group/enums/family-group-search-type.enum';
import { type FamilyGroupResponse } from '@/modules/family-group/types/family-group-response.interface';

import { type FamilyGroupFormData } from '@/modules/family-group/types/family-group-form-data.interface';
import { type FamilyGroupQueryParams } from '@/modules/family-group/types/family-group-query-params.interface';
import { type FamilyGroupPreacherUpdateFormData } from '@/modules/family-group/types/family-group-preacher-update-form-data.interface';

//* Private helpers (internalized from builders/)
const buildFamilyGroupSearchTerm = (params: FamilyGroupQueryParams): string | undefined => {
  const { searchType, inputTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<FamilyGroupSearchType, string | undefined> = {
    [FamilyGroupSearchType.FamilyGroupName]: inputTerm,
    [FamilyGroupSearchType.FamilyGroupCode]: inputTerm,
    [FamilyGroupSearchType.ZoneName]: inputTerm,
    [FamilyGroupSearchType.Country]: inputTerm,
    [FamilyGroupSearchType.Department]: inputTerm,
    [FamilyGroupSearchType.Province]: inputTerm,
    [FamilyGroupSearchType.District]: inputTerm,
    [FamilyGroupSearchType.UrbanSector]: inputTerm,
    [FamilyGroupSearchType.Address]: inputTerm,
    [FamilyGroupSearchType.RecordStatus]: selectTerm,
    [FamilyGroupSearchType.FirstNames]: firstNamesTerm,
    [FamilyGroupSearchType.LastNames]: lastNamesTerm,
    [FamilyGroupSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as FamilyGroupSearchType];
};

const buildFamilyGroupQueryParams = (params: FamilyGroupQueryParams, term?: string) => {
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

export interface UpdateFamilyGroupOptions {
  id: string;
  formData: FamilyGroupFormData | FamilyGroupPreacherUpdateFormData;
}

export interface InactivateFamilyGroupOptions {
  id: string;
  familyGroupInactivationCategory: string;
  familyGroupInactivationReason: string;
}

//* Create
export const createFamilyGroup = async (
  formData: FamilyGroupFormData
): Promise<FamilyGroupResponse> => {
  return apiRequest('post', '/family-groups', formData);
};

//* Find simple
export const getSimpleFamilyGroups = async ({
  churchId,
  isSimpleQuery,
}: {
  isSimpleQuery: boolean;
  churchId?: string;
}): Promise<FamilyGroupResponse[]> => {
  const { churchId: contextChurchId } = getContextParams();
  return apiRequest<FamilyGroupResponse[]>('get', '/family-groups', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId: churchId ?? contextChurchId,
    },
  });
};

//* Find all
export const getFamilyGroups = async (
  params: FamilyGroupQueryParams
): Promise<FamilyGroupResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<FamilyGroupResponse[]>('get', '/family-groups', { params: query });
};

//* Find by filters
export const getFamilyGroupsByFilters = async (
  params: FamilyGroupQueryParams
): Promise<FamilyGroupResponse[]> => {
  const term = buildFamilyGroupSearchTerm(params);
  const queryParams = buildFamilyGroupQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<FamilyGroupResponse[]>('get', '/family-groups/search', {
    params: { ...queryParams, churchId },
  });
};

//* Update
export const updateFamilyGroup = async ({
  id,
  formData,
}: UpdateFamilyGroupOptions): Promise<FamilyGroupResponse> => {
  return apiRequest('patch', `/family-groups/${id}`, formData);
};

//* Delete
export const inactivateFamilyGroup = async (
  params: InactivateFamilyGroupOptions
): Promise<void> => {
  const { id, familyGroupInactivationCategory, familyGroupInactivationReason } = params;

  return apiRequest('delete', `/family-groups/${id}`, {
    params: { familyGroupInactivationCategory, familyGroupInactivationReason },
  });
};

//* Reports
export const getGeneralFamilyGroupsReport = async (
  params: FamilyGroupQueryParams
): Promise<boolean> => {
  const { limit, offset, order, all } = params;
  const { churchId } = getContextParams();

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  const pdf = await apiRequest<Blob>('get', '/reports/family-groups', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getFamilyGroupsReportByTerm = async (
  params: FamilyGroupQueryParams
): Promise<boolean> => {
  const term = buildFamilyGroupSearchTerm(params);
  const queryParams = buildFamilyGroupQueryParams(params, term);
  const { churchId } = getContextParams();

  const pdf = await apiRequest<Blob>('get', '/reports/family-groups/search', {
    params: { ...queryParams, churchId },
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
