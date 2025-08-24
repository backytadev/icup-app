import * as z from 'zod';

import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { District } from '@/shared/enums/district.enum';
import { Department } from '@/shared/enums/department.enum';
import { UrbanSector } from '@/shared/enums/urban-sector.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';

import { MinistryType } from '@/modules/ministry/enums/ministry-type.enum';
import { MinistryServiceTime } from '@/modules/ministry/enums/ministry-service-time.enum';

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

  country: z
    .string(
      z.nativeEnum(Country, {
        required_error: 'El país es requerido.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'El país es requerido.',
    }),

  department: z
    .string(
      z.nativeEnum(Department, {
        required_error: 'El departamento es requerido.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'El departamento es requerido.',
    }),

  province: z
    .string(
      z.nativeEnum(Province, {
        required_error: 'La provincia es requerida.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'La provincia es requerida.',
    }),

  district: z
    .string(
      z.nativeEnum(District, {
        required_error: 'El distrito es requerido.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'El distrito es requerido.',
    }),

  urbanSector: z
    .string(
      z.nativeEnum(UrbanSector, {
        required_error: 'El sector urbano es requerido.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'El sector urbano es requerido.',
    }),

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
