/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */

import * as z from 'zod';

import { Gender } from '@/shared/enums/gender.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';

import { UserRole } from '@/modules/user/enums/user-role.enum';

const strongPassword = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
    'La contraseña no cumple con los requisitos mínimos'
  );

const numericPassword = z
  .string()
  .regex(/^[0-9]{4,15}$/, 'La contraseña numérica debe tener entre 4 y 15 dígitos');

export const userFormSchema = z
  .object({
    firstNames: z
      .string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(40, { message: 'El campo debe contener máximo 40 caracteres' }),

    lastNames: z
      .string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(40, { message: 'El campo debe contener máximo 40 caracteres' }),

    gender: z
      .string(
        z.nativeEnum(Gender, {
          required_error: 'El género es requerido.',
        })
      )
      .refine((value) => value !== undefined && value.trim() !== '', {
        message: 'El género es requerido.',
      }),

    userName: z
      .string()
      .min(3, { message: 'El campo debe contener al menos 3 carácter.' })
      .max(20, { message: 'El campo debe contener máximo 20 caracteres' })
      .optional(),

    email: z.string().email({ message: 'E-mail invalido.' }).optional(),

    password: z.union([strongPassword, numericPassword]).optional(),

    passwordConfirm: z.union([strongPassword, numericPassword]).optional(),

    roles: z
      .array(z.nativeEnum(UserRole), {
        required_error: 'Debes seleccionar al menos un rol',
      })
      .refine((value) => value.some((item) => item), {
        message: 'Debes seleccionar al menos un rol',
      }),

    ministries: z.array(z.string(), {
      required_error: 'Debes seleccionar al menos un ministerio.',
    }),

    recordStatus: z
      .string(
        z.nativeEnum(RecordStatus, {
          required_error: 'El estado de registro es requerido.',
        })
      )
      .optional(),

    churches: z.array(z.string(), {
      required_error: 'Debes seleccionar al menos una iglesia.',
    }),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    {
      message: 'Las contraseñas no coinciden.',
      path: ['passwordConfirm'],
    }
  );
