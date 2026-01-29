import { ChurchSearchType } from '@/modules/church/enums';
import { ChurchQueryParams } from '@/modules/church/types';

export const buildChurchSearchTerm = (params: ChurchQueryParams): string | undefined => {
  const { searchType, inputTerm, dateTerm, selectTerm } = params;

  const mapping: Record<ChurchSearchType, string | undefined> = {
    [ChurchSearchType.ChurchName]: inputTerm,
    [ChurchSearchType.Department]: inputTerm,
    [ChurchSearchType.Province]: inputTerm,
    [ChurchSearchType.District]: inputTerm,
    [ChurchSearchType.UrbanSector]: inputTerm,
    [ChurchSearchType.Address]: inputTerm,
    [ChurchSearchType.FoundingDate]: dateTerm,
    [ChurchSearchType.RecordStatus]: selectTerm,
  };

  return mapping[searchType as ChurchSearchType];
};
