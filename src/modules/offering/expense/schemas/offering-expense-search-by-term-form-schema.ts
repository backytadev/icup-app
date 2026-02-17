import * as z from 'zod';

import { RecordOrder } from '@/shared/enums/record-order.enum';
import { OfferingExpenseSearchType } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import { OfferingExpenseSearchSubType } from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';

export const offeringExpenseSearchByTermFormSchema = z
  .object({
    searchType: z.nativeEnum(OfferingExpenseSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    }),

    searchSubType: z
      .union([
        z.nativeEnum(OfferingExpenseSearchSubType),
        z
          .string()
          .optional()
          .refine((value) => value === '', {
            message: 'Debe seleccionar una opción.',
          }),
      ])
      .optional(),

    selectTerm: z.string().max(40).optional(),

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
        required_error: 'El orden de registros es requerido.',
      })
    ),

    churchId: z.string().max(40).optional(),

    all: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.searchType === OfferingExpenseSearchType.RecordStatus) {
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
        data.searchType === OfferingExpenseSearchType.PlaningEventsExpenses ||
        data.searchType === OfferingExpenseSearchType.DecorationExpenses ||
        data.searchType === OfferingExpenseSearchType.EquipmentAndTechnologyExpenses ||
        data.searchType === OfferingExpenseSearchType.MaintenanceAndRepairExpenses ||
        data.searchType === OfferingExpenseSearchType.OperationalExpenses ||
        data.searchType === OfferingExpenseSearchType.SuppliesExpenses ||
        data.searchType === OfferingExpenseSearchType.ExpensesAdjustment
      ) {
        return !!data.dateTerm;
      }
      return true;
    },
    {
      message: 'La fecha o rango de fechas es requerida',
      path: ['dateTerm'],
    }
  );
