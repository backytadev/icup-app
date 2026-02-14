/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { Gender } from '@/shared/enums/gender.enum';

export const ExternalDonorUpdateFormSchema = z.object({
  externalDonorFirstNames: z
    .string()
    .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
    .max(50, { message: 'El campo debe contener máximo 50 caracteres.' }),

  externalDonorLastNames: z
    .string()
    .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
    .max(50, { message: 'El campo debe contener máximo 50 caracteres.' }),

  externalDonorGender: z
    .string(
      z.nativeEnum(Gender, {
        required_error: 'El género es requerido.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'El género es requerido.',
    }),

  externalDonorBirthDate: z
    .date({
      required_error: 'La fecha es requerida.',
    })
    .optional()
    .nullable(),

  externalDonorEmail: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().email({ message: 'E-mail inválido.' }).optional()
  ),

  externalDonorPhoneNumber: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z
      .string()
      .min(1, { message: 'El campo debe tener al menos 1 dígito.' })
      .max(20, { message: 'El campo debe tener un máximo de 20 dígitos.' })
      .refine((value) => /^[0-9+\-\s]+$/.test(value), {
        message: 'El campo solo debe contener números, "+", "-" y espacios.',
      })
      .optional()
  ),

  externalDonorOriginCountry: z
    .string()
    .min(0, { message: 'El campo debe contener al menos 0 carácter.' })
    .max(40, { message: 'El campo debe contener máximo 40 caracteres.' })
    .optional(),

  externalDonorResidenceCountry: z
    .string()
    .min(0, { message: 'El campo debe contener al menos 0 carácter.' })
    .max(40, { message: 'El campo debe contener máximo 40 caracteres.' })
    .optional(),

  externalDonorResidenceCity: z
    .string()
    .min(0, { message: 'El campo debe contener al menos 0 carácter.' })
    .max(40, { message: 'El campo debe contener máximo 40 caracteres.' })
    .optional(),

  externalDonorPostalCode: z
    .string()
    .min(0, { message: 'El campo debe contener al menos 0 carácter.' })
    .max(40, { message: 'El campo debe contener máximo 40 caracteres.' })
    .optional(),
});
