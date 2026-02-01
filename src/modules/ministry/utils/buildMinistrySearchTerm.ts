import { type MinistryQueryParams } from '@/modules/ministry/types';
import { MinistrySearchType } from '@/modules/ministry/enums/ministry-search-type.enum';

export const buildMinistrySearchTerm = (params: MinistryQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<MinistrySearchType, string | undefined> = {
    [MinistrySearchType.MinistryCustomName]: inputTerm,
    [MinistrySearchType.Department]: inputTerm,
    [MinistrySearchType.Province]: inputTerm,
    [MinistrySearchType.District]: inputTerm,
    [MinistrySearchType.UrbanSector]: inputTerm,
    [MinistrySearchType.Address]: inputTerm,
    [MinistrySearchType.FoundingDate]: dateTerm,
    [MinistrySearchType.RecordStatus]: selectTerm,
    [MinistrySearchType.MinistryType]: selectTerm,
    [MinistrySearchType.FirstNames]: firstNamesTerm,
    [MinistrySearchType.LastNames]: lastNamesTerm,
    [MinistrySearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as MinistrySearchType];
};
