import * as z from 'zod';

export const zoneSupervisorUpdateFormSchema = z.object({
  currentZone: z.string().optional(),
  currentTheirSupervisor: z.string().optional(),
  newTheirSupervisor: z.string(),
  newZone: z.string().optional(),
});
