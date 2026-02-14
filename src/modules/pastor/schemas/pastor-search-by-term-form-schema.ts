/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { PastorSearchType } from '@/modules/pastor/enums/pastor-search-type.enum';

export const pastorSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(PastorSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

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
      if (data.searchType === PastorSearchType.FirstNames) {
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
      if (data.searchType === PastorSearchType.LastNames) {
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
      if (data.searchType === PastorSearchType.FullNames) {
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
      if (data.searchType === PastorSearchType.FullNames) {
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
        data.searchType === PastorSearchType.OriginCountry ||
        data.searchType === PastorSearchType.ResidenceCountry ||
        data.searchType === PastorSearchType.ResidenceDepartment ||
        data.searchType === PastorSearchType.ResidenceProvince ||
        data.searchType === PastorSearchType.ResidenceDistrict ||
        data.searchType === PastorSearchType.ResidenceUrbanSector ||
        data.searchType === PastorSearchType.ResidenceAddress
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
        data.searchType === PastorSearchType.BirthMonth ||
        data.searchType === PastorSearchType.Gender ||
        data.searchType === PastorSearchType.MaritalStatus ||
        data.searchType === PastorSearchType.RecordStatus
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
      if (data.searchType === PastorSearchType.BirthDate) {
        return !!data.dateTerm;
      }
      return true;
    },
    {
      message: 'La fecha o rango de fechas es requerido.',
      path: ['dateTerm'],
    }
  );
