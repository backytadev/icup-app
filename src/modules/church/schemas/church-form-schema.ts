import { z } from 'zod';

import { RecordStatus } from '@/shared/enums/record-status.enum';

import { ChurchServiceTime } from '@/modules/church/enums/church-service-time.enum';

//* Helper: Create required string field with trim validation
const createRequiredStringField = (fieldName: string) =>
  z
    .string()
    .min(1, { message: `${fieldName} es requerido.` })
    .refine((value) => value.trim() !== '', {
      message: `${fieldName} es requerido.`,
    });

export const churchFormSchema = z
  .object({
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
    theirMainChurch: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isAnexe) {
        return !!data.theirMainChurch && data.theirMainChurch.trim() !== '';
      }
      return true;
    },
    {
      message: 'Debe asignar una Iglesia Principal.',
      path: ['theirMainChurch'],
    }
  );
