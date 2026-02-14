import { apiRequest } from '@/shared/helpers/api-request';

import { buildUserSearchTerm } from '@/modules/user/utils/buildUserSearchTerm';
import { buildUserQueryParams } from '@/modules/user/utils/buildUserQueryParam';

import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';

import { type UserResponse } from '@/modules/user/types/user-response.interface';
import { type UserFormData } from '@/modules/user/types/user-form-data.interface';
import { type UserQueryParams } from '@/modules/user/types/user-query-params.interface';
import { type UserPasswordUpdateFormData } from '@/modules/user/types/user-password-update-form-data.interface';

export interface UpdateUserOptions {
  id: string;
  formData: UserFormData | UserPasswordUpdateFormData;
}

export interface InactivateUserOptions {
  id: string;
  userInactivationCategory: string;
  userInactivationReason: string;
}

//* Create
export const createUser = async (formData: UserFormData): Promise<UserResponse> =>
  apiRequest('post', '/users', formData);

//* Find all
export const getAllUsers = async (params: UserQueryParams): Promise<UserResponse[]> => {
  const { limit, offset, order, all } = params;

  const query = all ? { order } : { limit, offset, order };

  return apiRequest<UserResponse[]>('get', '/users', { params: query });
};

//* Find by filters
export const getUsersByFilters = async (params: UserQueryParams): Promise<UserResponse[]> => {
  const term = buildUserSearchTerm(params);
  const queryParams = buildUserQueryParams(params, term);

  return apiRequest<UserResponse[]>('get', '/users/search', { params: queryParams });
};

//* Update
export const updateUser = async ({ id, formData }: UpdateUserOptions): Promise<UserResponse> =>
  apiRequest('patch', `/users/${id}`, formData);

//* Delete (inactivate)
export const inactivateUser = async (params: InactivateUserOptions): Promise<void> => {
  const { id, userInactivationCategory, userInactivationReason } = params;

  return apiRequest('delete', `/users/${id}`, {
    params: { userInactivationCategory, userInactivationReason },
  });
};

//* Reports
export const getGeneralUsersReport = async (params: UserQueryParams): Promise<boolean> => {
  const { limit, offset, order, all } = params;

  const query = all ? { order } : { limit, offset, order };

  const pdf = await apiRequest<Blob>('get', '/reports/users', {
    params: query,
    responseType: 'blob',
  });

  openPdfInNewTab(pdf);
  return true;
};

export const getUsersReportByFilters = async (params: UserQueryParams): Promise<boolean> => {
  const term = buildUserSearchTerm(params);
  const queryParams = buildUserQueryParams(params, term);

  const pdf = await apiRequest<Blob>('get', '/reports/users/search', {
    params: queryParams,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
