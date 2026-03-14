export interface CalendarEventQueryParams {
  limit?: number;
  offset?: number;
  order?: string;
  all?: boolean;
  churchId?: string;
  searchType?: string;
  searchDate?: string;
  inputTerm?: string;
  selectTerm?: string;
  dateTerm?: string;
}
