import * as z from 'zod';

import { RecordStatus } from '@/shared/enums/record-status.enum';

import { MinistryType } from '@/modules/ministry/enums/ministry-type.enum';
import { MinistryServiceTime } from '@/modules/ministry/enums/ministry-service-time.enum';

//* Helper: Create required string field with trim validation
const createRequiredStringField = (fieldName: string) =>
  z
    .string()
    .min(1, { message: `${fieldName} es requerido.` })
    .refine((value) => value.trim() !== '', {
      message: `${fieldName} es requerido.`,
    });

export const ministryFormSchema = z.object({
  //* General Info
  customMinistryName: z
    .string()
    .min(7, { message: 'El campo debe contener al menos 7 caracteres.' })
    .max(50, { message: 'El campo debe contener máximo 50 caracteres.' }),

  ministryType: z
    .string(
      z.nativeEnum(MinistryType, {
        required_error: 'El tipo de ministerio es requerido.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'El tipo de ministerio es requerido.',
    }),

  serviceTimes: z
    .array(z.nativeEnum(MinistryServiceTime), {
      required_error: 'Debe seleccionar al menos un horario.',
    })
    .refine((value) => value.some((item) => item), {
      message: 'Debe seleccionar al menos un horario.',
    }),

  foundingDate: z.date({
    required_error: 'La fecha de fundación es requerida.',
  }),

  //* Contact Info and status
  email: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().email({ message: 'E-mail inválido.' }).optional()
  ),

  phoneNumber: z.preprocess(
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

  country: createRequiredStringField('El país'),

  department: createRequiredStringField('El departamento'),

  province: createRequiredStringField('La provincia'),

  district: createRequiredStringField('El distrito'),

  urbanSector: createRequiredStringField('El sector urbano'),

  address: z
    .string()
    .min(7, { message: 'El campo debe contener al menos 7 caracteres.' })
    .max(80, { message: 'El campo debe contener máximo 80 caracteres.' }),

  referenceAddress: z
    .string()
    .min(7, { message: 'El campo debe contener al menos 7 caracteres.' })
    .max(150, { message: 'El campo debe contener máximo 150 caracteres.' }),

  recordStatus: z
    .string(
      z.nativeEnum(RecordStatus, {
        required_error: 'El estado de registro es requerido.',
      })
    )
    .optional(),

  //* Relations
  theirPastor: z.string({ required_error: 'Debe asignar un Pastor.' }).optional(),
});
