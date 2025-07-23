/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import * as z from 'zod';

import { Gender } from '@/shared/enums/gender.enum';
import { RecordStatus } from '@/shared/enums/record-status.enum';
import { CurrencyType } from '@/modules/offering/shared/enums/currency-type.enum';

import { MemberType } from '@/modules/offering/income/enums/member-type.enum';
import { OfferingIncomeCreationType } from '@/modules/offering/income/enums/offering-income-creation-type.enum';
import { OfferingIncomeCreationSubType } from '@/modules/offering/income/enums/offering-income-creation-sub-type.enum';
import { OfferingIncomeCreationCategory } from '@/modules/offering/income/enums/offering-income-creation-category.enum';
import { OfferingIncomeCreationShiftType } from '@/modules/offering/income/enums/offering-income-creation-shift-type.enum';

export const offeringIncomeFormSchema = z
  .object({
    churchId: z.string({
      required_error: 'La Iglesia es requerida.',
    }),

    type: z.string(
      z.nativeEnum(OfferingIncomeCreationType, {
        required_error: 'El tipo de ofrenda es requerido.',
      })
    ),

    subType: z
      .string(
        z.nativeEnum(OfferingIncomeCreationSubType, {
          required_error: 'El sub-tipo de ofrenda es requerido.',
        })
      )
      .optional(),

    category: z
      .string(
        z.nativeEnum(OfferingIncomeCreationCategory, {
          required_error: 'La categoría de ofrenda es requerida.',
        })
      )
      .optional(),

    isNewExternalDonor: z.boolean().optional(),

    externalDonorId: z
      .string({ required_error: 'Debe asignar un donante al registro.' })
      .optional(),

    externalDonorFirstNames: z
      .string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(50, { message: 'El campo debe contener máximo 50 caracteres.' })
      .optional(),

    externalDonorLastNames: z
      .string()
      .min(1, { message: 'El campo debe contener al menos 1 carácter.' })
      .max(50, { message: 'El campo debe contener máximo 50 caracteres.' })
      .optional(),

    externalDonorGender: z
      .string(
        z.nativeEnum(Gender, {
          required_error: 'El género es requerido.',
        })
      )
      .refine((value) => value !== undefined && value.trim() !== '', {
        message: 'El género es requerido.',
      })
      .optional(),

    externalDonorBirthDate: z
      .date({
        required_error: 'La fecha de nacimiento es requerida.',
      })
      .optional(),

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

    shift: z
      .string(
        z.nativeEnum(OfferingIncomeCreationShiftType, {
          required_error: 'El turno es requerido.',
        })
      )
      .optional(),

    amount: z
      .string()
      .refine(
        (amount) => {
          return /^\d+(\.\d+)?$/.test(amount);
        },
        {
          message: 'El monto debe ser un número mayor o igual a 0.',
        }
      )
      .refine(
        (amount) => {
          const parsedAmount = parseFloat(amount);
          return !isNaN(parsedAmount) && parsedAmount >= 0;
        },
        {
          message: 'El monto debe ser un número mayor o igual a 0.',
        }
      ),

    currency: z.string(
      z.nativeEnum(CurrencyType, {
        required_error: 'Debe seleccionar una opción.',
      })
    ),

    date: z.date({
      required_error: 'La fecha de la ofrenda es requerida.',
    }),

    comments: z
      .string()
      .max(500, { message: 'El campo debe contener máximo 500 caracteres' })
      .optional(),

    fileNames: z.array(z.string()).optional(),
    imageUrls: z.array(z.string()).optional(),

    memberType: z
      .string(
        z.nativeEnum(MemberType, {
          required_error: 'Selecciones un tipo de miembro.',
        })
      )
      .optional(),

    familyGroupId: z.string().optional(),
    memberId: z.string().optional(),
    zoneId: z.string().optional(),

    recordStatus: z
      .string(
        z.nativeEnum(RecordStatus, {
          required_error: 'El estado de registro es requerido.',
        })
      )
      .optional(),

    shouldOpenReceiptInBrowser: z.enum(['yes', 'no']).optional(),
  })
  .refine(
    (data) => {
      if (data.type === 'offering') {
        return !!data.subType;
      }
      return true;
    },
    {
      message: 'El sub-tipo es requerido.',
      path: ['subType'],
    }
  )
  .refine(
    (data) => {
      if (
        data.type === OfferingIncomeCreationType.Offering &&
        data.subType === OfferingIncomeCreationSubType.ZonalFasting
      ) {
        return !!data.zoneId;
      }
      return true;
    },
    {
      message: 'La Zona es requerida.',
      path: ['zoneId'],
    }
  )
  .refine(
    (data) => {
      if (
        data.type === OfferingIncomeCreationType.Offering &&
        data.subType === OfferingIncomeCreationSubType.ZonalVigil
      ) {
        return !!data.zoneId;
      }
      return true;
    },
    {
      message: 'La Zona es requerida.',
      path: ['zoneId'],
    }
  )
  .refine(
    (data) => {
      if (
        data.type === OfferingIncomeCreationType.Offering &&
        data.subType === OfferingIncomeCreationSubType.FamilyGroup
      ) {
        return !!data.familyGroupId;
      }
      return true;
    },
    {
      message: 'El Grupo Familiar es requerido.',
      path: ['familyGroupId'],
    }
  )
  .refine(
    (data) => {
      if (
        data.type === OfferingIncomeCreationType.IncomeAdjustment ||
        (data.type === OfferingIncomeCreationType.Offering &&
          (data.subType === OfferingIncomeCreationSubType.SundayService ||
            data.subType === OfferingIncomeCreationSubType.Activities ||
            data.subType === OfferingIncomeCreationSubType.GeneralFasting ||
            data.subType === OfferingIncomeCreationSubType.GeneralVigil ||
            data.subType === OfferingIncomeCreationSubType.UnitedService))
        // data.subType === OfferingIncomeCreationSubType.YouthService
      ) {
        return !!data.churchId;
      }
      return true;
    },
    {
      message: 'La Iglesia es requerida.',
      path: ['churchId'],
    }
  );
