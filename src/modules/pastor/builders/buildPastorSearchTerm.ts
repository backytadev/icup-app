import { PastorQueryParams } from '@/modules/pastor/interfaces/pastor-query-params.interface';
import { PastorSearchType } from '@/modules/pastor/enums/pastor-search-type.enum';

export const buildPastorSearchTerm = (params: PastorQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<PastorSearchType, string | undefined> = {
    [PastorSearchType.BirthDate]: dateTerm,
    [PastorSearchType.BirthMonth]: selectTerm,
    [PastorSearchType.Gender]: selectTerm,
    [PastorSearchType.MaritalStatus]: selectTerm,
    [PastorSearchType.OriginCountry]: inputTerm,
    [PastorSearchType.ResidenceCountry]: inputTerm,
    [PastorSearchType.ResidenceDepartment]: inputTerm,
    [PastorSearchType.ResidenceProvince]: inputTerm,
    [PastorSearchType.ResidenceDistrict]: inputTerm,
    [PastorSearchType.ResidenceUrbanSector]: inputTerm,
    [PastorSearchType.ResidenceAddress]: inputTerm,
    [PastorSearchType.RecordStatus]: selectTerm,
    [PastorSearchType.FirstNames]: firstNamesTerm,
    [PastorSearchType.LastNames]: lastNamesTerm,
    [PastorSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as PastorSearchType];
};
