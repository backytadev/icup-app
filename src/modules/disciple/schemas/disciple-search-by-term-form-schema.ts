/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { DiscipleSearchType } from '@/modules/disciple/enums/disciple-search-type.enum';
import { DiscipleSearchSubType } from '@/modules/disciple/enums/disciple-search-sub-type.enum';

export const discipleSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(DiscipleSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

    searchSubType: z
      .nativeEnum(DiscipleSearchSubType, {
        message: 'El sub-tipo de búsqueda es requerido.',
        required_error: 'El sub-tipo de búsqueda es requerido.',
      })
      .optional(),

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
      if (
        data.searchType === DiscipleSearchType.FirstNames ||
        data.searchType === DiscipleSearchType.LastNames ||
        data.searchType === DiscipleSearchType.FullNames
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
      if (data.searchType === DiscipleSearchType.FirstNames) {
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
      if (data.searchType === DiscipleSearchType.LastNames) {
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
      if (data.searchType === DiscipleSearchType.FullNames) {
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
      if (data.searchType === DiscipleSearchType.FullNames) {
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
        data.searchType === DiscipleSearchType.OriginCountry ||
        data.searchType === DiscipleSearchType.FamilyGroupCode ||
        data.searchType === DiscipleSearchType.FamilyGroupName ||
        data.searchType === DiscipleSearchType.ZoneName ||
        data.searchType === DiscipleSearchType.ResidenceCountry ||
        data.searchType === DiscipleSearchType.ResidenceDepartment ||
        data.searchType === DiscipleSearchType.ResidenceProvince ||
        data.searchType === DiscipleSearchType.ResidenceDistrict ||
        data.searchType === DiscipleSearchType.ResidenceUrbanSector ||
        data.searchType === DiscipleSearchType.ResidenceAddress
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
        data.searchType === DiscipleSearchType.BirthMonth ||
        data.searchType === DiscipleSearchType.Gender ||
        data.searchType === DiscipleSearchType.MaritalStatus ||
        data.searchType === DiscipleSearchType.RecordStatus
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
      if (data.searchType === DiscipleSearchType.BirthDate) {
        return !!data.dateTerm;
      }
      return true;
    },
    {
      message: 'La fecha o rango de fechas es requerido.',
      path: ['dateTerm'],
    }
  );
