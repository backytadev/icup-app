/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { UserRole } from '@/modules/user/enums/user-role.enum';
import { UserSearchType } from '@/modules/user/enums/user-search-type.enum';

export const userSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(UserSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

    multiSelectTerm: z
      .array(z.nativeEnum(UserRole), {
        required_error: 'Debes seleccionar al menos un rol.',
      })
      .refine((value) => value.some((item) => item), {
        message: 'Debes seleccionar al menos un rol.',
      })
      .optional(),

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
        required_error: 'Debe seleccionar una opción.',
      })
    ),

    all: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.searchType === UserSearchType.FirstNames) {
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
      if (data.searchType === UserSearchType.LastNames) {
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
      if (data.searchType === UserSearchType.FullNames) {
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
      if (data.searchType === UserSearchType.FullNames) {
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
        data.searchType === UserSearchType.Gender ||
        data.searchType === UserSearchType.RecordStatus
      ) {
        return !!data.selectTerm;
      }
      return true;
    },
    {
      message: 'El termino de búsqueda es requerido.',
      path: ['selectTerm'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === UserSearchType.Roles) {
        return !!data.multiSelectTerm;
      }
      return true;
    },
    {
      message: 'Debes seleccionar al menos un rol.',
      path: ['multiSelectTerm'],
    }
  );
