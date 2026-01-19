import { PreacherSearchType } from '@/modules/preacher/enums/preacher-search-type.enum';
import { PreacherQueryParams } from '@/modules/preacher/interfaces/preacher-query-params.interface';

export const buildPreacherSearchTerm = (params: PreacherQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm, zoneTerm } =
    params;

  const mapping: Partial<Record<PreacherSearchType, string | undefined>> = {
    [PreacherSearchType.BirthDate]: dateTerm,
    [PreacherSearchType.BirthMonth]: selectTerm,
    [PreacherSearchType.Gender]: selectTerm,
    [PreacherSearchType.MaritalStatus]: selectTerm,
    [PreacherSearchType.ZoneName]: inputTerm,
    [PreacherSearchType.AvailablePreachersByZone]: zoneTerm,
    [PreacherSearchType.FamilyGroupCode]: inputTerm,
    [PreacherSearchType.FamilyGroupName]: inputTerm,
    [PreacherSearchType.OriginCountry]: inputTerm,
    [PreacherSearchType.ResidenceCountry]: inputTerm,
    [PreacherSearchType.ResidenceDepartment]: inputTerm,
    [PreacherSearchType.ResidenceProvince]: inputTerm,
    [PreacherSearchType.ResidenceDistrict]: inputTerm,
    [PreacherSearchType.ResidenceUrbanSector]: inputTerm,
    [PreacherSearchType.ResidenceAddress]: inputTerm,
    [PreacherSearchType.RecordStatus]: selectTerm,
    [PreacherSearchType.FirstNames]: firstNamesTerm,
    [PreacherSearchType.LastNames]: lastNamesTerm,
    [PreacherSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as PreacherSearchType];
};
