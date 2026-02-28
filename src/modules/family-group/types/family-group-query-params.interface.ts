export interface FamilyGroupQueryParams {
  firstNamesTerm?: string;
  lastNamesTerm?: string;
  inputTerm?: string;
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
