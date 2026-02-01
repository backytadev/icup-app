import { type z } from 'zod';

import { ministryFormSchema } from '@/modules/ministry/schemas/ministry-form-schema';

export type MinistryFormData = z.infer<typeof ministryFormSchema>;
export type MinistryFormDataKeys = keyof MinistryFormData;
