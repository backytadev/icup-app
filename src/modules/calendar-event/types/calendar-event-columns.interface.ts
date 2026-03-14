import { type UpdatedBy } from '@/shared/interfaces/relations-response.interface';

export interface CalendarEventColumns {
  id: string;
  title: string;
  category: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  targetGroups: string[];
  isPublic: boolean;
  recordStatus: string;
  updatedBy?: UpdatedBy;
}
