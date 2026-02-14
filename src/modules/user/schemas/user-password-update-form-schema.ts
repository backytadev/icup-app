/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

const strongPassword = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    'La contraseña no cumple con los requisitos mínimos'
  );

const numericPassword = z
  .string()
  .regex(/^[0-9]{4,15}$/, 'La contraseña numérica debe tener entre 4 y 15 dígitos');

export const userUpdatePasswordFormSchema = z
  .object({
    currentPassword: z.union([strongPassword, numericPassword]),
    newPassword: z.union([strongPassword, numericPassword]),
    newPasswordConfirm: z.union([strongPassword, numericPassword]),
  })
  .refine(
    (data) => {
      return data.newPassword === data.newPasswordConfirm;
    },
    {
      message: 'Las contraseñas no coinciden.',
      path: ['newPasswordConfirm'],
    }
  );
