import * as z from 'zod';

export const calendarEventSearchByTermFormSchema = z.object({
  searchType: z.string().min(1, { message: 'Selecciona un tipo de búsqueda.' }),
  inputTerm: z.string().optional(),
  selectTerm: z.string().optional(),
  dateTerm: z
    .object(
      { from: z.date(), to: z.date().optional() },
      { required_error: 'La fecha o rango de fechas es requerida.' }
    )
    .optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
  order: z.string().optional(),
  all: z.boolean().optional(),
});
