/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { ZoneSearchType } from '@/modules/zone/enums/zone-search-type.enum';
import {  ZoneSearchSubType } from '@/modules/zone/enums/zone-search-sub-type.enum';

export const zoneSearchByTermFormSchema = z 
  .object({
    searchType: z.nativeEnum(ZoneSearchType,{
      required_error: "Por favor seleccione un tipo.",
    }),

    searchSubType: z.nativeEnum(ZoneSearchSubType ,{
      message: 'Por favor seleccione una opción.',
      required_error: "Por favor seleccione una opción.",
    }).optional(),
    
    inputTerm: z.string().max(30).optional(),

    selectTerm: z.string().max(30).optional(),

    firstNamesTerm: z.string().max(30).optional(),

    lastNamesTerm: z.string().max(30).optional(),

    limit: z.string().refine(limit => {
      return /^\d+$/.test(limit);
    }, {
      message: 'El límite debe ser un número positivo'
    }).refine(limit => {
      const parsedLimit = parseInt(limit);
      return !isNaN(parsedLimit) && parsedLimit > 0;
    }, {
      message: 'El límite debe ser un número mayor a 0'
    }).optional(),

    order: z.string(z.nativeEnum(RecordOrder, {
      required_error: "Seleccione un orden para al consulta.",
    })),

    churchId: z.string().max(40).optional(),

    all: z.boolean().optional(),
   
  })
  .refine(
    (data) => {
      if (
        data.searchType === ZoneSearchType.FirstNames || 
        data.searchType === ZoneSearchType.LastNames || 
        data.searchType === ZoneSearchType.FullNames 
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
      if (
        data.searchType === ZoneSearchType.FirstNames
      ) {
        return !!data.firstNamesTerm; 
      }
      return true;
    },
    {
      message: 'El nombre es requerido.',
      path: ['namesTerm'],
    }
  )
  .refine(
    (data) => {
      if (
        data.searchType === ZoneSearchType.LastNames
      ) {
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
      if (
        data.searchType === ZoneSearchType.FullNames
      ) {
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
      if (
        data.searchType === ZoneSearchType.FullNames
      ) {
        return !!data.firstNamesTerm; 
      }
      return true;
    },
    {
      message: 'El apellido es requerido.',
      path: ['namesTerm'],
    }
  )
  .refine(
    (data) => {
      if (data.searchType === ZoneSearchType.ZoneName ||
        data.searchType === ZoneSearchType.Country ||
        data.searchType === ZoneSearchType.Department ||
        data.searchType === ZoneSearchType.Province ||
        data.searchType === ZoneSearchType.District
        ) {
        return !!data.inputTerm; 
      }
      return true;
    },
    {
      message: 'El Término es requerido.',
      path: ['inputTerm'],
    }
  )
  .refine(
    (data) => {
      if (
          data.searchType === ZoneSearchType.RecordStatus
        ) {
        return !!data.selectTerm; 
      }
      return true;
    },
    {
      message: 'Por favor seleccione una opción.',
      path: ['selectTerm'],
    }
  )
  

  

