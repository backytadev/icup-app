import { type CalendarEventFormData } from '@/modules/calendar-event/types/calendar-event-form-data.interface';

export const calendarEventCreateDefaultValues: Partial<CalendarEventFormData> = {
  churchId: '',
  title: '',
  description: '',
  category: '',
  status: '',
  startDate: undefined,
  endDate: undefined,
  locationName: '',
  locationReference: '',
  latitude: '',
  longitude: '',
  targetGroups: [],
  isPublic: false,
  fileNames: [],
  imageUrls: [],
};

export const calendarEventUpdateDefaultValues: Partial<CalendarEventFormData> = {
  churchId: '',
  title: '',
  description: '',
  category: '',
  status: '',
  startDate: undefined,
  endDate: undefined,
  locationName: '',
  locationReference: '',
  latitude: '',
  longitude: '',
  targetGroups: [],
  isPublic: false,
  fileNames: [],
  imageUrls: [],
  recordStatus: '',
};
