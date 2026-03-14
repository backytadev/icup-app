import { apiRequest } from '@/shared/helpers/api-request';
import { getContextParams } from '@/shared/helpers/get-context-params';

import { type CalendarEventFormData } from '@/modules/calendar-event/types/calendar-event-form-data.interface';
import { type CalendarEventResponse } from '@/modules/calendar-event/types/calendar-event-response.interface';
import { type CalendarEventQueryParams } from '@/modules/calendar-event/types/calendar-event-query-params.interface';
import { CalendarEventSearchType } from '@/modules/calendar-event/enums/calendar-event-search-type.enum';
import { FileFolder } from '@/shared/enums/offering-file-type.enum';

export interface UpdateEventOptions {
  id: string;
  formData: CalendarEventFormData;
}

export interface InactivateEventOptions {
  id: string;
  eventInactivationReason?: string;
  eventInactivationDescription?: string;
}

//* Inline builder: resolve search term
const buildCalendarEventSearchTerm = (params: CalendarEventQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm } = params;

  const mapping: Partial<Record<CalendarEventSearchType, string | undefined>> = {
    [CalendarEventSearchType.Title]: inputTerm,
    [CalendarEventSearchType.Category]: selectTerm,
    [CalendarEventSearchType.Date]: dateTerm,
    [CalendarEventSearchType.TargetGroup]: selectTerm,
    [CalendarEventSearchType.Status]: selectTerm,
  };

  return mapping[searchType as CalendarEventSearchType];
};

//* Inline builder: build query params
const buildCalendarEventQueryParams = (params: CalendarEventQueryParams, term?: string) => {
  const { limit, offset, order, all, searchType } = params;

  const base: Record<string, any> = {
    term,
    searchType,
    order,
  };

  if (!all) {
    base.limit = limit;
    base.offset = offset;
  }

  return base;
};

//* Create
export const createCalendarEvent = async (
  formData: CalendarEventFormData
): Promise<CalendarEventResponse> => {
  return apiRequest('post', '/calendar-events', formData);
};

//* Find all
export const getCalendarEvents = async (
  params: CalendarEventQueryParams
): Promise<CalendarEventResponse[]> => {
  const { limit, offset, order, all, churchId } = params;
  const { churchId: contextChurchId } = getContextParams();
  const resolvedChurchId = churchId ?? contextChurchId;

  const query = all
    ? { order, churchId: resolvedChurchId }
    : { limit, offset, order, churchId: resolvedChurchId };

  return apiRequest<CalendarEventResponse[]>('get', '/calendar-events', { params: query });
};

//* Find by filters
export const getCalendarEventsByFilters = async (
  params: CalendarEventQueryParams
): Promise<CalendarEventResponse[]> => {
  const term = buildCalendarEventSearchTerm(params);
  const queryParams = buildCalendarEventQueryParams(params, term);
  const { churchId } = getContextParams();

  return apiRequest<CalendarEventResponse[]>('get', '/calendar-events/search', {
    params: { ...queryParams, churchId },
  });
};

//* Get one by id
export const getCalendarEventById = async (id: string): Promise<CalendarEventResponse> => {
  return apiRequest<CalendarEventResponse>('get', `/calendar-events/${id}`);
};

//* Update
export const updateCalendarEvent = async ({
  id,
  formData,
}: UpdateEventOptions): Promise<CalendarEventResponse> => {
  return apiRequest('patch', `/calendar-events/${id}`, formData);
};

//* Inactivate
export const inactivateCalendarEvent = async ({
  id,
  eventInactivationReason,
  eventInactivationDescription,
}: InactivateEventOptions): Promise<void> => {
  return apiRequest('delete', `/calendar-events/${id}`, {
    params: { eventInactivationReason, eventInactivationDescription },
  });
};

export interface DeleteImageOptions {
  publicId: string;
  path: string;
  secureUrl: string;
  fileFolder: FileFolder;
}
