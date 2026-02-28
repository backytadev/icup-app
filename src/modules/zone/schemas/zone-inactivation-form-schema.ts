/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { z } from 'zod';

import { ZoneInactivationReason } from '@/modules/zone/enums/zone-inactivation-reason.enum';
import { ZoneInactivationCategory } from '@/modules/zone/enums/zone-inactivation-category.enum';

export const zoneInactivationFormSchema = z.object({
  zoneInactivationCategory: z
    .string(
      z.nativeEnum(ZoneInactivationCategory, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),

  zoneInactivationReason: z
    .string(
      z.nativeEnum(ZoneInactivationReason, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),
});
