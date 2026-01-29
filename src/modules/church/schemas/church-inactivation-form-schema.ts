/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { z } from 'zod';

import { ChurchInactivationReason } from '@/modules/church/enums/church-inactivation-reason.enum';
import { ChurchInactivationCategory } from '@/modules/church/enums/church-inactivation-category.enum';

export const churchInactivationFormSchema = z.object({
  churchInactivationCategory: z
    .string(
      z.nativeEnum(ChurchInactivationCategory, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),

  churchInactivationReason: z
    .string(
      z.nativeEnum(ChurchInactivationReason, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),
});
