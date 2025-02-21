/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { FamilyGroupSearchType } from '@/modules/family-group/enums/family-group-search-type.enum';
import { FamilyGroupSearchSubType } from '@/modules/family-group/enums/family-group-search-sub-type.enum';

export const familyGroupSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(FamilyGroupSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

    searchSubType: z
      .nativeEnum(FamilyGroupSearchSubType, {
        message: 'El sub-tipo de búsqueda es requerido.',
        required_error: 'El sub-tipo de búsqueda es requerido.',
      })
      .optional(),

    inputTerm: z.string().max(30).optional(),

    selectTerm: z.string().max(30).optional(),

    firstNamesTerm: z.string().max(30).optional(),

    lastNamesTerm: z.string().max(30).optional(),

    limit: z
      .string()
      .refine(
        (limit) => {
          return /^\d+$/.test(limit);
        },
        {
          message: 'El límite debe ser un número mayor a 0.',
        }
      )
      .refine(
        (limit) => {
          const parsedLimit = parseInt(limit);
          return !isNaN(parsedLimit) && parsedLimit > 0;
        },
        {
          message: 'El límite debe ser un número mayor a 0.',
        }
      )
      .optional(),

    order: z.string(
      z.nativeEnum(RecordOrder, {
        required_error: 'El orden de registros es requerido.',
      })
    ),

    churchId: z.string().max(40).optional(),

    all: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.searchType === FamilyGroupSearchType.FirstNames ||
        data.searchType === FamilyGroupSearchType.LastNames ||
        data.searchType === FamilyGroupSearchType.FullNames
      ) {
        return !!data.searchSubType;
      }
      return true;
    },
    {
      message: 'El sub-tipo es requerido.',
      path: ['searchSubType'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === FamilyGroupSearchType.FirstNames) {
        return !!data.firstNamesTerm;
      }
      return true;
    },
    {
      message: 'El nombre es requerido.',
      path: ['firstNamesTerm'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === FamilyGroupSearchType.LastNames) {
        return !!data.lastNamesTerm;
      }
      return true;
    },
    {
      message: 'El apellido es requerido.',
      path: ['lastNamesTerm'],
    }
  )
  //* Full name
  .refine(
    (data) => {
      if (data.searchType === FamilyGroupSearchType.FullNames) {
        return !!data.lastNamesTerm;
      }
      return true;
    },
    {
      message: 'El nombre es requerido.',
      path: ['lastNamesTerm'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === FamilyGroupSearchType.FullNames) {
        return !!data.firstNamesTerm;
      }
      return true;
    },
    {
      message: 'El apellido es requerido.',
      path: ['firstNamesTerm'],
    }
  )
  .refine(
    (data) => {
      if (
        data.searchType === FamilyGroupSearchType.Country ||
        data.searchType === FamilyGroupSearchType.Department ||
        data.searchType === FamilyGroupSearchType.Province ||
        data.searchType === FamilyGroupSearchType.District ||
        data.searchType === FamilyGroupSearchType.UrbanSector ||
        data.searchType === FamilyGroupSearchType.Address
      ) {
        return !!data.inputTerm;
      }
      return true;
    },
    {
      message: 'El término de búsqueda es requerido.',
      path: ['inputTerm'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === FamilyGroupSearchType.RecordStatus) {
        return !!data.selectTerm;
      }
      return true;
    },
    {
      message: 'El término de búsqueda es requerido.',
      path: ['selectTerm'],
    }
  );
