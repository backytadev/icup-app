export interface ChurchQueryParams {
  searchType: string;
  inputTerm?: string;
  dateTerm?: string;
  selectTerm?: string;
  limit?: string;
  offset?: string;
  order: string;

  //* Validator for get all register
  isSimpleQuery?: boolean;
  all?: boolean;
}
