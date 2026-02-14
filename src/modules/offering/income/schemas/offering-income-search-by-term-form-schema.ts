/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { OfferingIncomeSearchType } from '@/modules/offering/income/enums/offering-income-search-type.enum';
import { OfferingIncomeSearchSubType } from '@/modules/offering/income/enums/offering-income-search-sub-type.enum';

export const offeringIncomeSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(OfferingIncomeSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

    searchSubType: z
      .nativeEnum(OfferingIncomeSearchSubType, {
        message: 'El sub-tipo de búsqueda es requerido.',
        required_error: 'El sub-tipo de búsqueda es requerido.',
      })
      .optional(),

    inputTerm: z.string().max(30).optional(),
    selectTerm: z.string().max(40).optional(),

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
        data.searchType === OfferingIncomeSearchType.Activities ||
        data.searchType === OfferingIncomeSearchType.ChurchGround ||
        data.searchType === OfferingIncomeSearchType.FamilyGroup ||
        data.searchType === OfferingIncomeSearchType.GeneralFasting ||
        data.searchType === OfferingIncomeSearchType.GeneralVigil ||
        data.searchType === OfferingIncomeSearchType.IncomeAdjustment ||
        data.searchType === OfferingIncomeSearchType.Special ||
        // data.searchType === OfferingIncomeSearchType.SundaySchool ||
        data.searchType === OfferingIncomeSearchType.SundayService ||
        data.searchType === OfferingIncomeSearchType.UnitedService ||
        // data.searchType === OfferingIncomeSearchType.YouthService ||
        data.searchType === OfferingIncomeSearchType.ZonalFasting ||
        data.searchType === OfferingIncomeSearchType.ZonalVigil
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
        (data.searchType === OfferingIncomeSearchType.ChurchGround ||
          data.searchType === OfferingIncomeSearchType.FamilyGroup ||
          data.searchType === OfferingIncomeSearchType.Special ||
          data.searchType === OfferingIncomeSearchType.ZonalFasting ||
          data.searchType === OfferingIncomeSearchType.ZonalVigil) &&
        (data.searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFirstNames ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFirstNames ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames)
      ) {
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
      if (
        (data.searchType === OfferingIncomeSearchType.ChurchGround ||
          data.searchType === OfferingIncomeSearchType.FamilyGroup ||
          data.searchType === OfferingIncomeSearchType.Special ||
          data.searchType === OfferingIncomeSearchType.ZonalFasting ||
          data.searchType === OfferingIncomeSearchType.ZonalVigil) &&
        (data.searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherLastNames ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByPreacherFullNames ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorLastNames ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingBySupervisorFullNames)
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
  .refine(
    (data) => {
      if (
        (data.searchType === OfferingIncomeSearchType.FamilyGroup ||
          data.searchType === OfferingIncomeSearchType.ZonalFasting ||
          data.searchType === OfferingIncomeSearchType.ZonalVigil) &&
        (data.searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCode ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByZone ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate)
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
        data.searchType === OfferingIncomeSearchType.RecordStatus ||
        (// data.searchType === OfferingIncomeSearchType.SundaySchool ||
        (data.searchType === OfferingIncomeSearchType.SundayService ||
          data.searchType === OfferingIncomeSearchType.GeneralFasting ||
          data.searchType === OfferingIncomeSearchType.GeneralVigil ||
          data.searchType === OfferingIncomeSearchType.Activities ||
          data.searchType === OfferingIncomeSearchType.UnitedService ||
          // data.searchType === OfferingIncomeSearchType.YouthService ||
          data.searchType === OfferingIncomeSearchType.IncomeAdjustment ||
          data.searchType === OfferingIncomeSearchType.Special ||
          data.searchType === OfferingIncomeSearchType.ChurchGround) &&
          (data.searchSubType === OfferingIncomeSearchSubType.OfferingByShift ||
            data.searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
            data.searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFirstNames ||
            data.searchSubType === OfferingIncomeSearchSubType.OfferingByContributorLastNames ||
            data.searchSubType === OfferingIncomeSearchSubType.OfferingByContributorFullNames))
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
      if (
        (data.searchType === OfferingIncomeSearchType.Activities ||
          data.searchType === OfferingIncomeSearchType.ChurchGround ||
          data.searchType === OfferingIncomeSearchType.FamilyGroup ||
          data.searchType === OfferingIncomeSearchType.GeneralFasting ||
          data.searchType === OfferingIncomeSearchType.GeneralVigil ||
          data.searchType === OfferingIncomeSearchType.IncomeAdjustment ||
          data.searchType === OfferingIncomeSearchType.Special ||
          // data.searchType === OfferingIncomeSearchType.SundaySchool ||
          data.searchType === OfferingIncomeSearchType.SundayService ||
          data.searchType === OfferingIncomeSearchType.UnitedService ||
          // data.searchType === OfferingIncomeSearchType.YouthService ||
          data.searchType === OfferingIncomeSearchType.ZonalFasting ||
          data.searchType === OfferingIncomeSearchType.ZonalVigil) &&
        (data.searchSubType === OfferingIncomeSearchSubType.OfferingByDate ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByGroupCodeDate ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByShiftDate ||
          data.searchSubType === OfferingIncomeSearchSubType.OfferingByZoneDate)
      ) {
        return !!data.dateTerm;
      }
      return true;
    },
    {
      message: 'La fecha o range de fechas es requerido.',
      path: ['dateTerm'],
    }
  );
