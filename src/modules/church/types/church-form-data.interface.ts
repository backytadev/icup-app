import { type z } from 'zod';

import { type churchFormSchema } from '@/modules/church/schemas/church-form-schema';

export type ChurchFormData = z.infer<typeof churchFormSchema>;

export type ChurchFormDataKeys = keyof ChurchFormData;
