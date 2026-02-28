export interface ZoneQueryParams {
  firstNamesTerm?: string;
  lastNamesTerm?: string;
  searchType: string;
  searchSubType?: string;
  inputTerm?: string;
  selectTerm?: string;
  limit?: string;
  offset?: string;
  order: string;
  churchId?: string;

  //* Validator for get all register
  all?: boolean;
}
