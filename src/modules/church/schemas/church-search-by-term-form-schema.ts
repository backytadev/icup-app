/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { ChurchSearchType } from '@/modules/church/enums/church-search-type.enum';

export const churchSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(ChurchSearchType, {
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

    all: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (
        data.searchType === ChurchSearchType.ChurchName ||
        data.searchType === ChurchSearchType.Department ||
        data.searchType === ChurchSearchType.Province ||
        data.searchType === ChurchSearchType.District ||
        data.searchType === ChurchSearchType.UrbanSector ||
        data.searchType === ChurchSearchType.Address
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
      if (data.searchType === ChurchSearchType.RecordStatus) {
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
      if (data.searchType === ChurchSearchType.FoundingDate) {
        return !!data.dateTerm;
      }
      return true;
    },
    {
      message: 'La fecha o rango de fechas es requerida.',
      path: ['dateTerm'],
    }
  );
