export interface UserQueryParams {
  searchType?: string;
  multiSelectTerm?: string;
  selectTerm?: string;
  firstNamesTerm: string;
  lastNamesTerm?: string;
  limit?: string;
  offset?: string;
  order: string;

  //* Validator for get all register
  all?: boolean;
}
