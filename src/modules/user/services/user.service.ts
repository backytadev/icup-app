/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { UserSearchType } from '@/modules/user/enums/user-search-type.enum';
import { type UserResponse } from '@/modules/user/interfaces/user-response.interface';
import { type UserFormData } from '@/modules/user/interfaces/user-form-data.interface';
import { type UserQueryParams } from '@/modules/user/interfaces/user-query-params.interface';
import { type UserPasswordUpdateFormData } from '@/modules/user/interfaces/user-password-update-form-data.interface';

//? CREATE USER
export const createUser = async (formData: UserFormData): Promise<UserResponse> => {
  try {
    const { data } = await icupApi.post<UserResponse>('/users', formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//? GET USERS (paginated)
export const getUsers = async ({
  limit,
  offset,
  all,
  order,
}: UserQueryParams): Promise<UserResponse[]> => {
  let result: UserResponse[];

  try {
    if (!all) {
      const { data } = await icupApi<UserResponse[]>('/users', {
        params: {
          limit,
          offset,
          order,
        },
      });

      result = data;
    } else {
      const { data } = await icupApi<UserResponse[]>('/users', {
        params: {
          order,
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

//? GET USERS BY TERM (paginated)
export const getUsersByTerm = async ({
  multiSelectTerm,
  searchType,
  selectTerm,
  firstNamesTerm,
  lastNamesTerm,
  limit,
  offset,
  all,
  order,
}: UserQueryParams): Promise<UserResponse[] | undefined> => {
  let result: UserResponse[];

  //* Multi Select (roles)
  if (searchType === UserSearchType.Roles) {
    try {
      if (!all) {
        const { data } = await icupApi<UserResponse[]>(`/users/${multiSelectTerm}`, {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<UserResponse[]>(`/users/${selectTerm}`, {
          params: {
            order,
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

  //* Record status and gender
  if (searchType === UserSearchType.RecordStatus || searchType === UserSearchType.Gender) {
    try {
      if (!all) {
        const { data } = await icupApi<UserResponse[]>(`/users/${selectTerm}`, {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<UserResponse[]>(`/users/${selectTerm}`, {
          params: {
            order,
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

  //* First Name
  if (searchType === UserSearchType.FirstNames) {
    try {
      if (!all) {
        const { data } = await icupApi<UserResponse[]>(`/users/${firstNamesTerm}`, {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<UserResponse[]>(`/users/${firstNamesTerm}`, {
          params: {
            order,
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

  //* Last Name
  if (searchType === UserSearchType.LastNames) {
    try {
      if (!all) {
        const { data } = await icupApi<UserResponse[]>(`/users/${lastNamesTerm}`, {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        });

        result = data;
      } else {
        const { data } = await icupApi<UserResponse[]>(`/users/${lastNamesTerm}`, {
          params: {
            order,
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

  //* Full Name
  if (searchType === UserSearchType.FullName) {
    try {
      if (!all) {
        const { data } = await icupApi<UserResponse[]>(
          `/users/${firstNamesTerm}-${lastNamesTerm}`,
          {
            params: {
              limit,
              offset,
              order,
              searchType,
            },
          }
        );

        result = data;
      } else {
        const { data } = await icupApi<UserResponse[]>(
          `/users/${firstNamesTerm}-${lastNamesTerm}`,
          {
            params: {
              order,
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

//? UPDATE USER BY ID
export interface UpdateUserOptions {
  id: string;
  formData: UserFormData | UserPasswordUpdateFormData;
}

export const updateUser = async ({ id, formData }: UpdateUserOptions): Promise<UserResponse> => {
  try {
    const { data } = await icupApi.patch<UserResponse>(`/users/${id}`, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw error.response.data;
    }

    throw new Error('Ocurrió un error inesperado');
  }
};

//! INACTIVATE USER BY ID
export interface InactivateUserOptions {
  id: string;
  userInactivationCategory: string;
  userInactivationReason: string;
}

export const inactivateUser = async ({
  id,
  userInactivationCategory,
  userInactivationReason,
}: InactivateUserOptions): Promise<void> => {
  try {
    const { data } = await icupApi.delete(`/users/${id}`, {
      params: {
        userInactivationCategory,
        userInactivationReason,
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

//? USER REPORTS
const openPdfInNewTab = (pdfBlob: Blob): void => {
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newTab = window.open(pdfUrl, '_blank');
  newTab?.focus();
};

//* General
export const getGeneralUsersReport = async ({
  limit,
  offset,
  all,
  order,
}: UserQueryParams): Promise<boolean> => {
  try {
    if (!all) {
      const res = await icupApi<Blob>('/reports/users', {
        params: {
          limit,
          offset,
          order,
        },
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      });

      openPdfInNewTab(res.data);

      return true;
    } else {
      const res = await icupApi<Blob>('/reports/users', {
        params: {
          order,
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
export const getUsersReportByTerm = async ({
  searchType,
  selectTerm,
  firstNamesTerm,
  lastNamesTerm,
  multiSelectTerm,
  limit,
  offset,
  all,
  order,
}: UserQueryParams): Promise<boolean> => {
  let newTerm: string | undefined = '';

  const termMapping: Record<UserSearchType, string | undefined> = {
    [UserSearchType.FirstNames]: firstNamesTerm,
    [UserSearchType.LastNames]: lastNamesTerm,
    [UserSearchType.FullName]: `${firstNamesTerm}-${lastNamesTerm}`,
    [UserSearchType.Gender]: selectTerm,
    [UserSearchType.Roles]: multiSelectTerm,
    [UserSearchType.RecordStatus]: selectTerm,
  };

  newTerm = termMapping[searchType as UserSearchType];

  try {
    if (!all) {
      const res = await icupApi<Blob>(`/reports/users/${newTerm}`, {
        params: {
          limit,
          offset,
          order,
          searchType,
        },
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'blob',
      });

      openPdfInNewTab(res.data);

      return true;
    } else {
      const res = await icupApi<Blob>(`/reports/users/${newTerm}`, {
        params: {
          order,
          searchType,
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
