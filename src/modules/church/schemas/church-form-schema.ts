import * as z from 'zod';

import { Country } from '@/shared/enums/country.enum';
import { Province } from '@/shared/enums/province.enum';
import { District } from '@/shared/enums/district.enum';
import { Department } from '@/shared/enums/department.enum';
import { UrbanSector } from '@/shared/enums/urban-sector.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';

import { ChurchServiceTime } from '@/modules/church/enums/church-service-time.enum';

export const churchFormSchema = z.object({
  //* General Info
  churchName: z
    .string()
    .min(10, { message: 'El campo debe contener al menos 10 caracteres.' })
    .max(100, { message: 'El campo debe contener máximo 100 caracteres.' }),

  abbreviatedChurchName: z
    .string()
    .min(7, { message: 'El campo debe contener al menos 7 caracteres.' })
    .max(50, { message: 'El campo debe contener máximo 50 caracteres.' }),

  isAnexe: z.boolean().optional(),

  serviceTimes: z
    .array(z.nativeEnum(ChurchServiceTime), {
      required_error: 'Debe seleccionar al menos un horario.',
    })
    .refine((value) => value.some((item) => item), {
      message: 'Debe seleccionar al menos un horario.',
    }),

  foundingDate: z.date({
    required_error: 'La fecha de fundación es requerida.',
  }),

  //* Contact Info and status
  email: z.string().email({ message: 'E-mail invalido.' }),

  phoneNumber: z
    .string()
    .min(6, { message: 'El campo debe tener al menos 6 dígitos.' })
    .max(20, { message: 'El campo debe tener un máximo de 20 dígitos.' })
    .refine(
      (value) => {
        return /^[0-9+\-\s]+$/.test(value);
      },
      {
        message: 'El campo solo debe contener números, "+", "-" y espacios.',
      }
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
  theirMainChurch: z.string({ required_error: 'Debe asignar una Iglesia Principal.' }).optional(),
});
