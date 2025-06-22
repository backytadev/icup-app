export interface OfferingExpenseQueryParams {
  searchType: string;
  searchSubType?: string;
  dateTerm?: string;
  selectTerm?: string;
  limit?: string;
  offset?: string;
  order: string;
  churchId?: string;

  //* Validator for get all register
  all?: boolean;
  allByDate?: boolean;
}
