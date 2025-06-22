export interface OfferingIncomeQueryParams {
  searchType: string;
  searchSubType?: string;
  firstNamesTerm?: string;
  lastNamesTerm?: string;
  inputTerm?: string;
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
