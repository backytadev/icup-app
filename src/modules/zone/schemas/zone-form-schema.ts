import * as z from 'zod';

import { Country } from '@/shared/enums/country.enum';
import { District } from '@/shared/enums/district.enum';
import { Province } from '@/shared/enums/province.enum';
import { Department } from '@/shared/enums/department.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';

export const zoneFormSchema = z.object({
  zoneName: z
    .string()
    .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
    .max(40, { message: 'El campo debe contener máximo 50 caracteres.' }),

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
        required_error: 'La provincia es requerido.',
      })
    )
    .refine((value) => value !== undefined && value.trim() !== '', {
      message: 'La provincia es requerido.',
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

  recordStatus: z
    .string(
      z.nativeEnum(RecordStatus, {
        required_error: 'El estado de registro es requerido.',
      })
    )
    .optional(),

  //* Relations
  theirSupervisor: z.string({ required_error: 'Debe asignar un Supervisor.' }).optional(),
});
