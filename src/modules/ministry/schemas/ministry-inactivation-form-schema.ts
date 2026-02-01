import { z } from 'zod';

import { MinistryInactivationReason } from '@/modules/ministry/enums/ministry-inactivation-reason.enum';
import { MinistryInactivationCategory } from '@/modules/ministry/enums/ministry-inactivation-category.enum';

export const ministryInactivationFormSchema = z.object({
  ministryInactivationCategory: z
    .string(
      z.nativeEnum(MinistryInactivationCategory, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),

  ministryInactivationReason: z
    .string(
      z.nativeEnum(MinistryInactivationReason, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),
});
