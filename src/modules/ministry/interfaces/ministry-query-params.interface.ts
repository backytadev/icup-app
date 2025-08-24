export interface MinistryQueryParams {
  firstNamesTerm?: string;
  lastNamesTerm?: string;
  searchType: string;
  searchSubType?: string;
  inputTerm?: string;
  dateTerm?: string;
  selectTerm?: string;
  limit?: string;
  offset?: string;
  order: string;
  churchId?: string;

  //* Validator for get all register
  all?: boolean;
}
