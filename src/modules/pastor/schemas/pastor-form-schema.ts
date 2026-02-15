/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { MemberRole } from '@/shared/enums/member-role.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { RelationType } from '@/shared/enums/relation-type.enum';

import { MinistryAssignmentSchema } from '@/modules/ministry/schemas/ministry-assignment';

//* Helper: Create required string field with trim validation
const createRequiredStringField = (fieldName: string) =>
  z
    .string()
    .min(1, { message: `${fieldName} es requerido.` })
    .refine((value) => value.trim() !== '', {
      message: `${fieldName} es requerido.`,
    });

export const pastorFormSchema = z
  .object({
    firstNames: z
      .string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(40, { message: 'El campo debe contener máximo 40 caracteres' }),

    lastNames: z
      .string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(40, { message: 'El campo debe contener máximo 40 caracteres' }),

    gender: createRequiredStringField('El género'),

    originCountry: z
      .string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(20, { message: 'El campo debe contener máximo 20 caracteres.' }),

    birthDate: z.date({
      required_error: 'La fecha de nacimiento es requerida.',
    }),

    maritalStatus: createRequiredStringField('El estado civil'),

    numberChildren: z
      .string()
      .refine(
        (number) => {
          return /^\d+$/.test(number);
        },
        {
          message: 'El campo debe contener un número >= 0.',
        }
      )
      .refine(
        (number) => {
          const parsedNumber = parseInt(number);
          return !isNaN(parsedNumber) && parsedNumber >= 0;
        },
        {
          message: 'El campo debe contener un número >= 0.',
        }
      ),

    conversionDate: z.preprocess(
      (value) => (value === '' || value === null ? undefined : value),
      z.date().optional()
    ),

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

    residenceCountry: createRequiredStringField('El país'),

    residenceDepartment: createRequiredStringField('El departamento'),

    residenceProvince: createRequiredStringField('La provincia'),

    residenceDistrict: createRequiredStringField('El distrito'),

    residenceUrbanSector: createRequiredStringField('El sector urbano'),

    residenceAddress: z
      .string()
      .min(5, { message: 'El campo debe contener al menos 5 caracteres.' })
      .max(80, { message: 'El campo debe contener máximo 80 caracteres.' }),

    referenceAddress: z
      .string()
      .min(5, { message: 'El campo debe contener al menos 5 carácter.' })
      .max(150, { message: 'El campo debe contener máximo 150 caracteres.' }),

    roles: z
      .array(z.nativeEnum(MemberRole), {
        required_error: 'Debe seleccionar al menos un rol.',
      })
      .refine((value) => value.some((item) => item), {
        message: 'Debe seleccionar al menos un rol.',
      }),

    recordStatus: z
      .string(
        z.nativeEnum(RecordStatus, {
          required_error: 'El estado de registro es requerido.',
        })
      )
      .optional(),

    relationType: z
      .string(
        z.nativeEnum(RelationType, {
          required_error: 'El tipo de relación es requerido.',
        })
      )
      .refine((value) => value !== undefined && value.trim() !== '', {
        message: 'El tipo de relación es requerido.',
      }),

    //* Relations
    theirChurch: z.string({ required_error: 'Debe asignar una Iglesia.' }).optional(),

    theirMinistries: z.array(MinistryAssignmentSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.roles.includes(MemberRole.Pastor) && data.roles.includes(MemberRole.Disciple)) {
        return !!data.theirChurch;
      }
      return true;
    },
    {
      message: 'Debe asignar una Iglesia.',
      path: ['theirChurch'],
    }
  );
