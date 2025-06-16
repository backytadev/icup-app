import * as z from 'zod';
import { RecordOrder } from '@/shared/enums/record-order.enum';

export const formSearchGeneralSchema = z.object({
  order: z.string(
    z.nativeEnum(RecordOrder, {
      required_error: 'Seleccione un orden para la consulta.',
    })
  ),

  dateTerm: z
    .object(
      { from: z.date(), to: z.date().optional() },
      {
        required_error: 'La fecha o rango de fechas es requerida.',
      }
    )
    .optional(),

  limit: z
    .string()
    .refine(
      (limit) => {
        return /^\d+$/.test(limit);
      },
      {
        message: 'El límite debe ser un número mayor a 0.',
      }
    )
    .refine(
      (limit) => {
        const parsedLimit = parseInt(limit);
        return !isNaN(parsedLimit) && parsedLimit > 0;
      },
      {
        message: 'El límite debe ser un número mayor a 0.',
      }
    )
    .optional(),

  offset: z
    .string()
    .refine(
      (offset) => {
        return /^\d+$/.test(offset);
      },
      {
        message: 'Debe ser un número mayor o igual a 0',
      }
    )
    .refine(
      (offset) => {
        const parsedOffset = parseInt(offset);
        return !isNaN(parsedOffset) && parsedOffset >= 0;
      },
      {
        message: 'Debe ser un número mayor o igual a 0',
      }
    )
    .optional(),

  churchId: z.string().max(40).optional(),

  all: z.boolean().optional(),
});
