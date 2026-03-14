export interface CalendarEventFormData {
  churchId?: string;
  title: string;
  description: string;
  category: string;
  status: string;
  startDate: Date;
  endDate?: Date | undefined;
  locationName?: string | undefined;
  locationReference?: string | undefined;
  latitude?: string | undefined;
  longitude?: string | undefined;
  targetGroups: string[];
  isPublic: boolean;
  fileNames?: string[] | undefined;
  imageUrls?: string[] | undefined;
  recordStatus?: string | undefined;
}

export type CalendarEventFormDataKeys =
  | 'churchId'
  | 'title'
  | 'description'
  | 'category'
  | 'status'
  | 'startDate'
  | 'endDate'
  | 'locationName'
  | 'locationReference'
  | 'latitude'
  | 'longitude'
  | 'targetGroups'
  | 'isPublic'
  | 'fileNames'
  | 'imageUrls'
  | 'recordStatus';
