import * as z from 'zod';

export const calendarEventFormSchema = z.object({
  churchId: z.string().optional(),

  title: z
    .string()
    .min(1, { message: 'El título es requerido.' })
    .max(150, { message: 'El título no puede exceder 150 caracteres.' }),

  description: z
    .string()
    .max(1000, { message: 'La descripción no puede exceder 1000 caracteres.' })
    .optional(),

  category: z.string().min(1, { message: 'Selecciona una categoría.' }),

  status: z.string().min(1, { message: 'Selecciona un estado para el evento.' }),

  startDate: z.date({ required_error: 'La fecha de inicio del evento es requerida.' }),

  endDate: z.date().optional(),

  locationName: z
    .string()
    .max(200, { message: 'El nombre del lugar no puede exceder 200 caracteres.' })
    .optional(),

  locationReference: z
    .string()
    .max(500, { message: 'La referencia no puede exceder 500 caracteres.' })
    .optional(),

  latitude: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && Math.abs(parseFloat(val)) <= 90), {
      message: 'Latitud inválida. Debe estar entre -90 y 90.',
    }),

  longitude: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && Math.abs(parseFloat(val)) <= 180), {
      message: 'Longitud inválida. Debe estar entre -180 y 180.',
    }),

  targetGroups: z
    .array(z.string())
    .min(1, { message: 'Selecciona al menos un grupo objetivo.' }),

  isPublic: z.boolean().default(false),

  fileNames: z.array(z.string()).optional(),

  imageUrls: z.array(z.string()).optional(),

  recordStatus: z.string().optional(),
});
