import { CopastorSearchType } from '@/modules/copastor/enums/copastor-search-type.enum';
import { CopastorQueryParams } from '@/modules/copastor/interfaces/copastor-query-params.interface';

export const buildCopastorSearchTerm = (params: CopastorQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<CopastorSearchType, string | undefined> = {
    [CopastorSearchType.BirthDate]: dateTerm,
    [CopastorSearchType.BirthMonth]: selectTerm,
    [CopastorSearchType.Gender]: selectTerm,
    [CopastorSearchType.MaritalStatus]: selectTerm,
    [CopastorSearchType.OriginCountry]: inputTerm,
    [CopastorSearchType.ResidenceCountry]: inputTerm,
    [CopastorSearchType.ResidenceDepartment]: inputTerm,
    [CopastorSearchType.ResidenceProvince]: inputTerm,
    [CopastorSearchType.ResidenceDistrict]: inputTerm,
    [CopastorSearchType.ResidenceUrbanSector]: inputTerm,
    [CopastorSearchType.ResidenceAddress]: inputTerm,
    [CopastorSearchType.RecordStatus]: selectTerm,
    [CopastorSearchType.FirstNames]: firstNamesTerm,
    [CopastorSearchType.LastNames]: lastNamesTerm,
    [CopastorSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as CopastorSearchType];
};
