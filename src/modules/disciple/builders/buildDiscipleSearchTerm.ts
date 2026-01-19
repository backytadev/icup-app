import { DiscipleSearchType } from '@/modules/disciple/enums/disciple-search-type.enum';
import { DiscipleQueryParams } from '@/modules/disciple/interfaces/disciple-query-params.interface';

export const buildDiscipleSearchTerm = (params: DiscipleQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<DiscipleSearchType, string | undefined> = {
    [DiscipleSearchType.BirthDate]: dateTerm,
    [DiscipleSearchType.BirthMonth]: selectTerm,
    [DiscipleSearchType.Gender]: selectTerm,
    [DiscipleSearchType.MaritalStatus]: selectTerm,
    [DiscipleSearchType.ZoneName]: inputTerm,
    [DiscipleSearchType.FamilyGroupCode]: inputTerm,
    [DiscipleSearchType.FamilyGroupName]: inputTerm,
    [DiscipleSearchType.OriginCountry]: inputTerm,
    [DiscipleSearchType.ResidenceCountry]: inputTerm,
    [DiscipleSearchType.ResidenceDepartment]: inputTerm,
    [DiscipleSearchType.ResidenceProvince]: inputTerm,
    [DiscipleSearchType.ResidenceDistrict]: inputTerm,
    [DiscipleSearchType.ResidenceUrbanSector]: inputTerm,
    [DiscipleSearchType.ResidenceAddress]: inputTerm,
    [DiscipleSearchType.RecordStatus]: selectTerm,
    [DiscipleSearchType.FirstNames]: firstNamesTerm,
    [DiscipleSearchType.LastNames]: lastNamesTerm,
    [DiscipleSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as DiscipleSearchType];
};
