/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

export const metricsFormSchema = z.object({
  date: z
    .object(
      { from: z.date(), to: z.date().optional() },
      {
        required_error: 'Selecciona un rango de fechas.',
      }
    )
    .refine(
      (date) => {
        return date.to !== undefined;
      },
      {
        message: 'Selecciona un rango de fechas',
      }
    )
    .optional(),

  zone: z.string({ required_error: 'Selecciona un zona.' }).optional(),

  copastor: z.string({ required_error: 'Selecciona un co-pastor.' }).optional(),

  district: z.string({ required_error: 'Selecciona un distrito.' }).optional(),

  month: z.string({ required_error: 'Selecciona un mes.' }).optional(),

  startMonth: z.string({ required_error: 'Selecciona un mes de inicio.' }).optional(),

  endMonth: z.string({ required_error: 'Selecciona un mes de fin.' }).optional(),

  year: z.string({ required_error: 'Selecciona un año.' }).optional(),

  currency: z.string({ required_error: 'Selecciona una divisa.' }).optional(),

  subType: z.string({ required_error: 'Selecciona un sub-tipo.' }).optional(),

  type: z.string({ required_error: 'Selecciona un tipo.' }).optional(),

  all: z.boolean().optional(),
});
