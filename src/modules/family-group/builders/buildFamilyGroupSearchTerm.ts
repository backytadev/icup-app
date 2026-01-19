import { FamilyGroupSearchType } from '@/modules/family-group/enums/family-group-search-type.enum';
import { FamilyGroupQueryParams } from '@/modules/family-group/interfaces/family-group-query-params.interface';

export const buildFamilyGroupSearchTerm = (params: FamilyGroupQueryParams): string | undefined => {
  const { searchType, inputTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Partial<Record<FamilyGroupSearchType, string | undefined>> = {
    [FamilyGroupSearchType.ZoneName]: inputTerm,
    [FamilyGroupSearchType.FamilyGroupCode]: inputTerm,
    [FamilyGroupSearchType.FamilyGroupName]: inputTerm,
    [FamilyGroupSearchType.Country]: inputTerm,
    [FamilyGroupSearchType.Department]: inputTerm,
    [FamilyGroupSearchType.Province]: inputTerm,
    [FamilyGroupSearchType.District]: inputTerm,
    [FamilyGroupSearchType.UrbanSector]: inputTerm,
    [FamilyGroupSearchType.Address]: inputTerm,
    [FamilyGroupSearchType.RecordStatus]: selectTerm,
    [FamilyGroupSearchType.FirstNames]: firstNamesTerm,
    [FamilyGroupSearchType.LastNames]: lastNamesTerm,
    [FamilyGroupSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as FamilyGroupSearchType];
};
