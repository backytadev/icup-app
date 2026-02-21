import * as z from 'zod';
import {
  MetricMemberSearchType,
  MetricFamilyGroupSearchType,
  MetricOfferingIncomeSearchType,
  MetricOfferingExpenseSearchType,
  MetricFinancialBalanceComparisonSearchType,
} from '@/modules/metrics/enums/metrics-search-type.enum';

export const memberReportFormSchema = z.object({
  types: z
    .array(z.nativeEnum(MetricMemberSearchType), {
      required_error: 'Debes seleccionar al menos una opción.',
    })
    .refine((value) => value.some((item) => item), {
      message: 'Debes seleccionar al menos una opción.',
    }),

  church: z.string({ required_error: 'Selecciona una Iglesia.' }),

  year: z.string({ required_error: 'Selecciona un año.' }).optional(),
});

export const familyGroupReportFormSchema = z.object({
  types: z
    .array(z.nativeEnum(MetricFamilyGroupSearchType), {
      required_error: 'Debes seleccionar al menos una opción.',
    })
    .refine((value) => value.some((item) => item), {
      message: 'Debes seleccionar al menos una opción.',
    }),

  church: z.string({ required_error: 'Selecciona una Iglesia.' }),

  year: z.string({ required_error: 'Selecciona un año.' }).optional(),
});

export const offeringIncomeReportFormSchema = z.object({
  types: z
    .array(z.nativeEnum(MetricOfferingIncomeSearchType), {
      required_error: 'Debes seleccionar al menos una opción.',
    })
    .refine((value) => value.some((item) => item), {
      message: 'Debes seleccionar al menos una opción.',
    }),

  church: z.string({ required_error: 'Selecciona una Iglesia.' }),

  year: z.string({ required_error: 'Selecciona un año.' }).optional(),

  startMonth: z.string({ required_error: 'Selecciona el mes de inicio.' }).optional(),

  endMonth: z.string({ required_error: 'Selecciona el mes de fin.' }).optional(),
});

export const offeringExpenseReportFormSchema = z.object({
  types: z
    .array(z.nativeEnum(MetricOfferingExpenseSearchType), {
      required_error: 'Debes seleccionar al menos una opción.',
    })
    .refine((value) => value.some((item) => item), {
      message: 'Debes seleccionar al menos una opción.',
    }),

  church: z.string({ required_error: 'Selecciona una Iglesia.' }),

  year: z.string({ required_error: 'Selecciona un año.' }).optional(),

  startMonth: z.string({ required_error: 'Selecciona el mes de inicio.' }).optional(),

  endMonth: z.string({ required_error: 'Selecciona el mes de fin.' }).optional(),
});

export const FinancialBalanceComparativeReportFormSchema = z.object({
  types: z
    .array(z.nativeEnum(MetricFinancialBalanceComparisonSearchType), {
      required_error: 'Debes seleccionar al menos una opción.',
    })
    .refine((value) => value.some((item) => item), {
      message: 'Debes seleccionar al menos una opción.',
    }),

  church: z.string({ required_error: 'Selecciona una Iglesia.' }),

  year: z.string({ required_error: 'Selecciona un año.' }).optional(),

  startMonth: z.string({ required_error: 'Selecciona el mes de inicio.' }).optional(),

  endMonth: z.string({ required_error: 'Selecciona el mes de fin.' }).optional(),
});
