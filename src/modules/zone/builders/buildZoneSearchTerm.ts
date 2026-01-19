import { ZoneSearchType } from '@/modules/zone/enums/zone-search-type.enum';
import { ZoneQueryParams } from '@/modules/zone/interfaces/zone-query-params.interface';

export const buildZoneSearchTerm = (params: ZoneQueryParams): string | undefined => {
  const { searchType, inputTerm, selectTerm, firstNamesTerm, lastNamesTerm } = params;

  const mapping: Record<ZoneSearchType, string | undefined> = {
    [ZoneSearchType.ZoneName]: inputTerm,
    [ZoneSearchType.Country]: inputTerm,
    [ZoneSearchType.Department]: inputTerm,
    [ZoneSearchType.Province]: inputTerm,
    [ZoneSearchType.District]: inputTerm,
    [ZoneSearchType.RecordStatus]: selectTerm,
    [ZoneSearchType.FirstNames]: firstNamesTerm,
    [ZoneSearchType.LastNames]: lastNamesTerm,
    [ZoneSearchType.FullNames]:
      firstNamesTerm && lastNamesTerm ? `${firstNamesTerm}-${lastNamesTerm}` : undefined,
  };

  return mapping[searchType as ZoneSearchType];
};
