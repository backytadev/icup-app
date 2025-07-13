/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { z } from 'zod';
import { ExchangeCurrencyTypes } from '@/modules/offering/income/enums/exchange-currency-types.enum';

export const offeringInactivateFormSchema = z.object({
  offeringInactivationReason: z.string().min(1, { message: 'Debe seleccionar una opción.' }),
  offeringInactivationDescription: z
    .string()
    .min(5, { message: 'Debe escribir una descripción mayor a 5 caracteres.' })
    .or(z.literal(''))
    .optional(),

  exchangeRate: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\d{1,2}\.\d{2}$/.test(value);
      },
      {
        message: 'Debe ser un número con 2 decimales.',
      }
    )
    .optional(),

  exchangeCurrencyTypes: z
    .string()
    .optional()
    .refine(
      (value) =>
        value === '' ||
        Object.values(ExchangeCurrencyTypes).includes(value as ExchangeCurrencyTypes),
      { message: 'Selecciona una opción.' }
    )
    .optional(),
});
