/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { z } from 'zod';

import { UserInactivationReason } from '@/modules/user/enums/user-inactivation-reason.enum';
import { UserInactivationCategory } from '@/modules/user/enums/user-inactivation-category.enum';

export const userInactivationFormSchema = z.object({
  userInactivationCategory: z
    .string(
      z.nativeEnum(UserInactivationCategory, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),

  userInactivationReason: z
    .string(
      z.nativeEnum(UserInactivationReason, {
        required_error: 'Debe seleccionar una opción.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'Debe seleccionar una opción.',
    }),
});
