import { apiRequest } from '@/shared/helpers/api-request';
import { RecordOrder } from '@/shared/enums/record-order.enum';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';

import { buildFamilyGroupSearchTerm } from '@/modules/family-group/builders/buildFamilyGroupSearchTerm';
import { buildFamilyGroupQueryParams } from '@/modules/family-group/builders/buildFamilyGroupQueryParam';
import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';
import { type FamilyGroupFormData } from '@/modules/family-group/interfaces/family-group-form-data.interface';
import { type FamilyGroupQueryParams } from '@/modules/family-group/interfaces/family-group-query-params.interface';
import { type FamilyGroupPreacherUpdateFormData } from '@/modules/family-group/interfaces/family-group-preacher-update-form-data.interface';

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
  return apiRequest<FamilyGroupResponse[]>('get', '/family-groups', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId,
    },
  });
};

//* Find all
export const getFamilyGroups = async (
  params: FamilyGroupQueryParams
): Promise<FamilyGroupResponse[]> => {
  const { limit, offset, order, all, churchId } = params;

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  return apiRequest<FamilyGroupResponse[]>('get', '/family-groups', { params: query });
};

//* Find by filters
export const getFamilyGroupsByFilters = async (
  params: FamilyGroupQueryParams
): Promise<FamilyGroupResponse[]> => {
  const term = buildFamilyGroupSearchTerm(params);
  const queryParams = buildFamilyGroupQueryParams(params, term);

  return apiRequest<FamilyGroupResponse[]>('get', '/family-groups/search', { params: queryParams });
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

  const query = all ? { order } : { limit, offset, order };

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

  const pdf = await apiRequest<Blob>('get', '/reports/family-groups/search', {
    params: queryParams,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
