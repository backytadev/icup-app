import { UseFormReturn } from 'react-hook-form';

import { type PastorFormData } from '@/modules/pastor/types';
import { CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';
import { DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';
import { PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';
import { SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

export type MemberFormData =
  | DiscipleFormData
  | PreacherFormData
  | SupervisorFormData
  | CopastorFormData
  | PastorFormData;

export type MemberUseFormReturn = UseFormReturn<MemberFormData, any, MemberFormData | undefined>;
