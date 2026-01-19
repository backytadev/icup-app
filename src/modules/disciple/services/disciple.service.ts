import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { apiRequest } from '@/shared/helpers/api-request';
import { openPdfInNewTab } from '@/shared/helpers/open-pdf-tab';

import { type DiscipleResponse } from '@/modules/disciple/interfaces/disciple-response.interface';
import { type DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';
import { type DiscipleQueryParams } from '@/modules/disciple/interfaces/disciple-query-params.interface';
import { buildDiscipleSearchTerm } from '@/modules/disciple/builders/buildDiscipleSearchTerm';
import { buildDiscipleQueryParams } from '@/modules/disciple/builders/buildDiscipleQueryParam';

export interface UpdateDiscipleOptions {
  id: string;
  formData: DiscipleFormData;
}

export interface InactivateDiscipleOptions {
  id: string;
  memberInactivationCategory: string;
  memberInactivationReason: string;
}

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
  return apiRequest<DiscipleResponse[]>('get', '/disciples', {
    params: {
      order: RecordOrder.Ascending,
      isSimpleQuery: isSimpleQuery.toString(),
      churchId,
    },
  });
};

//* Find all
export const getDisciples = async (params: DiscipleQueryParams): Promise<DiscipleResponse[]> => {
  const { limit, offset, order, all, churchId } = params;

  const query = all ? { order, churchId } : { limit, offset, order, churchId };

  return apiRequest<DiscipleResponse[]>('get', '/disciples', { params: query });
};

//* Find by filters
export const getDisciplesByFilters = async (
  params: DiscipleQueryParams
): Promise<DiscipleResponse[]> => {
  const term = buildDiscipleSearchTerm(params);
  const queryParams = buildDiscipleQueryParams(params, term);

  return apiRequest<DiscipleResponse[]>('get', '/disciples/search', { params: queryParams });
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

  const query = all ? { order } : { limit, offset, order };

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

  const pdf = await apiRequest<Blob>('get', '/reports/disciples/search', {
    params: queryParams,
    responseType: 'blob',
    headers: { 'Content-Type': 'application/pdf' },
  });

  openPdfInNewTab(pdf);

  return true;
};
