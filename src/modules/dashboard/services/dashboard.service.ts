/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { isAxiosError } from 'axios';

import { icupApi } from '@/core/api/icupApi';

import { DashboardSearchType } from '@/modules/dashboard/enums/dashboard-search-type.enum';
import { type FamilyGroupResponse } from '@/modules/family-group/interfaces/family-group-response.interface';

import { type DashboardQueryParams } from '@/modules/dashboard/interfaces/dashboard-query-params.interface';
import { type LastSundaysOfferingsResponse } from '@/modules/dashboard/interfaces/last-sundays-offerings-response';
import { type TopFamilyGroupsOfferingsResponse } from '@/modules/dashboard/interfaces/top-family-groups-offerings-response';

//? Get offering income by term (paginated)
export const getOfferingsForBarChartByTerm = async ({
  searchType,
  churchId,
  year,
  date,
  limit,
  offset,
  order,
}: DashboardQueryParams): Promise<
  LastSundaysOfferingsResponse[] | TopFamilyGroupsOfferingsResponse[] | undefined
> => {
  //* Latest sunday offerings
  if (searchType === DashboardSearchType.LastSundaysOfferings) {
    try {
      const { data } = await icupApi<LastSundaysOfferingsResponse[]>(
        `/metrics/${date}&${churchId}`,
        {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        }
      );

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }

  //* Top family groups offerings
  if (searchType === DashboardSearchType.TopFamilyGroupsOfferings) {
    try {
      const { data } = await icupApi<TopFamilyGroupsOfferingsResponse[]>(
        `/metrics/${year}&${churchId}`,
        {
          params: {
            limit,
            offset,
            order,
            searchType,
          },
        }
      );

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }
};

//? Get proportion family groups
export const getProportionFamilyGroups = async ({
  searchType,
  populationLevel,
  churchId,
  order,
}: DashboardQueryParams): Promise<FamilyGroupResponse[] | undefined> => {
  //* Most populated family groups
  if (searchType === DashboardSearchType.MostPopulatedFamilyGroups) {
    try {
      const { data } = await icupApi<FamilyGroupResponse[]>(`/family-groups/search`, {
        params: {
          order,
          term: populationLevel,
          churchId,
          searchType,
        },
      });

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }

  //* Less populated family groups
  if (searchType === DashboardSearchType.LessPopulatedFamilyGroups) {
    try {
      const { data } = await icupApi<FamilyGroupResponse[]>(`/family-groups/search`, {
        params: {
          order,
          term: populationLevel,
          churchId,
          searchType,
        },
      });

      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw error.response.data;
      }

      throw new Error('Ocurrió un error inesperado, hable con el administrador');
    }
  }
};
