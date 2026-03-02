import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { PreacherSearchType } from '@/modules/preacher/enums/preacher-search-type.enum';
import { PreacherSearchSubType } from '@/modules/preacher/enums/preacher-search-sub-type.enum';

export const preacherSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(PreacherSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

    searchSubType: z
      .nativeEnum(PreacherSearchSubType, {
        message: 'El sui-tipo de búsqueda es requerido.',
        required_error: 'El sui-tipo de búsqueda es requerido.',
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
        required_error: 'Debe seleccionar una opción.',
      })
    ),

    churchId: z.string().max(40).optional(),
    all: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.searchType === PreacherSearchType.FirstNames ||
        data.searchType === PreacherSearchType.LastNames ||
        data.searchType === PreacherSearchType.FullNames
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
      if (data.searchType === PreacherSearchType.FirstNames) {
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
      if (data.searchType === PreacherSearchType.LastNames) {
        return !!data.lastNamesTerm;
      }
      return true;
    },
    {
      message: 'El apellido es requerido.',
      path: ['lastNamesTerm'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === PreacherSearchType.FullNames) {
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
      if (data.searchType === PreacherSearchType.FullNames) {
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
        data.searchType === PreacherSearchType.OriginCountry ||
        data.searchType === PreacherSearchType.ZoneName ||
        data.searchType === PreacherSearchType.FamilyGroupCode ||
        data.searchType === PreacherSearchType.FamilyGroupName ||
        data.searchType === PreacherSearchType.ResidenceCountry ||
        data.searchType === PreacherSearchType.ResidenceDepartment ||
        data.searchType === PreacherSearchType.ResidenceProvince ||
        data.searchType === PreacherSearchType.ResidenceDistrict ||
        data.searchType === PreacherSearchType.ResidenceUrbanSector ||
        data.searchType === PreacherSearchType.ResidenceAddress
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
        data.searchType === PreacherSearchType.BirthMonth ||
        data.searchType === PreacherSearchType.Gender ||
        data.searchType === PreacherSearchType.MaritalStatus ||
        data.searchType === PreacherSearchType.RecordStatus
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
      if (data.searchType === PreacherSearchType.BirthDate) {
        return !!data.dateTerm;
      }
      return true;
    },
    {
      message: 'La fecha o rango de fechas es requerido.',
      path: ['dateTerm'],
    }
  );
