/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { MinistrySearchType } from '@/modules/ministry/enums/ministry-search-type.enum';
import { MinistrySearchSubType } from '@/modules/ministry/enums/ministry-search-sub-type.enum';

export const ministrySearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(MinistrySearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

    searchSubType: z
      .nativeEnum(MinistrySearchSubType, {
        message: 'El sub-tipo de búsqueda es requerido.',
        required_error: 'El sub-tipo de búsqueda es requerido.',
      })
      .optional(),

    firstNamesTerm: z.string().max(30).optional(),

    lastNamesTerm: z.string().max(30).optional(),

    inputTerm: z.string().max(30).optional(),
    selectTerm: z.string().max(30).optional(),

    dateTerm: z
      .object(
        { from: z.date(), to: z.date().optional() },
        {
          required_error: 'La fecha o rango de fechas es requerida.',
        }
      )
      .optional(),

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
        required_error: 'El orden de los registros es requerido.',
      })
    ),

    churchId: z.string().max(40).optional(),

    all: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.searchType === MinistrySearchType.FirstNames ||
        data.searchType === MinistrySearchType.LastNames ||
        data.searchType === MinistrySearchType.FullNames
      ) {
        return !!data.searchSubType;
      }
      return true;
    },
    {
      message: 'El sub-tipo de búsqueda es requerido.',
      path: ['searchSubType'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === MinistrySearchType.FirstNames) {
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
      if (data.searchType === MinistrySearchType.LastNames) {
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
      if (data.searchType === MinistrySearchType.FullNames) {
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
      if (data.searchType === MinistrySearchType.FullNames) {
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
        data.searchType === MinistrySearchType.MinistryCustomName ||
        data.searchType === MinistrySearchType.Department ||
        data.searchType === MinistrySearchType.Province ||
        data.searchType === MinistrySearchType.District ||
        data.searchType === MinistrySearchType.UrbanSector ||
        data.searchType === MinistrySearchType.Address
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
      if (
        data.searchType === MinistrySearchType.RecordStatus ||
        data.searchType === MinistrySearchType.MinistryType
      ) {
        return !!data.selectTerm;
      }
      return true;
    },
    {
      message: 'El término de búsqueda es requerido.',
      path: ['selectTerm'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === MinistrySearchType.FoundingDate) {
        return !!data.dateTerm;
      }
      return true;
    },
    {
      message: 'La fecha o rango de fechas es requerida.',
      path: ['dateTerm'],
    }
  );
