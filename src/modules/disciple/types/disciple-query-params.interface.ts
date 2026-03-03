export interface DiscipleQueryParams {
  firstNamesTerm?: string;
  lastNamesTerm?: string;
  inputTerm?: string;
  dateTerm?: string;
  selectTerm?: string;
  searchType?: string;
  searchSubType?: string;
  limit?: string;
  offset?: string;
  order: string;
  churchId?: string;

  //* Validator for get all register
  all?: boolean;
}
