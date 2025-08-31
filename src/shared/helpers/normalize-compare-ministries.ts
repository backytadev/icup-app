import { PastorFormData } from '@/modules/pastor/interfaces/pastor-form-data.interface';
import { CopastorFormData } from '@/modules/copastor/interfaces/copastor-form-data.interface';
import { DiscipleFormData } from '@/modules/disciple/interfaces/disciple-form-data.interface';
import { PreacherFormData } from '@/modules/preacher/interfaces/preacher-form-data.interface';
import { SupervisorFormData } from '@/modules/supervisor/interfaces/supervisor-form-data.interface';

const normalizeMinistries = (ministries: any[]) => {
  return [...ministries].sort((a, b) => {
    if (a.ministryId < b.ministryId) return -1;
    if (a.ministryId > b.ministryId) return 1;
    if (a.ministryType < b.ministryType) return -1;
    if (a.ministryType > b.ministryType) return 1;
    return 0;
  });
};

export const ministriesEqualIgnoreOrder = (fixed: any[], current: any[]) => {
  const normA = normalizeMinistries(fixed);
  const normB = normalizeMinistries(current);

  return JSON.stringify(normA) === JSON.stringify(normB);
};

export const rolesEqualIgnoreOrder = (
  fixed:
    | DiscipleFormData[]
    | PreacherFormData[]
    | SupervisorFormData[]
    | CopastorFormData[]
    | PastorFormData[],
  current:
    | DiscipleFormData[]
    | PreacherFormData[]
    | SupervisorFormData[]
    | CopastorFormData[]
    | PastorFormData[]
): boolean => {
  const sortedA = Array.isArray(fixed[17]) && fixed[17]?.sort();
  const sortedB = Array.isArray(current[17]) && current[17]?.sort();

  return JSON.stringify(sortedA) === JSON.stringify(sortedB);
};
