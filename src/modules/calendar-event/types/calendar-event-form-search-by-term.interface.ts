export interface CalendarEventSearchFormByTerm {
  searchType: string;
  inputTerm?: string;
  selectTerm?: string;
  dateTerm?: { from: Date; to?: Date } | string;
  limit?: number;
  offset?: number;
  order?: string;
  all?: boolean;
}
