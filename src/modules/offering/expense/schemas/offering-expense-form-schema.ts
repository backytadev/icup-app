import * as z from 'zod';

import { RecordStatus } from '@/shared/enums/record-status.enum';

import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';
import { OfferingExpenseSearchType } from '@/modules/offering/expense/enums/offering-expense-search-type.enum';
import { OfferingExpenseSearchSubType } from '@/modules/offering/expense/enums/offering-expense-search-sub-type.enum';

export const offeringExpenseFormSchema = z.object({
  churchId: z.string({
    required_error: 'La Iglesia es requerida.',
  }),

  type: z.string(
    z.nativeEnum(OfferingExpenseSearchType, {
      required_error: 'El tipo de búsqueda es requerido.',
    })
  ),

  subType: z
    .string(
      z.nativeEnum(OfferingExpenseSearchSubType, {
        required_error: 'El sub-tipo de búsqueda es requerido.',
      })
    )
    .optional(),

  amount: z
    .string()
    .refine(
      (amount) => {
        return /^\d+(\.\d+)?$/.test(amount);
      },
      {
        message: 'El monto debe ser un número mayor o igual a 0.',
      }
    )
    .refine(
      (amount) => {
        const parsedAmount = parseFloat(amount);
        return !isNaN(parsedAmount) && parsedAmount >= 0;
      },
      {
        message: 'El monto debe ser un número mayor o igual a 0.',
      }
    ),

  currency: z.string(
    z.nativeEnum(CurrencyType, {
      required_error: 'La divisa es requerida.',
    })
  ),

  date: z.date({
    required_error: 'La fecha es requerida.',
  }),

  fileNames: z.array(z.string()).optional(),
  urlFile: z.array(z.string()).optional(),

  comments: z
    .string()
    .min(5, { message: 'El campo debe contener mínimo 5 caracteres.' })
    .max(500, { message: 'El campo debe contener máximo 500 caracteres.' }),

  recordStatus: z
    .string(
      z.nativeEnum(RecordStatus, {
        required_error: 'El estado de registro es requerido.',
      })
    )
    .optional(),
});
