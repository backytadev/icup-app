import {
  type Anexe,
  type CreatedBy,
  type UpdatedBy,
} from '@/shared/interfaces/relations-response.interface';

export interface CalendarEventResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  startDate: Date;
  endDate?: Date;
  locationName?: string;
  locationReference?: string;
  latitude?: string;
  longitude?: string;
  targetGroups: string[];
  isPublic: boolean;
  imageUrls?: string[];
  createdAt?: Date;
  createdBy?: CreatedBy;
  updatedAt?: Date;
  updatedBy?: UpdatedBy;
  recordStatus: string;
  church?: Anexe | null;
}
