import { z } from 'zod';

export const MinistryAssignmentSchema = z.object({
  ministryId: z.string().nullable(),
  ministryRoles: z.array(z.string()).min(1),
});
